import { DEMO_CONFIG } from './demo.js';

function items(v, key, fallbackKey, required, label) {
  if (v == null) return [];
  if (!Array.isArray(v)) throw new Error(`"${key}" must be a list`);
  return v.map((c, i) => {
    const o = typeof c === 'string' ? { [fallbackKey]: c } : { ...c };
    if (!required(o)) throw new Error(`${key}[${i}]: ${label}`);
    return o;
  });
}

const n = (v, d) => (v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : d);

/** Validates user YAML and fills defaults. Throws with a readable message (HA shows it in the card). */
export function normalizeConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Invalid configuration');
  const demo = !!config.demo;
  const src = demo && !config.solar && !config.batteries && !config.loads ? { ...config, ...DEMO_CONFIG } : config;
  const solar = items(src.solar, 'solar', 'power', (o) => o.power || (o.voltage && o.current),
    'set "power" or "voltage" + "current"');
  const batteries = items(src.batteries, 'batteries', 'soc', (o) => o.soc || o.voltage, 'set "soc" or "voltage"');
  const loads = items(src.loads, 'loads', 'power', (o) => o.power, 'set "power"');
  if (!solar.length && !batteries.length && !loads.length) {
    throw new Error('Configure at least one of "solar", "batteries", "loads" (or set "demo: true")');
  }
  return {
    demo,
    title: src.title ?? '',
    appearance: src.appearance === 'dark' ? 'dark' : 'auto',
    threshold: n(src.threshold, 10),
    min_soc: n(src.min_soc, 0),
    history_hours: n(src.history_hours, 12),
    history_bars: Math.round(Math.min(60, Math.max(6, n(src.history_bars, 24)))),
    wide_breakpoint: n(src.wide_breakpoint, 1000),
    animation: src.animation !== false,
    show_kpis: src.show_kpis !== false,
    show_stats: src.show_stats !== false,
    show_total: src.show_total !== false,
    colors: src.colors || {},
    titles: src.titles || {},
    solar: solar.map((o, i) => ({ name: `PV ${i + 1}`, ...o })),
    batteries: batteries.map((o, i) => ({ name: `BMS ${i + 1}`, ...o })),
    loads: loads.map((o, i) => ({ name: `${i + 1}`, ...o })),
  };
}
