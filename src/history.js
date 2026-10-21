// Fixed-size bucketed power history for sparklines. Past buckets are seeded once from
// recorder long-term statistics (cheap: 5-minute/hourly means), the current bucket is
// filled by time-uniform live sampling.

export class History {
  constructor(hours, bars) {
    this.n = bars;
    this.ms = (hours * 3600e3) / bars;
    this.t0 = this.slot(Date.now());
    this.s = new Map();
  }

  slot(t) {
    return Math.floor(t / this.ms) * this.ms;
  }

  get(id) {
    let s = this.s.get(id);
    if (!s) this.s.set(id, (s = { v: new Array(this.n).fill(null), sum: 0, c: 0 }));
    return s;
  }

  /** Advances the window; returns true when at least one bucket rolled over. */
  roll(now = Date.now()) {
    const k = Math.round((this.slot(now) - this.t0) / this.ms);
    if (k <= 0) return false;
    this.t0 += k * this.ms;
    for (const s of this.s.values()) {
      s.v = k >= this.n ? new Array(this.n).fill(null) : s.v.slice(k).concat(new Array(k).fill(null));
      s.sum = 0;
      s.c = 0;
    }
    return true;
  }

  sample(id, value) {
    if (value == null) return;
    const s = this.get(id);
    s.sum += value;
    s.c++;
    s.v[this.n - 1] = s.sum / s.c;
  }

  series(id) {
    return this.s.get(id)?.v;
  }

  /** Bucket-wise sum of several series (null where none has data). */
  total(ids) {
    const out = new Array(this.n).fill(null);
    for (const id of ids) {
      const v = this.series(id);
      if (v) v.forEach((x, i) => { if (x != null) out[i] = (out[i] ?? 0) + x; });
    }
    return out;
  }

  /** Merges recorder statistics rows ({start, mean}) into past buckets that have no data yet. */
  seed(id, rows) {
    const start = this.t0 - (this.n - 1) * this.ms;
    const acc = new Map();
    for (const r of rows || []) {
      if (r.mean == null) continue;
      const ts = typeof r.start === 'number' ? r.start : Date.parse(r.start);
      const i = Math.floor((ts - start) / this.ms);
      if (i < 0 || i >= this.n - 1) continue;
      const a = acc.get(i) || [0, 0];
      a[0] += r.mean;
      a[1]++;
      acc.set(i, a);
    }
    const s = this.get(id);
    for (const [i, [sum, c]] of acc) if (s.v[i] == null) s.v[i] = sum / c;
  }

  async load(hass, ids) {
    if (!ids.length || !hass?.callWS) return;
    const res = await hass.callWS({
      type: 'recorder/statistics_during_period',
      start_time: new Date(this.t0 - (this.n - 1) * this.ms).toISOString(),
      statistic_ids: ids,
      period: this.ms >= 3600e3 ? 'hour' : '5minute',
      types: ['mean'],
      units: { power: 'W' },
    });
    for (const id of ids) this.seed(id, res?.[id]);
  }
}
