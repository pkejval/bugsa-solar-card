import { STYLES } from './styles.js';
import { ART, DEFS, ICON, loadArt } from './icons.js';
import { strings } from './i18n.js';
import {
  computeModel, flowDuration, fmtDuration, fmtPower, fmtUnit, helbow, numberFormat,
  read, runtimeHours, socLevel, sparkPath, velbow, DASH,
} from './model.js';
import { History } from './history.js';
import { demoSeries, demoStates } from './demo.js';
import { normalizeConfig } from './config.js';
import './editor.js';

/* global __VERSION__ */
const VERSION = typeof __VERSION__ === 'string' ? __VERSION__ : 'dev';
const TAG = 'bugsa-solar-card';
const SAMPLE_MS = 10_000;
const DEMO_MS = 2_000;
const ENTITY_KEYS = ['power', 'voltage', 'current', 'soc', 'temperature', 'capacity'];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const spark = (key) => (key
  ? `<svg class="spark" viewBox="0 0 72 32" preserveAspectRatio="none" aria-hidden="true"><path data-s="${esc(key)}"/></svg>`
  : '');

class BugsaSolarCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._seen = {};
    this._visible = true;
    this._get = (id) => (this._cfg?.demo ? this._demo?.[id] : this._hass?.states[id]);
  }

  static getStubConfig() {
    return { demo: true };
  }

  static getConfigElement() {
    return document.createElement('bugsa-solar-card-editor');
  }

  setConfig(config) {
    const cfg = normalizeConfig(config);
    this._cfg = cfg;
    const all = [...cfg.solar, ...cfg.batteries, ...cfg.loads];
    this._ids = [...new Set(all.flatMap((o) => ENTITY_KEYS.map((k) => o[k]).filter((v) => typeof v === 'string')))];
    this._pvIds = cfg.solar.map((o) => o.power).filter(Boolean);
    this._ldIds = cfg.loads.map((o) => o.power).filter(Boolean);
    this._seen = {};
    this._built = false;
    this._emptyLang = null;
    this._hist = cfg.history_hours > 0 ? new History(cfg.history_hours, cfg.history_bars) : null;
    this._histInit = false;
    if (cfg.demo) this._demo = demoStates(Date.now());
    if (this.isConnected) {
      this._stop();
      this._start();
    }
    this._schedule();
  }

  set hass(h) {
    this._hass = h;
    if (!this._ids || this._cfg.demo) {
      if (this._cfg?.demo && !this._built) this._schedule();
      return;
    }
    let changed = !this._built || h.language !== this._lang;
    for (const id of this._ids) {
      const s = h.states[id];
      if (s !== this._seen[id]) {
        this._seen[id] = s;
        changed = true;
      }
    }
    if (changed) this._schedule();
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this._start();
    if (this._cfg) this._schedule(true);
  }

  disconnectedCallback() {
    this._stop();
  }

  getCardSize() {
    return 10;
  }

  getGridOptions() {
    return { columns: 'full', min_columns: 6 };
  }

  // ---------- lifecycle ----------

  _start() {
    if (this._timer) return;
    this._ro = new ResizeObserver(() => this._schedule(true));
    this._io = new IntersectionObserver(([e]) => {
      this._visible = e.isIntersecting;
      this._root?.classList.toggle('paused', !this._visible);
    });
    this._io.observe(this);
    if (this._card) this._ro.observe(this._card);
    this._timer = setInterval(() => this._sample(), SAMPLE_MS);
    if (this._cfg?.demo) {
      this._demoTimer = setInterval(() => {
        this._demo = demoStates(Date.now());
        if (this._visible) this._schedule();
      }, DEMO_MS);
    }
  }

  _stop() {
    clearInterval(this._timer);
    clearInterval(this._demoTimer);
    this._timer = this._demoTimer = 0;
    this._ro?.disconnect();
    this._io?.disconnect();
    cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  _schedule(layout = false) {
    if (layout) this._needLayout = true;
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this._render();
    });
  }

  _render() {
    const c = this._cfg;
    if (!c || (!c.demo && !this._hass)) return;
    const lang = this._hass?.language || navigator.language || 'en';
    if (c.empty) {
      if (this._emptyLang === lang) return;
      this._emptyLang = lang;
      this._built = false;
      this._card = this._flow = null;
      this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="root"><p class="empty">${ICON.panel}${strings(lang).empty}</p></div></ha-card>`;
      return;
    }
    if (!this._built || lang !== this._lang) this._build(lang);
    this._update();
    if (this._hist && !this._histInit) this._initHistory();
    if (this._needLayout) {
      this._needLayout = false;
      this._layout();
    }
  }

  // ---------- DOM ----------

  _build(lang) {
    const c = this._cfg;
    const t = (this._t = strings(lang));
    this._lang = lang;
    this._nf = numberFormat(lang);
    const hasPv = c.solar.length > 0, hasBat = c.batteries.length > 0, hasLd = c.loads.length > 0;
    const hist = !!this._hist;

    const kpi = [];
    if (hasPv) kpi.push(`<div class="kpi kpi-solar" data-i="kpv"><div class="tile">${ART.sun}</div>
<div class="txt"><span class="lbl ell">${t.kpiSolar}</span><span class="big num" data-k="kpv">${DASH}</span><span class="sub ell num" data-k="kpvs"></span></div>
${hist ? `<div class="side">${spark('pv')}</div>` : ''}</div>`);
    if (hasBat) kpi.push(`<div class="kpi kpi-bat" data-i="kbt" style="--bsc-bat-art:var(--bsc-bat)"><div class="tile">${ART.battery}</div>
<div class="txt"><span class="lbl ell">${t.kpiBattery}</span><span class="big num" data-k="kbt">${DASH}</span><span class="sub ell num" data-k="kbtv"></span></div>
<div class="side"><div class="bar"><i data-b="kbt"></i></div><span class="st num" data-k="kbts"></span></div></div>`);
    if (hasLd) kpi.push(`<div class="kpi kpi-load" data-i="kld"><div class="tile">${ART.house}</div>
<div class="txt"><span class="lbl ell">${t.kpiLoad}</span><span class="big num" data-k="kld">${DASH}</span><span class="sub ell num" data-k="klds"></span></div>
${hist ? `<div class="side">${spark('ld')}</div>` : ''}</div>`);

    const head = (icon, title, key) => `<div class="col-h"><div class="tile">${icon}</div>
<div class="ell"><h3 class="ell">${esc(title)}</h3><p class="ell num" data-k="${key}"></p></div></div>`;

    const solarCol = hasPv ? `<section class="col col-solar panel" data-c="solar">
${head(ICON.panel, c.titles.solar ?? t.solar, 'pvh')}
<div class="items">${c.solar.map((s, i) => `<div class="item" data-i="pv${i}" data-e="${esc(s.power || s.voltage)}" tabindex="0" role="button">
<div class="tile">${ART.panel}</div>
<div class="info"><span class="name ell">${esc(s.name)}</span><span class="status"><i class="dot"></i><span data-k="pv${i}st"></span></span>
<span class="val num" data-k="pv${i}">${DASH}</span><span class="meta num ell" data-k="pv${i}m"></span></div>
${hist ? spark(s.power) : ''}</div>`).join('')}</div></section>` : '';

    const mods = c.batteries.map((b, i) => `<div class="mod" data-i="bt${i}" data-e="${esc(b.soc || b.voltage)}" tabindex="0" role="button">
<div class="tile">${ART.battery}</div>
<div class="info"><span class="name ell">${esc(b.name)}</span><span class="v num" data-k="bt${i}v"></span><span class="soc num" data-k="bt${i}s">${DASH}</span></div>
<div class="bar"><i data-b="bt${i}"></i></div>
<div class="meta num"><span data-k="bt${i}p"></span><span data-k="bt${i}t"></span></div></div>`).join('');

    const stats = hasBat && c.show_stats ? `<div class="stats">
<div class="stat">${ICON.battery}<div class="ell"><div class="lbl ell">${t.capacity}</div><div class="sv num ell" data-k="cap"></div></div></div>
<div class="stat" data-i="schg">${ICON.bolt}<div class="ell"><div class="lbl ell">${t.charging}</div><div class="sv num ell" data-k="chg"></div></div></div>
<div class="stat" data-i="sdis">${ICON.down}<div class="ell"><div class="lbl ell">${t.discharging}</div><div class="sv num ell" data-k="dis"></div></div></div>
</div>` : '';

    const batCol = `<section class="col col-bat panel" data-c="bat">
${head(ICON.battery, c.titles.battery ?? (hasBat ? t.battery : t.balance), 'bth')}
${hasBat ? `<div class="mods">${mods}</div>` : ''}
<div class="hub" data-i="hub"><div>${ART.rack}</div><div class="txt">
<span class="lbl ell">${hasBat ? t.system : t.balance}</span><span class="v num muted ell" data-k="hubv"></span>
<span class="big num" data-k="hub">${DASH}</span>
${hasBat ? `<div class="bar"><i data-b="hub"></i></div><span class="chip" data-i="chip"><span data-k="chipi"></span><span class="num" data-k="chip"></span></span><span class="eta num" data-k="eta"></span>` : ''}
</div></div>${stats}</section>`;

    const total = hasLd && c.show_total && c.loads.length > 1 ? `<div class="total">
<div class="head"><div class="tile">${ICON.house}</div><div class="txt"><div class="lbl ell">${t.totalConsumption}</div><div class="big num" data-k="ldt">${DASH}</div></div>${hist ? spark('ld') : ''}</div>
<div class="shares">${c.loads.map((l, i) => `<div class="share"><span class="ell">${esc(l.name)}</span><span class="pc num" data-k="ld${i}pc"></span>
<span class="sv num" data-k="ld${i}v"></span><span></span><div class="bar"><i data-b="ld${i}"></i></div></div>`).join('')}</div></div>` : '';

    const loadCol = hasLd ? `<section class="col col-load panel" data-c="load">
${head(ICON.house, c.titles.loads ?? t.loads, 'ldh')}
<div class="items">${c.loads.map((l, i) => `<div class="item" data-i="ld${i}" data-e="${esc(l.power)}" tabindex="0" role="button">
<div class="tile">${loadArt(l.icon && esc(l.icon), l.name)}</div>
<div class="info"><span class="name ell">${esc(l.name)}</span><span class="val num" data-k="ld${i}">${DASH}</span><span class="meta num ell" data-k="ld${i}m"></span></div>
${hist ? spark(l.power) : ''}</div>`).join('')}</div>${total}</section>` : '';

    const n = 1 + hasPv + hasLd;
    const style = Object.entries({ solar: '--bsc-solar', battery: '--bsc-bat', load: '--bsc-load', accent: '--bsc-accent' })
      .filter(([k]) => c.colors[k]).map(([k, v]) => `${v}:${esc(c.colors[k])}`).join(';');

    this.shadowRoot.innerHTML = `<style>${STYLES}</style>
<ha-card class="${c.appearance === 'dark' ? 'dark' : ''}" style="${style}">
<div class="root${c.animation ? '' : ' still'}${this._visible ? '' : ' paused'}">
${c.title ? `<h2 class="title">${esc(c.title)}</h2>` : ''}
${c.show_kpis && kpi.length ? `<section class="kpis panel" style="--kn:${kpi.length}">${kpi.join('')}</section>` : ''}
<div class="flow" style="--n:${n}">
<svg class="lines" aria-hidden="true">${DEFS}<g data-g></g></svg>
${solarCol}${batCol}${loadCol}
${hasPv ? `<div class="pill pv" data-p="pv" hidden><span class="num" data-k="ppv"></span></div>` : ''}
${hasLd ? `<div class="pill ld" data-p="ld" hidden><span class="num" data-k="pld"></span></div>` : ''}
</div></div></ha-card>`;

    const $ = (sel) => [...this.shadowRoot.querySelectorAll(sel)];
    const by = (attr) => Object.fromEntries($(`[data-${attr}]`).map((el) => [el.dataset[attr], el]));
    this._card = this.shadowRoot.querySelector('ha-card');
    this._root = this._card.firstElementChild;
    this._flow = this._root.querySelector('.flow');
    this._g = this._root.querySelector('[data-g]');
    this._k = by('k');
    this._b = by('b');
    this._i = by('i');
    this._p = by('p');
    this._c = by('c');
    this._s = {};
    for (const el of $('[data-s]')) (this._s[el.dataset.s] ??= []).push(el);
    this._fl = {};
    this._chipState = null;

    const open = (e) => {
      const id = e.target.closest?.('[data-e]')?.dataset.e;
      if (!id || this._cfg.demo) return;
      const ev = new Event('hass-more-info', { bubbles: true, composed: true });
      ev.detail = { entityId: id };
      this.dispatchEvent(ev);
    };
    this._card.addEventListener('click', open);
    this._card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(e);
      }
    });

    this._ro?.disconnect();
    this._ro?.observe(this._card);
    this._built = true;
    this._needLayout = true;
    this._drawSparks();
  }

  _set(k, v) {
    const el = this._k[k];
    if (el && el.textContent !== v) el.textContent = v;
  }

  _update() {
    const c = this._cfg, t = this._t, nf = this._nf;
    const m = (this._m = computeModel(c, this._get));
    const P = (w, signed) => fmtPower(w, nf, signed);
    const set = (k, v) => this._set(k, v);
    const bar = (k, f) => {
      const el = this._b[k];
      if (el) el.style.width = `${Math.max(0, Math.min(1, f || 0)) * 100}%`;
    };
    const cls = (k, name, on) => this._i[k]?.classList.toggle(name, !!on);
    const pct = (f) => `${nf((f || 0) * 100, 0)} %`;
    const level = (el, soc) => {
      if (!el) return;
      el.dataset.lvl = socLevel(soc);
      el.style.setProperty('--lvl', ((soc ?? 0) / 100).toFixed(3));
    };

    // solar
    m.pv.forEach((p, i) => {
      set(`pv${i}`, P(p.p));
      set(`pv${i}st`, p.na ? t.unavailable : p.on ? t.producing : t.idle);
      set(`pv${i}m`, [p.v != null && fmtUnit(p.v, 'V', nf), p.i != null && fmtUnit(p.i, 'A', nf)].filter(Boolean).join(' · '));
      cls(`pv${i}`, 'on', p.on);
      cls(`pv${i}`, 'na', p.na);
    });
    if (c.solar.length) {
      set('kpv', P(m.pvTotal));
      set('ppv', P(m.pvTotal));
      set('pvh', `${t.zones(c.solar.length)} · ${t.totalProduction} ${P(m.pvTotal)}`);
      if (!this._hist) set('kpvs', t.zones(c.solar.length));
      cls('kpv', 'on', m.pvTotal > c.threshold);
      this._i.kpv?.querySelector('.sun')?.classList.toggle('off', !(m.pvTotal > c.threshold));
    }

    // batteries
    const b = m.battery;
    if (c.batteries.length) {
      m.bat.forEach((x, i) => {
        set(`bt${i}v`, fmtUnit(x.v, 'V', nf));
        set(`bt${i}s`, x.soc == null ? DASH : `${nf(x.soc, 0)} %`);
        set(`bt${i}p`, x.p == null ? '' : P(x.p, true));
        set(`bt${i}t`, x.temp == null ? '' : fmtUnit(x.temp, '°C', nf));
        bar(`bt${i}`, (x.soc ?? 0) / 100);
        level(this._i[`bt${i}`], x.soc);
        cls(`bt${i}`, 'chg', x.p > c.threshold);
        cls(`bt${i}`, 'na', x.na);
      });
      const soc = b.soc == null ? DASH : `${nf(b.soc, 0)} %`;
      const state = t[{ charging: 'charging', discharging: 'discharging', idle: 'standby' }[b.state]];
      const stateP = b.state === 'idle' ? state : `${state} · ${P(b.p, true)}`;
      set('kbt', soc);
      set('hub', soc);
      set('kbtv', fmtUnit(b.v, 'V', nf));
      set('hubv', fmtUnit(b.v, 'V', nf));
      set('kbts', stateP);
      set('bth', `${t.modules(c.batteries.length)} · ${state}`);
      bar('kbt', (b.soc ?? 0) / 100);
      bar('hub', (b.soc ?? 0) / 100);
      level(this._i.kbt, b.soc);
      level(this._i.hub, b.soc);
      cls('kbt', 'chg', b.state === 'charging');
      cls('hub', 'on', b.state !== 'idle');
      set('chip', stateP);
      if (this._chipState !== b.state) {
        this._chipState = b.state;
        this._i.chip.className = `chip ${b.state}`;
        this._k.chipi.innerHTML = b.state === 'charging' ? ICON.bolt : b.state === 'discharging' ? ICON.down : '';
      }
      const h = runtimeHours(b, c.min_soc);
      set('eta', h == null ? '' : `${b.p > 0 ? t.fullIn : t.lastsFor} ${fmtDuration(h, t)}`);
      set('cap', b.cap == null ? DASH
        : b.stored == null ? `${nf(b.cap, 1)} kWh` : `${nf(b.stored, 1)} / ${nf(b.cap, 1)} kWh`);
      set('chg', P(b.p > 0 ? b.p : 0, true));
      set('dis', P(b.p < 0 ? -b.p : 0));
      cls('schg', 'chg', b.state === 'charging');
      cls('sdis', 'dis', b.state === 'discharging');
    } else {
      set('hub', P(m.balance, true));
      set('hubv', m.balance == null ? '' : m.balance >= 0 ? t.surplus : t.deficit);
      set('bth', `${t.totalProduction} ${P(m.pvTotal)}`);
      cls('hub', 'on', m.pvTotal > c.threshold || m.loadTotal > c.threshold);
    }

    // loads
    if (c.loads.length) {
      m.loads.forEach((l, i) => {
        set(`ld${i}`, P(l.p));
        set(`ld${i}v`, P(l.p));
        set(`ld${i}pc`, pct(l.share));
        set(`ld${i}m`, l.na ? t.unavailable : c.loads.length > 1 ? `${pct(l.share)} ${t.ofTotal}` : '');
        bar(`ld${i}`, l.share);
        cls(`ld${i}`, 'on', l.on);
        cls(`ld${i}`, 'na', l.na);
      });
      set('kld', P(m.loadTotal));
      set('ldt', P(m.loadTotal));
      set('pld', P(m.loadTotal));
      set('ldh', `${t.circuits(c.loads.length)} · ${t.totalConsumption} ${P(m.loadTotal)}`);
      set('klds', m.loads.map((l, i) => [c.loads[i].name, l.p]).filter(([, p]) => p > c.threshold)
        .sort((a, b2) => b2[1] - a[1]).slice(0, 2).map(([nm, p]) => `${nm} ${P(p)}`).join(' · '));
      cls('kld', 'on', m.loadTotal > c.threshold);
    }

    this._applyFlows();
  }

  _applyFlows() {
    const m = this._m, th = this._cfg.threshold;
    if (!m) return;
    for (const [k, g] of Object.entries(this._fl)) {
      const type = k.slice(0, 2), i = k.length > 2 ? Number(k.slice(2)) : -1;
      let on, w, rev = false;
      if (type === 'pv') [w, on] = [m.pvTotal, i < 0 ? m.pvTotal > th : m.pv[i]?.on];
      else if (type === 'ld') [w, on] = [m.loadTotal, i < 0 ? m.loadTotal > th : m.loads[i]?.on];
      else [w, on, rev] = [m.bat[i]?.p, m.bat[i]?.on, m.bat[i]?.p < 0];
      g.classList.toggle('on', !!on);
      g.classList.toggle('rev', rev);
      // Quantized so small power jitter does not restart the CSS animation.
      const d = `${(Math.round(flowDuration(w) * 4) / 4).toFixed(2)}s`;
      if (g._d !== d) g.style.setProperty('--d', (g._d = d));
    }
    this._p.pv?.classList.toggle('on', m.pvTotal > th);
    this._p.ld?.classList.toggle('on', m.loadTotal > th);
  }

  _layout() {
    const card = this._card, flow = this._flow, c = this._cfg;
    if (!flow) return;
    const wide = card.clientWidth >= c.wide_breakpoint;
    this._root.classList.toggle('wide', wide);
    const F = flow.getBoundingClientRect();
    if (!F.width) return;
    const R = (el) => {
      const r = el.getBoundingClientRect();
      return {
        l: r.left - F.left, r: r.right - F.left, t: r.top - F.top, b: r.bottom - F.top,
        cx: (r.left + r.right) / 2 - F.left, cy: (r.top + r.bottom) / 2 - F.top,
      };
    };
    const hub = R(this._i.hub), bat = R(this._c.bat);
    const paths = [], pills = {};
    const list = (p) => c[p === 'pv' ? 'solar' : 'loads'].map((_, i) => R(this._i[p + i]));

    if (wide) {
      if (this._c.solar) {
        const mx = R(this._c.solar).r + 16;
        list('pv').forEach((e, i) => paths.push([`pv${i}`, helbow(e.r, e.cy, hub.l, hub.cy, mx)]));
        pills.pv = [(mx + bat.l) / 2, hub.cy];
      }
      if (this._c.load) {
        const mx = R(this._c.load).l - 16;
        list('ld').forEach((e, i) => paths.push([`ld${i}`, helbow(hub.r, hub.cy, e.l, e.cy, mx)]));
        pills.ld = [(bat.r + mx) / 2, hub.cy];
      }
    } else {
      const x = Math.round(F.width / 2);
      if (this._c.solar) {
        const s = R(this._c.solar);
        paths.push(['pv', `M${x} ${s.b}V${bat.t}`]);
        pills.pv = [x, (s.b + bat.t) / 2];
      }
      if (this._c.load) {
        const s = R(this._c.load);
        paths.push(['ld', `M${x} ${bat.b}V${s.t}`]);
        pills.ld = [x, (bat.b + s.t) / 2];
      }
    }

    // Only the last row of modules connects to the hub, upper rows would cross it.
    const mods = c.batteries.map((_, i) => R(this._i[`bt${i}`]));
    const lastRow = Math.max(...mods.map((e) => e.b));
    mods.forEach((e, i) => {
      if (lastRow - e.b > 2 || hub.t - e.b < 6) return;
      const hx = Math.min(Math.max(e.cx, hub.l + 28), hub.r - 28);
      paths.push([`bt${i}`, velbow(hx, hub.t, e.cx, e.b, (e.b + hub.t) / 2, 8)]);
    });

    this._g.innerHTML = paths.map(([k, d]) =>
      `<g class="f ${k.slice(0, 2)}" data-f="${k}"><path class="glow" d="${d}"/><path class="base" d="${d}"/><path class="dash" d="${d}"/></g>`).join('');
    this._fl = {};
    for (const g of this._g.children) {
      this._fl[g.dataset.f] = g;
      // Solar branches merge into one trunk at their ends: align the dash phase there.
      if (g.dataset.f.startsWith('pv')) g.style.setProperty('--o', `${-(g.lastChild.getTotalLength() % 24).toFixed(2)}px`);
    }
    for (const [k, el] of Object.entries(this._p)) {
      const p = pills[k];
      el.hidden = !p;
      if (p) {
        el.style.left = `${p[0]}px`;
        el.style.top = `${p[1]}px`;
      }
    }
    this._applyFlows();
  }

  // ---------- history / sparklines ----------

  async _initHistory() {
    this._histInit = true;
    const h = this._hist, ids = [...this._pvIds, ...this._ldIds];
    if (this._cfg.demo) {
      for (const id of ids) {
        const s = h.get(id);
        s.v = demoSeries(h.n, this._pvIds.includes(id) ? 'solar' : 'load', read(this._get(id)) || 600);
        s.v[h.n - 1] = null;
      }
    } else {
      try {
        await h.load(this._hass, ids);
      } catch (e) {
        // Recorder may be disabled or the entity has no statistics; live samples still work.
      }
    }
    this._sample();
  }

  _sample() {
    const h = this._hist;
    if (!h || !this._cfg) return;
    h.roll();
    for (const id of [...this._pvIds, ...this._ldIds]) h.sample(id, read(this._get(id)));
    if (this._built) this._drawSparks();
  }

  _drawSparks() {
    const h = this._hist;
    if (!h) return;
    for (const [key, els] of Object.entries(this._s)) {
      const v = key === 'pv' ? h.total(this._pvIds) : key === 'ld' ? h.total(this._ldIds) : h.series(key);
      const d = sparkPath(v);
      for (const el of els) if (el.getAttribute('d') !== d) el.setAttribute('d', d);
    }
    if (this._cfg.solar.length) {
      const peak = Math.max(0, ...h.total(this._pvIds).filter((x) => x != null));
      this._set('kpvs', peak > 0
        ? `${this._t.peak} ${this._cfg.history_hours} ${this._t.h}: ${fmtPower(peak, this._nf)}`
        : this._t.zones(this._cfg.solar.length));
    }
  }
}

if (!customElements.get(TAG)) {
  customElements.define(TAG, BugsaSolarCard);
  (window.customCards ||= []).push({
    type: TAG,
    name: 'Bugsa Solar Card',
    description: 'Animated overview of a solar plant: production, storage and consumption.',
    preview: true,
    documentationURL: 'https://github.com/pkejval/bugsa-solar-card',
  });
  console.info(`%c BUGSA-SOLAR-CARD %c ${VERSION} `,
    'color:#0b1210;background:#4ade80;font-weight:700;border-radius:3px 0 0 3px',
    'color:#4ade80;background:#0b1210;border-radius:0 3px 3px 0');
}
