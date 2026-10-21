import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findSiblings, suggestName } from '../src/autofill.js';

const ent = (entity_id, device_id, extra = {}) => [entity_id, { entity_id, device_id, ...extra }];
const st = (device_class, friendly_name) => ({ state: '1', attributes: { device_class, friendly_name } });

const hass = {
  entities: Object.fromEntries([
    ent('sensor.inv_pv1_power', 'inv'), ent('sensor.inv_pv1_voltage', 'inv'), ent('sensor.inv_pv1_current', 'inv'),
    ent('sensor.inv_pv2_power', 'inv'), ent('sensor.inv_pv2_voltage', 'inv'), ent('sensor.inv_pv2_current', 'inv'),
    ent('sensor.bms_soc', 'bms'), ent('sensor.bms_voltage', 'bms'), ent('sensor.bms_current', 'bms'),
    ent('sensor.bms_temp_a', 'bms'), ent('sensor.bms_temp_b', 'bms'),
    ent('sensor.bms_power_hidden', 'bms', { hidden: true }),
  ]),
  states: {
    'sensor.inv_pv1_power': st('power', 'PV1 výkon'), 'sensor.inv_pv1_voltage': st('voltage'), 'sensor.inv_pv1_current': st('current'),
    'sensor.inv_pv2_power': st('power'), 'sensor.inv_pv2_voltage': st('voltage'), 'sensor.inv_pv2_current': st('current'),
    'sensor.bms_soc': st('battery', 'BMS SOC'), 'sensor.bms_voltage': st('voltage'), 'sensor.bms_current': st('current'),
    'sensor.bms_temp_a': st('temperature'), 'sensor.bms_temp_b': st('temperature'), 'sensor.bms_power_hidden': st('power'),
  },
  devices: { bms: { name: 'JK BMS', name_by_user: 'Baterie A' }, inv: { name: 'Střídač' } },
};

test('picks the matching string on a multi-string inverter', () => {
  assert.deepEqual(findSiblings(hass, 'sensor.inv_pv2_power', { voltage: 'voltage', current: 'current' }),
    { voltage: 'sensor.inv_pv2_voltage', current: 'sensor.inv_pv2_current' });
});

test('BMS: fills unique classes, skips ambiguous and hidden ones', () => {
  assert.deepEqual(findSiblings(hass, 'sensor.bms_soc', { voltage: 'voltage', current: 'current', power: 'power', temperature: 'temperature' }),
    { voltage: 'sensor.bms_voltage', current: 'sensor.bms_current' });
});

test('no device → nothing', () => {
  assert.deepEqual(findSiblings(hass, 'sensor.unknown', { voltage: 'voltage' }), {});
  assert.deepEqual(findSiblings({}, 'sensor.x', { voltage: 'voltage' }), {});
});

test('suggested names', () => {
  assert.equal(suggestName(hass, 'sensor.bms_soc', true), 'Baterie A');
  assert.equal(suggestName(hass, 'sensor.inv_pv1_power', false), 'PV1 výkon');
  assert.equal(suggestName(hass, 'sensor.inv_pv2_power', false), 'Střídač');
});
