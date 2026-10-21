// Inline SVG artwork. Line icons use currentColor; illustrations are styled from styles.js
// and share gradients from DEFS (one <defs> per shadow root, so ids cannot collide).

const line = (body, cls = '') =>
  `<svg class="ln ${cls}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;

export const ICON = {
  sun: line('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),
  panel: line('<path d="M5 4h14l2 10H3z"/><path d="M4 9h16M9.7 4 9 14M14.3 4l.7 10M12 14v5M8 20h8"/>'),
  battery: line('<rect x="7" y="4.5" width="10" height="16" rx="2"/><path d="M10 2.5h4M10 10h4M10 15h4"/>'),
  house: line('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),
  boiler: line('<rect x="6.5" y="2.5" width="11" height="19" rx="5"/><path d="M9.5 9.5c1-1 2-1 2.5 0s1.5 1 2.5 0M9.5 14c1-1 2-1 2.5 0s1.5 1 2.5 0"/>'),
  plug: line('<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>'),
  car: line('<path d="M4 16.5v-4.5l2-5h12l2 5v4.5zM4 12h16"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/>'),
  bolt: line('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>', 'fill'),
  down: line('<path d="M12 4v15M6 13l6 6 6-6"/>'),
  up: line('<path d="M12 20V5M6 11l6-6 6 6"/>'),
};

export const DEFS = `<defs>
<linearGradient id="bscPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f86e6"/><stop offset=".55" stop-color="#1f4fa8"/><stop offset="1" stop-color="#0f2b66"/></linearGradient>
<linearGradient id="bscMetal" x1="0" x2="1"><stop offset="0" stop-color="#5d6b7a"/><stop offset=".45" stop-color="#c9d3dd"/><stop offset="1" stop-color="#4a5664"/></linearGradient>
<linearGradient id="bscRack" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3b4654"/><stop offset="1" stop-color="#1b232d"/></linearGradient>
<linearGradient id="bscSparkS" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-solar)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-solar)"/></linearGradient>
<linearGradient id="bscSparkL" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-accent)"/></linearGradient>
</defs>`;

// Solar panel in perspective; cell grid is derived from the four frame corners.
const panelGrid = (() => {
  const C = [[16, 12], [54, 9], [58, 38], [8, 42]];
  const at = (u, v) => [0, 1].map((k) =>
    (C[0][k] * (1 - u) * (1 - v) + C[1][k] * u * (1 - v) + C[2][k] * u * v + C[3][k] * (1 - u) * v).toFixed(1));
  let d = '';
  for (let i = 1; i < 4; i++) d += `M${at(i / 4, 0)}L${at(i / 4, 1)}`;
  for (let j = 1; j < 3; j++) d += `M${at(0, j / 3)}L${at(1, j / 3)}`;
  return d;
})();

export const ART = {
  panel: `<svg class="art panel" viewBox="0 0 64 64" aria-hidden="true">
<path class="st" d="M33 40v14M24.5 56h17M33 46l9-6"/>
<path class="pf" d="M16 12 54 9 58 38 8 42Z"/>
<path class="pg" d="${panelGrid}"/>
<path class="gl" d="M17 13.5 34 12 31 24 13 25.5Z"/>
</svg>`,

  house: `<svg class="art house" viewBox="0 0 64 64" aria-hidden="true">
<ellipse class="gnd" cx="32" cy="56" rx="25" ry="3"/>
<rect class="chim" x="41" y="15" width="5" height="10" rx="1"/>
<path class="wall" d="M14 30v25h36V30L32 15z"/>
<path class="roof" d="M8 32.5 32 12l24 20.5-2.8 2.6L32 17.4 10.8 35.1z"/>
<rect class="win" x="18.5" y="35" width="8" height="7" rx="1"/>
<rect class="win" x="37.5" y="35" width="8" height="7" rx="1"/>
<circle class="win" cx="32" cy="26" r="2.6"/>
<rect class="door" x="29" y="42" width="6" height="13" rx="1"/>
</svg>`,

  boiler: `<svg class="art boiler" viewBox="0 0 64 64" aria-hidden="true">
<path class="pipe" d="M27 55v6M37 55v6"/>
<rect class="tank" x="19" y="4" width="26" height="53" rx="11"/>
<path class="band" d="M19 18h26M19 45h26"/>
<g class="heat"><path d="M25.5 39c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/><path d="M25.5 32c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/><path d="M25.5 25c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/></g>
<circle class="led" cx="32" cy="11" r="2"/>
</svg>`,

  battery: `<svg class="art bat" viewBox="0 0 40 64" aria-hidden="true">
<rect class="bcap" x="14" y="3" width="12" height="5" rx="1.5"/>
<rect class="bbody" x="6" y="7" width="28" height="53" rx="6"/>
<rect class="blvl" x="10" y="11" width="20" height="45" rx="3"/>
<path class="bseg" d="M10 22.2h20M10 33.5h20M10 44.7h20"/>
<path class="bbolt" d="M22.5 19 14 35h6.5l-2.5 11 9-16.5h-6.5z"/>
</svg>`,

  rack: `<svg class="art rack" viewBox="0 0 64 72" aria-hidden="true">
<path class="rs" d="M46 12 56 6v56l-10 6z"/>
<path class="rt" d="M8 12 18 6h38l-10 6z"/>
<rect class="rf" x="8" y="12" width="38" height="56" rx="3"/>
<path class="rsep" d="M8 30.7h38M8 49.3h38"/>
${[0, 1, 2].map((j) => `<rect class="slot" x="27" y="${18.5 + j * 18.6}" width="13" height="2.4" rx="1.2"/>
<rect class="slot" x="27" y="${23 + j * 18.6}" width="13" height="2.4" rx="1.2"/>
<circle class="led" style="animation-delay:${j * 0.35}s" cx="15" cy="${21.3 + j * 18.6}" r="2"/>
<circle class="led" style="animation-delay:${j * 0.35 + 0.6}s" cx="21" cy="${21.3 + j * 18.6}" r="2"/>`).join('')}
</svg>`,

  sun: `<svg class="art sun" viewBox="0 0 48 48" aria-hidden="true">
<g class="rays"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/></g>
<circle class="core" cx="24" cy="24" r="9"/>
</svg>`,
};

/** Thumbnail artwork for a load: built-in name, mdi:* icon or a guess from the name. */
export function loadArt(icon, name) {
  if (icon?.includes(':')) return `<ha-icon icon="${icon}"></ha-icon>`;
  const key = icon || (/tuv|bojler|boiler|ohřev|ohrev|water|heater/i.test(name) ? 'boiler' : 'house');
  if (ART[key] && key !== 'battery' && key !== 'rack') return ART[key];
  return ICON[key] || ICON.plug;
}
