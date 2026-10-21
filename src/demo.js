// Demo mode: simulated plant so the card can be previewed from the card picker without entities.

const P = 'demo.';
const ids = (k) => ({ power: `${P}${k}_power`, voltage: `${P}${k}_voltage`, current: `${P}${k}_current` });

export const DEMO_CONFIG = {
  solar: [
    { name: 'Zóna 1', ...ids('pv1') },
    { name: 'Zóna 2', ...ids('pv2') },
    { name: 'Zóna 3', ...ids('pv3') },
  ],
  batteries: [
    { name: 'Baterie A', soc: `${P}bat1_soc`, temperature: `${P}bat1_temp`, capacity: 5.12, ...ids('bat1') },
    { name: 'Baterie B', soc: `${P}bat2_soc`, temperature: `${P}bat2_temp`, capacity: 5.12, ...ids('bat2') },
  ],
  loads: [
    { name: 'Dům', power: `${P}house_power`, icon: 'house' },
    { name: 'Ohřev TUV', power: `${P}boiler_power`, icon: 'boiler' },
  ],
};

const st = (v, unit, d = 1) => ({ state: v.toFixed(d), attributes: { unit_of_measurement: unit } });

/** Deterministic pseudo-live values for time t (ms). */
export function demoStates(t) {
  const s = t / 1000;
  const sun = 0.86 + 0.1 * Math.sin(s / 23);
  const out = {};
  let pvSum = 0;
  [[820, 112], [540, 109], [310, 105]].forEach(([w, v], i) => {
    const p = w * sun * (1 + 0.06 * Math.sin(s / 5 + i * 2));
    const u = v + 1.5 * Math.sin(s / 11 + i);
    pvSum += p;
    out[`${P}pv${i + 1}_power`] = st(p, 'W', 0);
    out[`${P}pv${i + 1}_voltage`] = st(u, 'V');
    out[`${P}pv${i + 1}_current`] = st(p / u, 'A', 2);
  });
  const house = 1150 + 260 * Math.sin(s / 9) + 90 * Math.sin(s / 2.3);
  const boiler = Math.sin(s / 30) > 0.35 ? 1950 + 40 * Math.sin(s) : 0;
  out[`${P}house_power`] = st(house, 'W', 0);
  out[`${P}boiler_power`] = st(boiler, 'W', 0);
  const bat = pvSum - house - boiler;
  [[0.55, 78, 51.8, 24.5], [0.45, 81, 51.6, 23.1]].forEach(([share, soc, v, temp], i) => {
    const p = bat * share;
    const u = v + p / 4000;
    const k = `${P}bat${i + 1}`;
    out[`${k}_power`] = st(p, 'W', 0);
    out[`${k}_voltage`] = st(u, 'V', 2);
    out[`${k}_current`] = st(p / u, 'A', 1);
    out[`${k}_soc`] = st(soc + 3 * Math.sin(s / 60), '%', 0);
    out[`${k}_temp`] = st(temp + Math.sin(s / 40), '°C');
  });
  return out;
}

/** Synthetic past buckets shaped like a sunny morning for the given series. */
export function demoSeries(n, kind, scale) {
  return Array.from({ length: n }, (_, i) => {
    const x = (i + 1) / n;
    const base = kind === 'solar' ? Math.sin(x * Math.PI * 0.55) : 0.55 + 0.35 * Math.abs(Math.sin(i * 1.7));
    return scale * base * (0.9 + 0.2 * Math.abs(Math.sin(i * 2.3)));
  });
}
