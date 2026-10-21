// Finds companion sensors (voltage, current, …) on the same device as the sensor the user picked,
// so one pick in the editor is enough for a whole PV string or BMS.

const prefixLen = (a, b) => {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i;
};

/**
 * @param hass   HA frontend object (uses hass.entities registry + hass.states)
 * @param id     the entity the user picked
 * @param wanted { configKey: device_class }
 * @returns      { configKey: entity_id } for unambiguous matches only
 */
export function findSiblings(hass, id, wanted) {
  const dev = hass?.entities?.[id]?.device_id;
  if (!dev) return {};
  const onDevice = Object.values(hass.entities)
    .filter((e) => e.device_id === dev && e.entity_id !== id && !e.hidden && !e.disabled_by);
  const out = {};
  for (const [key, dc] of Object.entries(wanted)) {
    const list = onDevice
      .filter((e) => hass.states[e.entity_id]?.attributes?.device_class === dc)
      .map((e) => [prefixLen(e.entity_id, id), e.entity_id])
      .sort((a, b) => b[0] - a[0]);
    // One device can expose several strings (pv1_voltage, pv2_voltage): take the one whose
    // entity_id shares the longest prefix with the picked sensor, but only if it is a clear winner.
    if (list.length === 1 || (list.length > 1 && list[0][0] > list[1][0])) out[key] = list[0][1];
  }
  return out;
}

/**
 * Human name for a picked sensor. A BMS is usually one device per battery, so its device name
 * fits; an inverter exposes several strings on one device, so there the entity name is better.
 */
export function suggestName(hass, id, preferDevice) {
  const dev = hass?.devices?.[hass?.entities?.[id]?.device_id];
  const devName = dev?.name_by_user || dev?.name;
  const entName = hass?.states?.[id]?.attributes?.friendly_name;
  return (preferDevice ? devName || entName : entName || devName) || '';
}
