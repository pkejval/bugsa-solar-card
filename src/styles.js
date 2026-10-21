// Only transform/opacity/stroke-dashoffset are animated; everything else changes on state updates.
export const STYLES = `
:host {
  display: block;
  --bsc-solar: #4ade80;
  --bsc-bat: #34d399;
  --bsc-load: #3b9bff;
  --bsc-accent: #f5b83d;
  --bsc-warn: #f5b83d;
  --bsc-crit: #f87171;
  --bsc-gx: 112px;
  --bsc-gy: 64px;
  --bsc-r: 18px;
}
ha-card {
  display: block;
  overflow: hidden;
  container: bsc / inline-size;
  color: var(--bsc-text, var(--primary-text-color, #e8eef5));
  background: var(--bsc-bg, var(--ha-card-background, var(--card-background-color, #101820)));
  font-family: var(--ha-font-family-body, var(--primary-font-family, Roboto, system-ui, sans-serif));
  -webkit-font-smoothing: antialiased;
  --bsc-muted: var(--bsc-text-2, var(--secondary-text-color, #8a99a8));
  --bsc-surface: color-mix(in srgb, currentColor 4%, transparent);
  --bsc-surface-2: color-mix(in srgb, currentColor 6.5%, transparent);
  --bsc-line: color-mix(in srgb, currentColor 9%, transparent);
  --bsc-tile: color-mix(in srgb, currentColor 7%, transparent);
}
ha-card.dark {
  --bsc-text: #e8eef5;
  --bsc-text-2: #8796a6;
  --bsc-bg: radial-gradient(120% 80% at 50% -10%, #17222f 0%, #0d141c 55%, #0a1017 100%);
  --ha-card-border-color: #1d2833;
}
* { box-sizing: border-box; }
.root { padding: clamp(10px, 2.2cqi, 24px); display: grid; gap: clamp(10px, 1.8cqi, 20px); position: relative; }
.num { font-variant-numeric: tabular-nums; }
.empty { display: flex; align-items: center; gap: 12px; margin: 0; color: var(--bsc-muted); font-size: 15px; }
.empty .ln { width: 32px; height: 32px; color: var(--bsc-solar); }
.title { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
.panel {
  background: linear-gradient(180deg, var(--bsc-surface-2), var(--bsc-surface));
  border: 1px solid var(--bsc-line);
  border-radius: var(--bsc-r);
}
.ln { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ln.fill { fill: currentColor; stroke: none; }
.tile {
  flex: none; display: grid; place-items: center;
  width: 48px; height: 48px; border-radius: 14px;
  background: var(--bsc-tile);
  border: 1px solid var(--bsc-line);
  color: var(--c, currentColor);
}
.tile ha-icon { --mdc-icon-size: 28px; color: var(--c); }
.muted { color: var(--bsc-muted); }
.ell { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }

/* ---------- KPI strip ---------- */
.kpis { display: grid; grid-template-columns: repeat(var(--kn, 3), minmax(0, 1fr)); padding: 6px 0; }
.kpi { display: flex; align-items: center; gap: 16px; padding: 12px clamp(12px, 2cqi, 22px); min-width: 0; }
.kpi + .kpi { border-left: 1px solid var(--bsc-line); }
.kpi .tile { width: 64px; height: 64px; border-radius: 16px; }
.kpi .tile svg.art { width: 44px; height: 44px; }
.kpi .txt { display: grid; gap: 2px; min-width: 0; flex: 1; }
.kpi .lbl { font-size: 13.5px; color: var(--bsc-muted); }
.kpi .big { font-size: clamp(22px, 2.6cqi, 32px); font-weight: 650; letter-spacing: -.02em; line-height: 1.15; white-space: nowrap; }
.kpi .sub { font-size: 12.5px; color: var(--bsc-muted); }
.kpi .side { flex: 0 1 auto; width: min(40%, 150px); display: grid; gap: 8px; justify-items: end; }
.kpi .side .spark { width: 100%; height: 34px; }
.kpi .side .bar { width: 100%; height: 8px; }
.kpi .side .st { font-size: 12px; color: var(--bsc-muted); white-space: nowrap; }
.kpi-solar { --c: var(--bsc-solar); }
.kpi-bat { --c: var(--bsc-bat); }
.kpi-load { --c: var(--bsc-load); }
.up { color: var(--bsc-solar); }

/* ---------- flow area ---------- */
.flow { position: relative; display: grid; gap: var(--bsc-gy); }
.root.wide .flow { grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); column-gap: var(--bsc-gx); }
svg.lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 2; }
.col { container-type: inline-size; position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; padding: clamp(12px, 1.6cqi, 20px); min-width: 0; }
.col-h { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; min-width: 0; }
.col-h .tile { width: 52px; height: 52px; }
.col-h h3 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -.01em; }
.col-h p { margin: 3px 0 0; font-size: 12.5px; color: var(--bsc-muted); }
.col-solar { --c: var(--bsc-solar); }
.col-bat { --c: var(--bsc-bat); }
.col-load { --c: var(--bsc-load); }
.items { display: grid; gap: 10px; }
.root:not(.wide) .items { grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); }

/* item (panel string / load) */
.item {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 14px;
  padding: 12px 14px 12px 12px; border-radius: 15px;
  background: var(--bsc-surface); border: 1px solid var(--bsc-line);
  cursor: pointer; outline: none; transition: border-color .25s, background-color .25s;
}
.item:hover, .item:focus-visible { border-color: color-mix(in srgb, var(--c) 45%, transparent); background: var(--bsc-surface-2); }
.item .tile { width: 60px; height: 60px; border-radius: 13px; }
.item .tile svg.art { width: 48px; height: 48px; }
.item .tile .ln { width: 30px; height: 30px; }
.item .info { display: grid; gap: 1px; min-width: 0; }
.name { font-size: 14px; font-weight: 600; }
.val { font-size: 22px; font-weight: 650; letter-spacing: -.015em; line-height: 1.2; }
.meta { font-size: 12px; color: var(--bsc-muted); }
.status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--bsc-muted); }
.dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: .6; }
.on .status { color: var(--c); }
.on .dot { opacity: 1; }
.on .dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: currentColor; animation: ping 2.4s ease-out infinite; }
.na { opacity: .55; }
.item .spark { width: 72px; height: 32px; }
.spark path { fill: url(#bscSparkL); }
.col-solar .spark path, .kpi-solar .spark path { fill: url(#bscSparkS); }

/* ---------- battery column ---------- */
.mods { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 10px; }
.mod {
  display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 12px; row-gap: 8px; align-items: center;
  padding: 12px; border-radius: 15px; background: var(--bsc-surface); border: 1px solid var(--bsc-line);
  cursor: pointer; outline: none; transition: border-color .25s;
}
.mod:hover, .mod:focus-visible { border-color: color-mix(in srgb, var(--c) 45%, transparent); }
.mod .tile { width: 44px; height: 56px; border-radius: 12px; }
.mod .tile svg { width: 26px; height: 42px; }
.mod .info { display: grid; gap: 1px; min-width: 0; }
.mod .name { font-size: 13px; }
.mod .v { font-size: 13px; color: var(--bsc-muted); }
.mod .soc { font-size: 17px; font-weight: 650; }
.mod .bar { grid-column: 1 / -1; }
.mod .meta { grid-column: 1 / -1; display: flex; justify-content: space-between; gap: 8px; }
.bar { height: 6px; border-radius: 99px; background: var(--bsc-line); overflow: hidden; }
.bar > i { display: block; height: 100%; width: 0; border-radius: inherit; background: var(--lc, var(--c)); transition: width .8s cubic-bezier(.2,.8,.2,1); box-shadow: 0 0 10px color-mix(in srgb, var(--lc, var(--c)) 55%, transparent); }
[data-lvl="mid"] { --lc: var(--bsc-warn); }
[data-lvl="low"] { --lc: var(--bsc-crit); }

.hub {
  display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 16px;
  padding: 16px 18px; border-radius: 18px; cursor: default;
  background: linear-gradient(160deg, color-mix(in srgb, var(--c) 9%, var(--bsc-surface-2)), var(--bsc-surface));
  border: 1px solid color-mix(in srgb, var(--c) 28%, transparent);
  box-shadow: 0 18px 40px -22px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.02) inset;
}
.root.wide .hub { margin-block: auto; }
.hub svg.rack { width: 64px; height: 72px; }
.hub .txt { display: grid; gap: 2px; min-width: 0; }
.hub .lbl { font-size: 14px; color: var(--bsc-muted); }
.hub .v { font-size: 15px; }
.hub .big { font-size: clamp(26px, 3cqi, 36px); font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
.hub .bar { height: 8px; margin-top: 6px; }
.chip {
  justify-self: start; display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;
  background: var(--bsc-tile); color: var(--bsc-muted);
}
.chip .ln { width: 14px; height: 14px; }
.chip.charging { color: var(--bsc-bat); background: color-mix(in srgb, var(--bsc-bat) 14%, transparent); }
.chip.discharging { color: var(--bsc-warn); background: color-mix(in srgb, var(--bsc-warn) 14%, transparent); }
.eta { font-size: 12px; color: var(--bsc-muted); margin-top: 4px; }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--bsc-line); padding-top: 14px; }
.stat { display: flex; gap: 10px; align-items: center; padding: 0 10px; min-width: 0; }
.stat + .stat { border-left: 1px solid var(--bsc-line); }
.stat .ln { flex: none; width: 22px; height: 22px; color: var(--bsc-muted); }
.stat .lbl { font-size: 12px; color: var(--bsc-muted); }
.stat .sv { font-size: 15px; font-weight: 650; white-space: normal; text-overflow: clip; }
.stat.chg .ln, .stat.chg .sv { color: var(--bsc-bat); }
.stat.dis .ln, .stat.dis .sv { color: var(--bsc-warn); }

/* ---------- consumption total ---------- */
.total { display: grid; gap: 14px; padding: 14px; border-radius: 16px; background: var(--bsc-surface); border: 1px solid var(--bsc-line); }
.total .head { display: flex; align-items: center; gap: 14px; }
.total .tile { width: 52px; height: 52px; }
.total .txt { flex: 1; min-width: 0; }
.total .lbl { font-size: 13px; color: var(--bsc-muted); }
.total .big { font-size: 24px; font-weight: 700; letter-spacing: -.02em; }
.total .spark { width: 84px; height: 34px; }
.shares { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr)); gap: 12px 18px; border-top: 1px solid var(--bsc-line); padding-top: 12px; }
.share { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 8px; font-size: 12px; }
.share .sv { font-size: 14px; font-weight: 650; }
.share .pc { color: var(--bsc-muted); align-self: end; }
.share .bar { grid-column: 1 / -1; margin-top: 5px; --lc: var(--bsc-accent); }

/* ---------- flows ---------- */
.f path { fill: none; stroke: var(--fc); stroke-linecap: round; }
.f .glow { stroke-width: 9; opacity: 0; transition: opacity .4s; }
.f .base { stroke-width: 2.4; opacity: .16; transition: opacity .4s; }
.f .dash { stroke-width: 3.2; stroke-dasharray: 7 17; stroke-dashoffset: var(--o, 0); opacity: 0; }
.f.on .glow { opacity: .1; }
.f.on .base { opacity: .45; }
.f.on .dash { opacity: 1; animation: flow var(--d, 1.5s) linear infinite; }
.f.rev .dash { animation-direction: reverse; }
.f.bt .base { stroke-dasharray: 4 5; stroke-width: 1.6; }
.f.bt .glow { stroke-width: 6; }
.f.bt .dash { stroke-width: 2.4; stroke-dasharray: 4 20; }
.f.pv { --fc: var(--bsc-solar); }
.f.ld { --fc: var(--bsc-load); }
.f.bt { --fc: var(--bsc-bat); }
.f.bt.rev { --fc: var(--bsc-warn); }
@keyframes flow { to { stroke-dashoffset: calc(var(--o, 0px) - 48px); } }

.pill {
  position: absolute; left: 0; top: 0; z-index: 3; translate: -50% -50%;
  padding: 6px 13px; border-radius: 99px; font-size: 13px; font-weight: 650; white-space: nowrap;
  color: var(--pc); background: var(--bsc-pill-bg, color-mix(in srgb, var(--pc) 10%, #0c1219));
  border: 1.5px solid color-mix(in srgb, var(--pc) 35%, transparent);
  transition: border-color .4s, box-shadow .4s, opacity .4s; opacity: .7;
}
.pill.on { opacity: 1; border-color: var(--pc); box-shadow: 0 0 14px -2px color-mix(in srgb, var(--pc) 70%, transparent); }
.pill.pv { --pc: var(--bsc-solar); }
.pill.ld { --pc: var(--bsc-load); }
ha-card:not(.dark) .pill { --bsc-pill-bg: var(--ha-card-background, var(--card-background-color, #fff)); }
.pill[hidden] { display: none; }

/* ---------- artwork ---------- */
.art.panel .pf { fill: url(#bscPanel); stroke: #b8c4d2; stroke-width: 1.4; stroke-linejoin: round; }
.art.panel .pg { stroke: rgba(190,215,255,.45); stroke-width: .9; fill: none; }
.art.panel .gl { fill: rgba(255,255,255,.12); }
.art.panel .st { stroke: #7e8a98; stroke-width: 2.4; stroke-linecap: round; fill: none; }
.art.house .gnd { fill: color-mix(in srgb, currentColor 10%, transparent); }
.art.house .wall { fill: #d9dee6; }
.art.house .roof { fill: #3d4a5c; }
.art.house .chim { fill: #56637a; }
.art.house .door { fill: #8a6a4c; }
.art.house .win { fill: #6d7c90; transition: fill .4s; }
.on .art.house .win, .art.house.on .win { fill: #ffcd6b; filter: drop-shadow(0 0 3px #ffb43a); }
.art.boiler .tank { fill: url(#bscMetal); }
.art.boiler .band { stroke: rgba(0,0,0,.25); stroke-width: 1.5; }
.art.boiler .pipe { stroke: #8a96a3; stroke-width: 3; stroke-linecap: round; }
.art.boiler .heat path { fill: none; stroke: #ff7a45; stroke-width: 2; stroke-linecap: round; opacity: .18; }
.art.boiler .led { fill: #5b6675; }
.on .art.boiler .heat path { opacity: 1; animation: heat 1.8s ease-in-out infinite; }
.on .art.boiler .heat path:nth-child(2) { animation-delay: .3s; }
.on .art.boiler .heat path:nth-child(3) { animation-delay: .6s; }
.on .art.boiler .led { fill: #ff7a45; }
.art.bat .bcap { fill: color-mix(in srgb, currentColor 35%, transparent); }
.art.bat .bbody { fill: color-mix(in srgb, currentColor 6%, transparent); stroke: color-mix(in srgb, currentColor 35%, transparent); stroke-width: 2; }
.art.bat .blvl { fill: var(--lc, var(--bsc-bat-art, #4a8cff)); transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(var(--lvl, 0)); transition: transform .8s cubic-bezier(.2,.8,.2,1); }
.art.bat .bseg { stroke: var(--bsc-seg, rgba(10,16,23,.55)); stroke-width: 1.6; }
.art.bat .bbolt { fill: #fff; opacity: 0; transition: opacity .3s; }
.chg .art.bat .bbolt { opacity: .95; }
.art.rack .rf { fill: url(#bscRack); stroke: rgba(255,255,255,.12); }
.art.rack .rs { fill: #151c24; }
.art.rack .rt { fill: #4b5767; }
.art.rack .rsep { stroke: #0b1016; stroke-width: 1.4; }
.art.rack .slot { fill: #0e141b; }
.art.rack .led { fill: #2b5a3d; }
.on .art.rack .led { fill: #4ade80; animation: blink 1.6s steps(2, jump-none) infinite; }
.art.sun .core { fill: #ffc531; filter: drop-shadow(0 0 6px rgba(255,190,40,.6)); }
.art.sun .rays { stroke: #ffc531; stroke-width: 3; stroke-linecap: round; transform-origin: 24px 24px; }
.on .art.sun .rays { animation: spin 24s linear infinite; }
.art.sun.off .core, .art.sun.off .rays { filter: none; fill: #8c96a3; stroke: #8c96a3; }

@keyframes ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(2.6); opacity: 0; } }
@keyframes blink { 50% { opacity: .35; } }
@keyframes heat { 0%, 100% { opacity: .35; transform: translateY(1px); } 50% { opacity: 1; transform: translateY(-1px); } }
@keyframes spin { to { transform: rotate(360deg); } }

.paused *, .paused *::after, .still *, .still *::after { animation-play-state: paused !important; }
.still .f .dash { animation: none !important; }
@media (prefers-reduced-motion: reduce) {
  * , *::after { animation: none !important; transition: none !important; }
  .f.on .dash { opacity: 0; }
}

/* ---------- responsive: column width, then card width ---------- */
@container (max-width: 330px) {
  .item .spark { display: none; }
  .total .spark { display: none; }
}
@container (max-width: 400px) {
  .stat { padding: 0 8px; }
  .stat:first-child { padding-left: 0; }
  .stat .ln { display: none; }
}
@container bsc (max-width: 940px) {
  .kpi { gap: 12px; }
  .kpi .tile { width: 48px; height: 48px; border-radius: 13px; }
  .kpi .tile svg.art { width: 34px; height: 34px; }
  .kpi .side { display: none; }
}
@container bsc (max-width: 560px) {
  .kpis { padding: 2px 0; }
  .kpi { flex-direction: column; align-items: flex-start; gap: 8px; padding: 10px 12px; }
  .kpi .tile { width: 36px; height: 36px; border-radius: 10px; }
  .kpi .tile svg.art { width: 26px; height: 26px; }
  .kpi .lbl { font-size: 11.5px; }
  .kpi .big { font-size: 20px; }
  .kpi .sub { font-size: 11px; }
  .col-h .tile { width: 44px; height: 44px; }
  .item .spark { display: none; }
  .flow { gap: 52px; }
}
@container bsc (max-width: 380px) {
  .kpi { padding: 8px; }
  .kpi .tile { display: none; }
  .kpi .big { font-size: 17px; }
  .item { gap: 10px; padding: 10px; }
  .item .tile { width: 48px; height: 48px; }
  .item .tile svg.art { width: 38px; height: 38px; }
  .val { font-size: 19px; }
  .hub { grid-template-columns: 1fr; }
  .hub svg.rack { display: none; }
}
`;
