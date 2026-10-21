import { DEMO_CONFIG } from './demo.js';

// Incomplete items are skipped rather than rejected: the visual editor creates
// them empty and the preview must keep rendering while the user picks a sensor.
function items(v, key, fallbackKey, complete) {
  if (v == null) return [];
  if (!Array.isArray(v)) throw new Error(`"${key}" must be a list`);
  return v.map((c) => (typeof c === 'string' ? { [fallbackKey]: c } : { ...c })).filter(complete);
}

const color = (v) => (Array.isArray(v) ? `rgb(${v.join(',')})` : v);

const n = (v, d) => (v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : d);

/** Validates user config and fills defaults. Throws only for structurally wrong YAML. */
export function normalizeConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Invalid configuration');
  const demo = !!config.demo;
  const src = demo && !config.solar && !config.batteries && !config.loads ? { ...config, ...DEMO_CONFIG } : config;
  const solar = items(src.solar, 'solar', 'power', (o) => o.power || (o.voltage && o.current));
  const batteries = items(src.batteries, 'batteries', 'soc', (o) => o.soc || o.voltage);
  const loads = items(src.loads, 'loads', 'power', (o) => o.power);
  const colors = Object.fromEntries(Object.entries(src.colors || {}).filter(([, v]) => v).map(([k, v]) => [k, color(v)]));
  return {
    demo,
    empty: !solar.length && !batteries.length && !loads.length,
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
    colors,
    titles: src.titles || {},
    solar: solar.map((o, i) => ({ name: `PV ${i + 1}`, ...o })),
    batteries: batteries.map((o, i) => ({ name: `BMS ${i + 1}`, ...o })),
    loads: loads.map((o, i) => ({ name: `${i + 1}`, ...o })),
  };
}
