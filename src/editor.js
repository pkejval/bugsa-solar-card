// Visual editor. Built for phones: one accordion item open at a time, one sensor pick per item
// (companion sensors are found on the same device), large touch targets, HA's own ha-form fields.
import { strings } from './i18n.js';
import { findSiblings, suggestName } from './autofill.js';

const SECTIONS = {
  solar: { main: 'power', dc: 'power', fill: { voltage: 'voltage', current: 'current' }, icon: 'mdi:solar-panel-large', byDevice: false },
  batteries: { main: 'soc', dc: 'battery', fill: { voltage: 'voltage', current: 'current', power: 'power', temperature: 'temperature' }, icon: 'mdi:battery-high', byDevice: true },
  loads: { main: 'power', dc: 'power', fill: null, icon: 'mdi:home-lightning-bolt-outline', byDevice: false },
};

const DEFAULTS = {
  appearance: 'auto', animation: true, show_kpis: true, show_stats: true, show_total: true,
  history_hours: 12, threshold: 10, min_soc: 0,
};
const GENERAL_KEYS = ['title', ...Object.keys(DEFAULTS)];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clean = (o) => Object.fromEntries(Object.entries(o).filter(([k, v]) =>
  v !== '' && v != null && !(k === 'invert' && v === false)));

async function loadHaForm() {
  if (customElements.get('ha-form') && customElements.get('ha-entity-picker')) return;
  try {
    // HA lazy-loads form elements; opening a built-in card editor pulls them in.
    const helpers = await window.loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: 'entities', entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch (e) {
    // Fall through: whenDefined resolves once HA loads ha-form by other means.
  }
  await customElements.whenDefined('ha-form');
}

const STYLES = `
:host { display: block; }
.ed { display: grid; gap: 22px; }
.note { padding: 12px 14px; border-radius: 12px; font-size: 14px; line-height: 1.45;
  background: color-mix(in srgb, var(--primary-color) 12%, transparent); }
.sec { display: grid; gap: 10px; }
.sec-h { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; }
.sec-h ha-icon { color: var(--primary-color); }
.cnt { margin-left: auto; font-size: 13px; font-weight: 400; color: var(--secondary-text-color); }
.hint { margin: -4px 0 2px; font-size: 13px; line-height: 1.4; color: var(--secondary-text-color); }
.none { padding: 2px; font-size: 14px; color: var(--secondary-text-color); }
.it { border: 1px solid var(--divider-color); border-radius: 14px; background: var(--card-background-color); overflow: hidden; }
.it.open { border-color: var(--primary-color); }
.it-h { display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 6px 8px 6px 14px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.it-h > ha-icon { color: var(--secondary-text-color); flex: none; }
.it-t { flex: 1; min-width: 0; display: grid; gap: 1px; }
.it-n, .it-v { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.it-n { font-size: 15px; font-weight: 600; }
.it-v { font-size: 13px; color: var(--secondary-text-color); }
.it-v.miss { color: var(--warning-color, #e6a23c); }
.chev { transition: transform .2s; }
.open .chev { transform: rotate(180deg); }
.it-b { padding: 6px 14px 12px; border-top: 1px solid var(--divider-color); }
.acts { display: flex; align-items: center; gap: 4px; margin-top: 8px; }
.ib { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 44px; height: 44px;
  padding: 0 10px; border: 0; border-radius: 22px; background: none; color: var(--secondary-text-color);
  font: inherit; font-size: 14px; cursor: pointer; }
.ib:hover { background: var(--secondary-background-color); }
.ib[disabled] { opacity: .3; pointer-events: none; }
.ib.del { margin-left: auto; color: var(--error-color, #db4437); }
.ib.del.armed { background: var(--error-color, #db4437); color: #fff; font-weight: 600; }
.add { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; width: 100%;
  border: 1.5px dashed var(--divider-color); border-radius: 14px; background: none;
  color: var(--primary-color); font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
.add:hover { border-color: var(--primary-color); }
.all { display: flex; align-items: center; gap: 12px; min-height: 44px; font-size: 14px; color: var(--secondary-text-color); cursor: pointer; }
.all input { width: 20px; height: 20px; margin: 0; accent-color: var(--primary-color); }
`;

class BugsaSolarCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._open = null;
    this._all = false;
    this._forms = [];
    this.shadowRoot.addEventListener('click', (e) => this._click(e));
    this.shadowRoot.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('it-h')) {
        e.preventDefault();
        this._click(e);
      }
    });
  }

  setConfig(config) {
    const json = JSON.stringify(config);
    if (json === this._json) return; // echo of our own config-changed
    this._json = json;
    this._config = JSON.parse(json);
    this._render();
  }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    for (const f of this._forms) f.hass = h;
    if (first) this._render();
    else this._live();
  }

  connectedCallback() {
    loadHaForm().then(() => {
      this._ready = true;
      this._render();
    });
  }

  // ---------- rendering ----------

  _item(sec, i) {
    const it = this._config[sec]?.[i];
    return typeof it === 'string' ? { [SECTIONS[sec].main]: it } : { ...it };
  }

  _render() {
    if (!this._ready || !this._config || !this._hass) return;
    const t = (this._t = strings(this._hass.language));
    const e = t.ed, c = this._config;

    const sections = Object.entries(SECTIONS).map(([sec, def]) => {
      const list = c[sec] || [];
      const items = list.map((_, i) => {
        const key = `${sec}:${i}`, open = this._open === key, it = this._item(sec, i);
        return `<div class="it${open ? ' open' : ''}" data-key="${key}">
<div class="it-h" data-act="toggle" role="button" tabindex="0" aria-expanded="${open}">
<ha-icon icon="${def.icon}"></ha-icon>
<div class="it-t"><span class="it-n" data-n="${key}">${esc(it.name || `${e.newItem[sec]} ${i + 1}`)}</span><span class="it-v" data-v="${key}"></span></div>
<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></div>
${open ? `<div class="it-b"><div data-form="${key}"></div><div class="acts">
<button class="ib" data-act="up" title="${e.up}" ${i === 0 ? 'disabled' : ''}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
<button class="ib" data-act="down" title="${e.down}" ${i === list.length - 1 ? 'disabled' : ''}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
<button class="ib del" data-act="del"><ha-icon icon="mdi:delete-outline"></ha-icon><span>${e.del}</span></button>
</div></div>` : ''}</div>`;
      }).join('');
      return `<section class="sec" data-sec="${sec}">
<div class="sec-h"><ha-icon icon="${def.icon}"></ha-icon>${e.sections[sec]}<span class="cnt">${list.length || ''}</span></div>
${list.length ? `<p class="hint">${e.hint[sec]}</p>${items}` : `<div class="none">${e.none[sec]}</div>`}
<button class="add" data-act="add"><ha-icon icon="mdi:plus"></ha-icon>${e.add[sec]}</button>
</section>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${STYLES}</style><div class="ed">
${c.demo ? `<div class="note">${e.demoNote}</div>` : ''}
${sections}
<section class="sec"><div class="sec-h"><ha-icon icon="mdi:palette-outline"></ha-icon>${e.look}</div><div data-form="general"></div></section>
<label class="all"><input type="checkbox" data-act="all" ${this._all ? 'checked' : ''}>${e.showAll}</label>
</div>`;

    this._forms = [];
    for (const slot of this.shadowRoot.querySelectorAll('[data-form]')) {
      const key = slot.dataset.form;
      const form = document.createElement('ha-form');
      form.hass = this._hass;
      form.computeLabel = (s) => this._label(s);
      if (key === 'general') {
        form.schema = this._generalSchema();
        form.data = { ...DEFAULTS, ...c };
        form.addEventListener('value-changed', (ev) => this._onGeneral(ev));
      } else {
        const [sec, i] = key.split(':');
        form.schema = this._itemSchema(sec);
        form.data = this._item(sec, +i);
        form.addEventListener('value-changed', (ev) => this._onItem(ev, sec, +i, form));
      }
      slot.replaceWith(form);
      this._forms.push(form);
    }
    this._live();
  }

  _label(s) {
    const e = this._t.ed;
    if (s.selector?.color_rgb) return { solar: e.cSolar, battery: e.cBattery, load: e.cLoad }[s.name];
    return e[s.name] ?? s.name;
  }

  _sensor(dc) {
    return { entity: this._all || !dc ? { domain: 'sensor' } : { domain: 'sensor', device_class: dc } };
  }

  _itemSchema(sec) {
    const e = this._t.ed, S = (dc) => this._sensor(dc);
    const more = (schema) => ({ name: 'more', type: 'expandable', flatten: true, title: e.more, schema });
    if (sec === 'solar') {
      return [
        { name: 'power', selector: S('power') },
        { name: 'name', selector: { text: {} } },
        more([{ name: 'voltage', selector: S('voltage') }, { name: 'current', selector: S('current') }]),
      ];
    }
    if (sec === 'batteries') {
      return [
        { name: 'soc', selector: S('battery') },
        { name: 'name', selector: { text: {} } },
        { name: 'capacity', selector: { number: { min: 0, max: 1000, step: 0.01, mode: 'box', unit_of_measurement: 'kWh' } } },
        more([
          { name: 'voltage', selector: S('voltage') },
          { name: 'current', selector: S('current') },
          { name: 'power', selector: S('power') },
          { name: 'temperature', selector: S('temperature') },
          { name: 'invert', selector: { boolean: {} } },
        ]),
      ];
    }
    const icons = Object.entries(e.icons).map(([value, label]) => ({ value, label }));
    const cur = this._item(sec, +this._open?.split(':')[1]).icon;
    if (cur && !e.icons[cur]) icons.push({ value: cur, label: cur });
    return [
      { name: 'power', selector: S('power') },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { select: { mode: 'dropdown', options: icons } } },
    ];
  }

  _generalSchema() {
    const e = this._t.ed;
    const bool = (name) => ({ name, selector: { boolean: {} } });
    return [
      { name: 'title', selector: { text: {} } },
      { name: 'appearance', selector: { select: { mode: 'list', options: [{ value: 'auto', label: e.apAuto }, { value: 'dark', label: e.apDark }] } } },
      {
        name: 'advanced', type: 'expandable', flatten: true, title: e.advanced, schema: [
          bool('animation'), bool('show_kpis'), bool('show_stats'), bool('show_total'),
          { name: 'history_hours', selector: { number: { min: 0, max: 48, step: 1, mode: 'slider' } } },
          { name: 'min_soc', selector: { number: { min: 0, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'threshold', selector: { number: { min: 0, max: 500, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          {
            name: 'colors', type: 'expandable', title: e.colors, schema: [
              { name: 'solar', selector: { color_rgb: {} } },
              { name: 'battery', selector: { color_rgb: {} } },
              { name: 'load', selector: { color_rgb: {} } },
            ],
          },
        ],
      },
    ];
  }

  /** Header subtitle: current value of the main sensor, so the owner sees they picked the right one. */
  _live() {
    if (!this._t) return;
    for (const el of this.shadowRoot.querySelectorAll('[data-v]')) {
      const [sec, i] = el.dataset.v.split(':');
      const id = this._item(sec, +i)[SECTIONS[sec].main];
      const st = id && this._hass.states[id];
      const txt = !id ? this._t.ed.noSensor
        : st ? `${st.state} ${st.attributes.unit_of_measurement ?? ''}`.trim() : id;
      el.classList.toggle('miss', !id);
      if (el.textContent !== txt) el.textContent = txt;
    }
  }

  // ---------- changes ----------

  _fire() {
    this._json = JSON.stringify(this._config);
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: JSON.parse(this._json) }, bubbles: true, composed: true,
    }));
  }

  _onItem(ev, sec, i, form) {
    ev.stopPropagation();
    const def = SECTIONS[sec], prev = this._item(sec, i);
    const next = clean(ev.detail.value);
    const picked = next[def.main];
    if (picked && picked !== prev[def.main]) {
      if (def.fill) {
        for (const [k, v] of Object.entries(findSiblings(this._hass, picked, def.fill))) if (!next[k]) next[k] = v;
      }
      if (!next.name) next.name = suggestName(this._hass, picked, def.byDevice);
      form.data = next;
    }
    this._config[sec][i] = next;
    const n = this.shadowRoot.querySelector(`[data-n="${sec}:${i}"]`);
    if (n) n.textContent = next.name || `${this._t.ed.newItem[sec]} ${i + 1}`;
    this._live();
    this._fire();
  }

  _onGeneral(ev) {
    ev.stopPropagation();
    const v = ev.detail.value, c = this._config;
    for (const k of GENERAL_KEYS) {
      if (v[k] === undefined || v[k] === '' || v[k] === DEFAULTS[k]) delete c[k];
      else c[k] = v[k];
    }
    const colors = clean(v.colors || {});
    if (Object.keys(colors).length) c.colors = colors;
    else delete c.colors;
    this._fire();
  }

  _click(ev) {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'all') {
      this._all = btn.checked;
      this._render();
      return;
    }
    const sec = btn.closest('[data-sec]')?.dataset.sec;
    const key = btn.closest('[data-key]')?.dataset.key;
    const i = key ? +key.split(':')[1] : -1;
    const c = this._config;

    if (act === 'toggle') {
      this._open = this._open === key ? null : key;
    } else if (act === 'add') {
      c[sec] = [...(c[sec] || []), {}];
      delete c.demo;
      this._open = `${sec}:${c[sec].length - 1}`;
      this._fire();
    } else if (act === 'del') {
      if (!btn.classList.contains('armed')) {
        btn.classList.add('armed');
        btn.lastElementChild.textContent = this._t.ed.confirm;
        setTimeout(() => {
          btn.classList.remove('armed');
          btn.lastElementChild.textContent = this._t.ed.del;
        }, 3000);
        return;
      }
      c[sec].splice(i, 1);
      if (!c[sec].length) delete c[sec];
      this._open = null;
      this._fire();
    } else if (act === 'up' || act === 'down') {
      const j = act === 'up' ? i - 1 : i + 1;
      [c[sec][i], c[sec][j]] = [c[sec][j], c[sec][i]];
      this._open = `${sec}:${j}`;
      this._fire();
    }
    this._render();
  }
}

if (!customElements.get('bugsa-solar-card-editor')) {
  customElements.define('bugsa-solar-card-editor', BugsaSolarCardEditor);
}
