// Pure data logic: unit normalization, aggregation, formatting and path geometry.
// No DOM access here so everything is unit-testable in Node.

const SCALE = {
  W: 1, kW: 1e3, MW: 1e6, mW: 1e-3,
  V: 1, mV: 1e-3, kV: 1e3,
  A: 1, mA: 1e-3,
  Wh: 1e-3, kWh: 1, MWh: 1e3,
};

export function num(st) {
  if (!st) return null;
  const v = parseFloat(st.state);
  return Number.isFinite(v) ? v : null;
}

/** State value scaled to the base unit of its quantity (W, V, A, kWh). */
export function read(st) {
  const v = num(st);
  if (v == null) return null;
  return v * (SCALE[st.attributes?.unit_of_measurement] ?? 1);
}

const sum = (xs) => {
  let s = null;
  for (const x of xs) if (x != null) s = (s ?? 0) + x;
  return s;
};

const mean = (xs) => {
  const v = xs.filter((x) => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

/** Battery capacity in kWh: a number (kWh) or an entity in kWh/Wh/Ah. */
export function capacityKwh(cap, get, voltage) {
  if (cap == null) return null;
  if (typeof cap === 'number') return cap;
  const st = get(cap);
  const u = st?.attributes?.unit_of_measurement;
  if (u === 'Ah' || u === 'mAh') {
    const ah = num(st);
    if (ah == null || voltage == null) return null;
    return (u === 'mAh' ? ah / 1000 : ah) * voltage / 1000;
  }
  return read(st);
}

/**
 * Builds the view model from normalized config and a state getter.
 * Battery power sign: positive = charging, negative = discharging.
 */
export function computeModel(cfg, get) {
  const th = cfg.threshold;
  const val = (id) => (id == null ? null : typeof id === 'number' ? id : read(get(id)));
  const vi = (v, i) => (v != null && i != null ? v * i : null);

  const pv = cfg.solar.map((c) => {
    const v = val(c.voltage), i = val(c.current);
    const p = val(c.power) ?? vi(v, i);
    return { p, v, i, na: p == null, on: p != null && p > th };
  });

  const bat = cfg.batteries.map((c) => {
    const v = val(c.voltage), i = val(c.current);
    let p = val(c.power) ?? vi(v, i);
    if (p != null && c.invert) p = -p;
    const soc = val(c.soc);
    const cap = capacityKwh(c.capacity, get, v);
    return {
      p, v, i, soc, cap, temp: val(c.temperature),
      na: soc == null && v == null,
      on: p != null && Math.abs(p) > th,
    };
  });

  const loads = cfg.loads.map((c) => {
    const p = val(c.power);
    return { p, na: p == null, on: p != null && p > th };
  });

  const pvTotal = sum(pv.map((x) => x.p));
  const loadTotal = sum(loads.map((x) => (x.p == null ? null : Math.max(0, x.p))));
  for (const l of loads) l.share = loadTotal && l.p != null ? Math.max(0, l.p) / loadTotal : 0;

  // SOC weighted by capacity when every module with SOC also has a capacity.
  const withSoc = bat.filter((b) => b.soc != null);
  const weighted = withSoc.length && withSoc.every((b) => b.cap);
  const capSum = sum(bat.map((b) => b.cap));
  const soc = !withSoc.length
    ? null
    : weighted
      ? withSoc.reduce((a, b) => a + b.soc * b.cap, 0) / withSoc.reduce((a, b) => a + b.cap, 0)
      : mean(withSoc.map((b) => b.soc));
  const stored = weighted ? sum(withSoc.map((b) => (b.soc / 100) * b.cap)) : null;
  const batP = sum(bat.map((b) => b.p));

  return {
    pv, bat, loads, pvTotal, loadTotal,
    battery: {
      soc, v: mean(bat.map((b) => b.v)), p: batP, cap: capSum, stored,
      state: batP == null || Math.abs(batP) <= th ? 'idle' : batP > 0 ? 'charging' : 'discharging',
    },
    balance: pvTotal == null && loadTotal == null ? null : (pvTotal ?? 0) - (loadTotal ?? 0),
  };
}

/** Hours until full (charging) or until min SOC (discharging); null when unknown/idle. */
export function runtimeHours(b, minSoc = 0) {
  if (b.state === 'idle' || b.cap == null || b.soc == null || !b.p) return null;
  const kwh = b.p > 0 ? b.cap * (1 - b.soc / 100) : b.cap * Math.max(0, b.soc - minSoc) / 100;
  const h = kwh / (Math.abs(b.p) / 1000);
  return Number.isFinite(h) && h < 1000 ? h : null;
}

/** Flow animation duration in seconds — faster for more power, log scale. */
export function flowDuration(w) {
  const a = Math.max(Math.abs(w ?? 0), 1);
  return Math.max(0.45, Math.min(3, 3.2 - 0.7 * Math.log10(a)));
}

export function socLevel(soc) {
  return soc == null ? 'na' : soc >= 50 ? 'ok' : soc >= 20 ? 'mid' : 'low';
}

// ---------- formatting ----------

const nfCache = new Map();
export function numberFormat(lang) {
  return (v, d = 0) => {
    const k = lang + d;
    let f = nfCache.get(k);
    if (!f) {
      f = new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d });
      nfCache.set(k, f);
    }
    return f.format(v);
  };
}

export const DASH = '—';

export function fmtPower(w, nf, signed = false) {
  if (w == null) return DASH;
  const a = Math.abs(w);
  const sign = signed && w > 0.5 ? '+' : '';
  if (a >= 1000) return sign + nf(w / 1000, a >= 10000 ? 1 : 2) + ' kW';
  return sign + nf(Math.round(w) || 0, 0) + ' W';
}

export function fmtUnit(v, unit, nf, d = 1) {
  return v == null ? DASH : `${nf(v, d)} ${unit}`;
}

export function fmtDuration(h, t) {
  if (h == null) return '';
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60), mm = total % 60;
  return hh ? `${hh} ${t.h} ${mm} ${t.min}` : `${mm} ${t.min}`;
}

// ---------- geometry ----------

const r1 = (x) => Math.round(x * 10) / 10;

/** Horizontal → vertical → horizontal path with rounded corners, turning at x = mx. */
export function helbow(x1, y1, x2, y2, mx, r = 12) {
  [x1, y1, x2, y2, mx] = [x1, y1, x2, y2, mx].map(r1);
  const dy = y2 - y1;
  if (Math.abs(dy) < 1) return `M${x1} ${y1}H${x2}`;
  const sy = Math.sign(dy), s1 = Math.sign(mx - x1) || 1, s2 = Math.sign(x2 - mx) || 1;
  const k = r1(Math.min(r, Math.abs(dy) / 2, Math.abs(mx - x1), Math.abs(x2 - mx)));
  return `M${x1} ${y1}H${mx - s1 * k}Q${mx} ${y1} ${mx} ${y1 + sy * k}`
    + `V${y2 - sy * k}Q${mx} ${y2} ${mx + s2 * k} ${y2}H${x2}`;
}

/** Vertical → horizontal → vertical path with rounded corners, turning at y = my. */
export function velbow(x1, y1, x2, y2, my, r = 10) {
  [x1, y1, x2, y2, my] = [x1, y1, x2, y2, my].map(r1);
  const dx = x2 - x1;
  if (Math.abs(dx) < 1) return `M${x1} ${y1}V${y2}`;
  const sx = Math.sign(dx), s1 = Math.sign(my - y1) || 1, s2 = Math.sign(y2 - my) || 1;
  const k = r1(Math.min(r, Math.abs(dx) / 2, Math.abs(my - y1), Math.abs(y2 - my)));
  return `M${x1} ${y1}V${my - s1 * k}Q${x1} ${my} ${x1 + sx * k} ${my}`
    + `H${x2 - sx * k}Q${x2} ${my} ${x2} ${my + s2 * k}V${y2}`;
}

/** Bar sparkline as a single path; null buckets render as a baseline stub. */
export function sparkPath(vals, w = 72, h = 32) {
  if (!vals?.length) return '';
  let max = 0;
  for (const v of vals) if (v > max) max = v;
  const bw = w / vals.length, gap = bw * 0.38;
  let d = '';
  vals.forEach((v, i) => {
    const bh = Math.max(1.5, max ? (Math.max(0, v ?? 0) / max) * h : 0);
    d += `M${r1(i * bw + gap / 2)} ${r1(h - bh)}h${r1(bw - gap)}V${h}h${r1(gap - bw)}Z`;
  });
  return d;
}
