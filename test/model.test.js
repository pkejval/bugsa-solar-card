import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  capacityKwh, computeModel, flowSpeed, fmtDuration, fmtPower, helbow, numberFormat, pathPoints,
  polylineKeyframes, read, runtimeHours, sparkPath, velbow,
} from '../src/model.js';
import { normalizeConfig } from '../src/config.js';
import { History } from '../src/history.js';

const S = (state, unit) => ({ state: String(state), attributes: { unit_of_measurement: unit } });
const getter = (states) => (id) => states[id];

test('read normalizes units and rejects unavailable', () => {
  assert.equal(read(S(1.5, 'kW')), 1500);
  assert.equal(read(S(250, 'W')), 250);
  assert.equal(read(S(1200, 'mA')), 1.2);
  assert.equal(read(S('unavailable', 'W')), null);
  assert.equal(read(undefined), null);
});

test('capacity from kWh number, Wh entity and Ah entity', () => {
  const get = getter({ c1: S(5120, 'Wh'), c2: S(100, 'Ah') });
  assert.equal(capacityKwh(10.2, get), 10.2);
  assert.equal(capacityKwh('c1', get), 5.12);
  assert.equal(capacityKwh('c2', get, 51.2), 5.12);
  assert.equal(capacityKwh('c2', get, null), null);
});

test('computeModel aggregates strings, batteries and loads', () => {
  const cfg = normalizeConfig({
    solar: [{ power: 'p1' }, { voltage: 'v2', current: 'i2' }],
    batteries: [
      { soc: 's1', power: 'b1', capacity: 10 },
      { soc: 's2', voltage: 'bv2', current: 'bi2', capacity: 5, invert: true },
    ],
    loads: ['l1', 'l2'],
  });
  const m = computeModel(cfg, getter({
    p1: S(1.2, 'kW'), v2: S(100, 'V'), i2: S(3, 'A'),
    s1: S(80, '%'), b1: S(500, 'W'), s2: S(50, '%'), bv2: S(50, 'V'), bi2: S(4, 'A'),
    l1: S(750, 'W'), l2: S('unavailable', 'W'),
  }));
  assert.equal(m.pvTotal, 1500);
  assert.equal(m.pv[1].p, 300);
  assert.equal(m.bat[1].p, -200, 'invert flips sign');
  assert.equal(m.battery.p, 300);
  assert.equal(m.battery.state, 'charging');
  assert.equal(m.battery.soc, 70, 'capacity weighted SOC');
  assert.equal(m.battery.stored, 10.5);
  assert.equal(m.loadTotal, 750);
  assert.equal(m.loads[0].share, 1);
  assert.equal(m.loads[1].na, true);
  assert.equal(m.balance, 750);
});

test('battery_from_balance: battery power is production minus consumption', () => {
  const states = { p: S(400, 'W'), l: S(3, 'kW'), s1: S(60, '%'), b1: S(400, 'W'), s2: S(60, '%'), b2: S(250, 'W') };
  const cfg = normalizeConfig({
    battery_from_balance: true, solar: ['p'], loads: ['l'],
    batteries: [{ soc: 's1', power: 'b1' }, { soc: 's2', power: 'b2' }],
  });
  const m = computeModel(cfg, getter(states));
  assert.deepEqual(m.bat.map((b) => b.p), [-1300, -1300], 'BMS power ignored, split evenly');
  assert.equal(m.battery.p, -2600);
  assert.equal(m.battery.state, 'discharging');

  const sun = computeModel(cfg, getter({ ...states, p: S(4, 'kW') }));
  assert.equal(sun.battery.p, 1000);
  assert.equal(sun.battery.state, 'charging');

  const byCap = normalizeConfig({
    battery_from_balance: true, solar: ['p'], loads: ['l'],
    batteries: [{ soc: 's1', capacity: 10 }, { soc: 's2', capacity: 5 }],
  });
  const n = computeModel(byCap, getter(states));
  assert.deepEqual(n.bat.map((b) => Math.round(b.p)), [-1733, -867], 'split by capacity');
});

test('runtime estimate', () => {
  assert.equal(runtimeHours({ state: 'charging', cap: 10, soc: 50, p: 2500 }), 2);
  assert.equal(runtimeHours({ state: 'discharging', cap: 10, soc: 50, p: -1000 }, 10), 4);
  assert.equal(runtimeHours({ state: 'idle', cap: 10, soc: 50, p: 0 }), null);
});

test('formatting', () => {
  const nf = numberFormat('en');
  assert.equal(fmtPower(820, nf), '820 W');
  assert.equal(fmtPower(1670, nf), '1.67 kW');
  assert.equal(fmtPower(12345, nf), '12.3 kW');
  assert.equal(fmtPower(1230, nf, true), '+1.23 kW');
  assert.equal(fmtPower(null, nf), '—');
  assert.equal(fmtPower(1670, numberFormat('cs')), '1,67 kW');
  assert.equal(fmtDuration(2.5, { h: 'h', min: 'min' }), '2 h 30 min');
  assert.equal(fmtDuration(0.25, { h: 'h', min: 'min' }), '15 min');
  assert.ok(flowSpeed(10000) > flowSpeed(100));
  assert.equal(flowSpeed(1000) % 15, 0);
});

test('flow dot keyframes follow the drawn path at constant speed', () => {
  const d = helbow(0, 0, 100, 50, 60, 10);
  assert.deepEqual(pathPoints(d), [[0, 0], [50, 0], [60, 10], [60, 40], [70, 50], [100, 50]]);
  const { css, len } = polylineKeyframes('k', [[0, 0], [30, 0], [30, 10]]);
  assert.equal(len, 40);
  assert.equal(css, '@keyframes k{0%{transform:translate(0px,0px)}75%{transform:translate(30px,0px)}100%{transform:translate(30px,10px)}}');
});

test('elbow paths', () => {
  assert.equal(helbow(0, 10, 100, 10, 50), 'M0 10H100');
  assert.equal(helbow(0, 0, 100, 50, 60, 10), 'M0 0H50Q60 0 60 10V40Q60 50 70 50H100');
  assert.equal(velbow(10, 100, 10, 0, 50), 'M10 100V0');
  assert.match(velbow(0, 100, 40, 0, 50, 8), /^M0 100V58Q0 50 8 50H32Q40 50 40 42V0$/);
});

test('sparkPath produces one bar per bucket', () => {
  const d = sparkPath([1, null, 4, 2]);
  assert.equal((d.match(/M/g) || []).length, 4);
  assert.equal(sparkPath([]), '');
});

test('config validation', () => {
  assert.equal(normalizeConfig({}).empty, true);
  const half = normalizeConfig({ loads: [{ name: 'new, no sensor yet' }, 'sensor.a'] });
  assert.equal(half.loads.length, 1, 'incomplete editor items are skipped');
  assert.equal(half.empty, false);
  assert.throws(() => normalizeConfig({ solar: 'sensor.x' }), /must be a list/);
  assert.equal(normalizeConfig({ loads: ['sensor.a'], colors: { solar: [1, 2, 3] } }).colors.solar, 'rgb(1,2,3)');
  const d = normalizeConfig({ demo: true });
  assert.equal(d.solar.length, 3);
  assert.equal(normalizeConfig({ loads: ['sensor.a'], history_bars: 500 }).history_bars, 60);
});

test('history buckets roll and seed', () => {
  const h = new History(1, 6); // 10-minute buckets
  const now = h.t0;
  h.sample('a', 100);
  h.sample('a', 300);
  assert.equal(h.series('a')[5], 200);
  h.seed('a', [{ start: now - 10 * 60e3, mean: 50 }, { start: new Date(now - 20 * 60e3).toISOString(), mean: 70 }]);
  assert.deepEqual(h.series('a').slice(3), [70, 50, 200]);
  assert.equal(h.roll(now + 10 * 60e3), true);
  assert.deepEqual(h.series('a').slice(2), [70, 50, 200, null]);
  h.sample('b', 10);
  assert.deepEqual(h.total(['a', 'b']).slice(4), [200, 10]);
});
