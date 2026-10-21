var F=`
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
.bar > i { display: block; height: 100%; border-radius: inherit; background: var(--lc, var(--c)); transform: translateX(-100%); transition: transform .8s cubic-bezier(.2,.8,.2,1); }
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
  padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 600; white-space: nowrap;
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
.f.on .glow { opacity: .1; }
.f.on .base { opacity: .5; }
.f.bt .base { stroke-dasharray: 4 5; stroke-width: 1.6; }
.f.bt .glow { stroke-width: 6; }
.pv { --fc: var(--bsc-solar); }
.ld { --fc: var(--bsc-load); }
.bt { --fc: var(--bsc-bat); }
.bt.rev { --fc: var(--bsc-warn); }
/* moving dots: only transform is animated \u2192 runs on the compositor, not the main thread */
.dots { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.dt {
  display: none; position: absolute; left: -3px; top: -3px; width: 6px; height: 6px; border-radius: 50%;
  background: var(--fc); box-shadow: 0 0 6px 1px var(--fc);
}
.fd.bt .dt { left: -2px; top: -2px; width: 4px; height: 4px; }
.fd.on .dt { display: block; will-change: transform; animation-duration: var(--dur, 3s); animation-timing-function: linear; animation-iteration-count: infinite; }
.fd.rev .dt { animation-direction: reverse; }

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
.on .art.boiler .heat path { opacity: 1; }
.on .art.boiler .led { fill: #ff7a45; }
.art.bat .bcap { fill: color-mix(in srgb, currentColor 35%, transparent); }
.art.bat .bbody { fill: color-mix(in srgb, currentColor 6%, transparent); stroke: color-mix(in srgb, currentColor 35%, transparent); stroke-width: 2; }
.art.bat .blvl { fill: var(--lc, var(--bsc-bat-art, #4a8cff)); transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(var(--lvl, 0)); }
.art.bat .bseg { stroke: var(--bsc-seg, rgba(10,16,23,.55)); stroke-width: 1.6; }
.art.bat .bbolt { fill: #fff; opacity: 0; transition: opacity .3s; }
.chg .art.bat .bbolt { opacity: .95; }
.art.rack .rf { fill: url(#bscRack); stroke: rgba(255,255,255,.12); }
.art.rack .rs { fill: #151c24; }
.art.rack .rt { fill: #4b5767; }
.art.rack .rsep { stroke: #0b1016; stroke-width: 1.4; }
.art.rack .slot { fill: #0e141b; }
.art.rack .led { fill: #2b5a3d; }
.on .art.rack .led { fill: #4ade80; }
.art.sun .core { fill: #ffc531; filter: drop-shadow(0 0 6px rgba(255,190,40,.6)); }
.art.sun .rays { stroke: #ffc531; stroke-width: 3; stroke-linecap: round; }
/* rotate the whole <svg> (an HTML-level box) so it is composited; rotating inner SVG nodes forces layout every frame */
.on svg.art.sun { animation: spin 24s linear infinite; will-change: transform; }
.art.sun.off .core, .art.sun.off .rays { filter: none; fill: #8c96a3; stroke: #8c96a3; }

@keyframes ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(2.6); opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }

.paused *, .paused *::after { animation-play-state: paused !important; }
.still .dt, .still .dot::after { display: none !important; }
.still svg.art.sun { animation: none; }
@media (prefers-reduced-motion: reduce) {
  * , *::after { animation: none !important; transition: none !important; }
  .dt { display: none !important; }
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
`;var z=(a,e="")=>`<svg class="ln ${e}" viewBox="0 0 24 24" aria-hidden="true">${a}</svg>`,M={sun:z('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),panel:z('<path d="M5 4h14l2 10H3z"/><path d="M4 9h16M9.7 4 9 14M14.3 4l.7 10M12 14v5M8 20h8"/>'),battery:z('<rect x="7" y="4.5" width="10" height="16" rx="2"/><path d="M10 2.5h4M10 10h4M10 15h4"/>'),house:z('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),boiler:z('<rect x="6.5" y="2.5" width="11" height="19" rx="5"/><path d="M9.5 9.5c1-1 2-1 2.5 0s1.5 1 2.5 0M9.5 14c1-1 2-1 2.5 0s1.5 1 2.5 0"/>'),plug:z('<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>'),car:z('<path d="M4 16.5v-4.5l2-5h12l2 5v4.5zM4 12h16"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/>'),bolt:z('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',"fill"),down:z('<path d="M12 4v15M6 13l6 6 6-6"/>'),up:z('<path d="M12 20V5M6 11l6-6 6 6"/>')},J=`<defs>
<linearGradient id="bscPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f86e6"/><stop offset=".55" stop-color="#1f4fa8"/><stop offset="1" stop-color="#0f2b66"/></linearGradient>
<linearGradient id="bscMetal" x1="0" x2="1"><stop offset="0" stop-color="#5d6b7a"/><stop offset=".45" stop-color="#c9d3dd"/><stop offset="1" stop-color="#4a5664"/></linearGradient>
<linearGradient id="bscRack" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3b4654"/><stop offset="1" stop-color="#1b232d"/></linearGradient>
<linearGradient id="bscSparkS" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-solar)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-solar)"/></linearGradient>
<linearGradient id="bscSparkL" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-accent)"/></linearGradient>
</defs>`,_t=(()=>{let a=[[16,12],[54,9],[58,38],[8,42]],e=(s,o)=>[0,1].map(r=>(a[0][r]*(1-s)*(1-o)+a[1][r]*s*(1-o)+a[2][r]*s*o+a[3][r]*(1-s)*o).toFixed(1)),t="";for(let s=1;s<4;s++)t+=`M${e(s/4,0)}L${e(s/4,1)}`;for(let s=1;s<3;s++)t+=`M${e(0,s/3)}L${e(1,s/3)}`;return t})(),E={panel:`<svg class="art panel" viewBox="0 0 64 64" aria-hidden="true">
<path class="st" d="M33 40v14M24.5 56h17M33 46l9-6"/>
<path class="pf" d="M16 12 54 9 58 38 8 42Z"/>
<path class="pg" d="${_t}"/>
<path class="gl" d="M17 13.5 34 12 31 24 13 25.5Z"/>
</svg>`,house:`<svg class="art house" viewBox="0 0 64 64" aria-hidden="true">
<ellipse class="gnd" cx="32" cy="56" rx="25" ry="3"/>
<rect class="chim" x="41" y="15" width="5" height="10" rx="1"/>
<path class="wall" d="M14 30v25h36V30L32 15z"/>
<path class="roof" d="M8 32.5 32 12l24 20.5-2.8 2.6L32 17.4 10.8 35.1z"/>
<rect class="win" x="18.5" y="35" width="8" height="7" rx="1"/>
<rect class="win" x="37.5" y="35" width="8" height="7" rx="1"/>
<circle class="win" cx="32" cy="26" r="2.6"/>
<rect class="door" x="29" y="42" width="6" height="13" rx="1"/>
</svg>`,boiler:`<svg class="art boiler" viewBox="0 0 64 64" aria-hidden="true">
<path class="pipe" d="M27 55v6M37 55v6"/>
<rect class="tank" x="19" y="4" width="26" height="53" rx="11"/>
<path class="band" d="M19 18h26M19 45h26"/>
<g class="heat"><path d="M25.5 39c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/><path d="M25.5 32c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/><path d="M25.5 25c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0"/></g>
<circle class="led" cx="32" cy="11" r="2"/>
</svg>`,battery:`<svg class="art bat" viewBox="0 0 40 64" aria-hidden="true">
<rect class="bcap" x="14" y="3" width="12" height="5" rx="1.5"/>
<rect class="bbody" x="6" y="7" width="28" height="53" rx="6"/>
<rect class="blvl" x="10" y="11" width="20" height="45" rx="3"/>
<path class="bseg" d="M10 22.2h20M10 33.5h20M10 44.7h20"/>
<path class="bbolt" d="M22.5 19 14 35h6.5l-2.5 11 9-16.5h-6.5z"/>
</svg>`,rack:`<svg class="art rack" viewBox="0 0 64 72" aria-hidden="true">
<path class="rs" d="M46 12 56 6v56l-10 6z"/>
<path class="rt" d="M8 12 18 6h38l-10 6z"/>
<rect class="rf" x="8" y="12" width="38" height="56" rx="3"/>
<path class="rsep" d="M8 30.7h38M8 49.3h38"/>
${[0,1,2].map(a=>`<rect class="slot" x="27" y="${18.5+a*18.6}" width="13" height="2.4" rx="1.2"/>
<rect class="slot" x="27" y="${23+a*18.6}" width="13" height="2.4" rx="1.2"/>
<circle class="led" style="animation-delay:${a*.35}s" cx="15" cy="${21.3+a*18.6}" r="2"/>
<circle class="led" style="animation-delay:${a*.35+.6}s" cx="21" cy="${21.3+a*18.6}" r="2"/>`).join("")}
</svg>`,sun:`<svg class="art sun" viewBox="0 0 48 48" aria-hidden="true">
<g class="rays"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/></g>
<circle class="core" cx="24" cy="24" r="9"/>
</svg>`};function X(a,e){if(a?.includes(":"))return`<ha-icon icon="${a}"></ha-icon>`;let t=a||(/tuv|bojler|boiler|ohřev|ohrev|water|heater/i.test(e)?"boiler":"house");return E[t]&&t!=="battery"&&t!=="rack"?E[t]:M[t]||M.plug}var W=(a,e,t,s)=>`${a} ${a===1?e:a>=2&&a<=4?t:s}`,R=(a,e,t)=>`${a} ${a===1?e:t}`,tt={cs:{kpiSolar:"Sol\xE1rn\xED v\xFDroba",kpiBattery:"Stav baterie",kpiLoad:"Spot\u0159eba",solar:"Sol\xE1rn\xED panely",battery:"Baterie / BMS",loads:"Spot\u0159eba",zones:a=>W(a,"z\xF3na","z\xF3ny","z\xF3n"),modules:a=>W(a,"bateriov\xFD modul","bateriov\xE9 moduly","bateriov\xFDch modul\u016F"),circuits:a=>W(a,"okruh","okruhy","okruh\u016F"),totalProduction:"Celkov\xE1 v\xFDroba",totalConsumption:"Celkov\xE1 spot\u0159eba",producing:"Vyr\xE1b\xED",idle:"Ne\u010Dinn\xFD",unavailable:"Nedostupn\xE9",charging:"Nab\xEDjen\xED",discharging:"Vyb\xEDjen\xED",standby:"Klid",system:"Bateriov\xFD syst\xE9m",balance:"Bilance syst\xE9mu",surplus:"P\u0159ebytek v\xFDroby",deficit:"Deficit v\xFDroby",capacity:"Kapacita",fullIn:"Pln\u011B nabito za",lastsFor:"Vydr\u017E\xED",peak:"\u0160pi\u010Dka",ofTotal:"z celkov\xE9 spot\u0159eby",h:"h",min:"min",empty:"Vyberte senzory v nastaven\xED karty.",ed:{sections:{solar:"Sol\xE1rn\xED panely",batteries:"Baterie",loads:"Spot\u0159ebi\u010De"},add:{solar:"P\u0159idat panely / z\xF3nu",batteries:"P\u0159idat baterii",loads:"P\u0159idat spot\u0159ebi\u010D"},none:{solar:"Zat\xEDm \u017E\xE1dn\xE9 panely",batteries:"Zat\xEDm \u017E\xE1dn\xE1 baterie",loads:"Zat\xEDm \u017E\xE1dn\xFD spot\u0159ebi\u010D"},hint:{solar:"Vyberte senzor v\xFDkonu. Nap\u011Bt\xED a proud se dopln\xED samy, pokud pat\u0159\xED ke stejn\xE9mu za\u0159\xEDzen\xED.",batteries:"Vyberte senzor nabit\xED (SOC) z BMS. Nap\u011Bt\xED, proud, v\xFDkon a teplota se dopln\xED samy.",loads:"Vyberte senzor v\xFDkonu spot\u0159ebi\u010De (W nebo kW)."},newItem:{solar:"Z\xF3na",batteries:"Baterie",loads:"Spot\u0159ebi\u010D"},name:"N\xE1zev",power:"V\xFDkon",voltage:"Nap\u011Bt\xED",current:"Proud",soc:"Stav nabit\xED (SOC)",capacity:"Kapacita baterie (kWh)",temperature:"Teplota",invert:"BMS hl\xE1s\xED nab\xEDjen\xED jako z\xE1porn\xE9 \u010D\xEDslo",icon:"Obr\xE1zek",more:"Dal\u0161\xED senzory (dopln\xED se samy)",icons:{house:"D\u016Fm",boiler:"Oh\u0159ev vody (TUV)",car:"Auto / nab\xEDje\u010Dka",plug:"Jin\xE9"},look:"Vzhled",title:"Nadpis karty (nepovinn\xE9)",appearance:"Barevn\xE9 proveden\xED",apAuto:"Podle motivu Home Assistantu",apDark:"V\u017Edy tmav\xE9",advanced:"Pokro\u010Dil\xE9",threshold:"Pod kolika W je za\u0159\xEDzen\xED ne\u010Dinn\xE9",min_soc:"Minim\xE1ln\xED SOC pro odhad v\xFDdr\u017Ee (%)",battery_from_balance:"Nab\xEDjen\xED / vyb\xEDjen\xED baterie ur\u010Dit z v\xFDroby a spot\u0159eby (BMS neukazuje sm\u011Br spr\xE1vn\u011B)",history_hours:"Graf historie \u2013 kolik hodin (0 = vypnout)",animation:"Animace tok\u016F energie",show_kpis:"Souhrnn\xFD pruh naho\u0159e",show_stats:"Kapacita a nab\xEDjen\xED pod bateri\xED",show_total:"Box celkov\xE9 spot\u0159eby",colors:"Barvy",cSolar:"V\xFDroba",cBattery:"Baterie",cLoad:"Spot\u0159eba",demoNote:"Karta ukazuje uk\xE1zkov\xE1 data. Jakmile p\u0159id\xE1te prvn\xED senzor, nahrad\xED je skute\u010Dn\xE9 hodnoty.",showAll:"Nab\xEDzet v\u0161echny senzory (i bez ur\u010Den\xE9ho typu)",del:"Smazat",confirm:"Opravdu smazat?",up:"Posunout v\xFD\u0161",down:"Posunout n\xED\u017E",noSensor:"Senzor nevybr\xE1n"}},en:{kpiSolar:"Solar production",kpiBattery:"Battery",kpiLoad:"Consumption",solar:"Solar panels",battery:"Battery / BMS",loads:"Consumption",zones:a=>R(a,"string","strings"),modules:a=>R(a,"battery module","battery modules"),circuits:a=>R(a,"circuit","circuits"),totalProduction:"Total production",totalConsumption:"Total consumption",producing:"Producing",idle:"Idle",unavailable:"Unavailable",charging:"Charging",discharging:"Discharging",standby:"Standby",system:"Battery system",balance:"System balance",surplus:"Production surplus",deficit:"Production deficit",capacity:"Capacity",fullIn:"Full in",lastsFor:"Lasts",peak:"Peak",ofTotal:"of total",h:"h",min:"min",empty:"Pick sensors in the card settings.",ed:{sections:{solar:"Solar panels",batteries:"Batteries",loads:"Consumers"},add:{solar:"Add panels / string",batteries:"Add battery",loads:"Add consumer"},none:{solar:"No panels yet",batteries:"No battery yet",loads:"No consumer yet"},hint:{solar:"Pick the power sensor. Voltage and current are filled in automatically from the same device.",batteries:"Pick the BMS state of charge (SOC) sensor. Voltage, current, power and temperature are filled in automatically.",loads:"Pick the consumer power sensor (W or kW)."},newItem:{solar:"String",batteries:"Battery",loads:"Consumer"},name:"Name",power:"Power",voltage:"Voltage",current:"Current",soc:"State of charge (SOC)",capacity:"Battery capacity (kWh)",temperature:"Temperature",invert:"BMS reports charging as a negative number",icon:"Picture",more:"More sensors (filled in automatically)",icons:{house:"House",boiler:"Water heater",car:"Car / charger",plug:"Other"},look:"Look",title:"Card title (optional)",appearance:"Color scheme",apAuto:"Follow Home Assistant theme",apDark:"Always dark",advanced:"Advanced",threshold:"Below how many W a device is idle",min_soc:"Minimum SOC for runtime estimate (%)",battery_from_balance:"Derive battery charging / discharging from production and consumption (BMS direction is unreliable)",history_hours:"History chart \u2013 hours (0 = off)",animation:"Energy flow animation",show_kpis:"Summary strip on top",show_stats:"Capacity and charging below battery",show_total:"Total consumption box",colors:"Colors",cSolar:"Production",cBattery:"Battery",cLoad:"Consumption",demoNote:"The card shows sample data. As soon as you add your first sensor, real values replace it.",showAll:"Offer all sensors (including untyped ones)",del:"Delete",confirm:"Really delete?",up:"Move up",down:"Move down",noSensor:"No sensor selected"}}};function j(a){return tt[(a||"").slice(0,2)]||tt.en}var yt={W:1,kW:1e3,MW:1e6,mW:.001,V:1,mV:.001,kV:1e3,A:1,mA:.001,Wh:.001,kWh:1,MWh:1e3};function at(a){if(!a)return null;let e=parseFloat(a.state);return Number.isFinite(e)?e:null}function P(a){let e=at(a);return e==null?null:e*(yt[a.attributes?.unit_of_measurement]??1)}var A=a=>{let e=null;for(let t of a)t!=null&&(e=(e??0)+t);return e},et=a=>{let e=a.filter(t=>t!=null);return e.length?e.reduce((t,s)=>t+s,0)/e.length:null};function kt(a,e,t){if(a==null)return null;if(typeof a=="number")return a;let s=e(a),o=s?.attributes?.unit_of_measurement;if(o==="Ah"||o==="mAh"){let r=at(s);return r==null||t==null?null:(o==="mAh"?r/1e3:r)*t/1e3}return P(s)}function ot(a,e){let t=a.threshold,s=l=>l==null?null:typeof l=="number"?l:P(e(l)),o=(l,m)=>l!=null&&m!=null?l*m:null,r=a.solar.map(l=>{let m=s(l.voltage),k=s(l.current),x=s(l.power)??o(m,k);return{p:x,v:m,i:k,na:x==null,on:x!=null&&x>t}}),i=a.batteries.map(l=>{let m=s(l.voltage),k=s(l.current),x=s(l.power)??o(m,k);x!=null&&l.invert&&(x=-x);let g=s(l.soc),v=kt(l.capacity,e,m);return{p:x,v:m,i:k,soc:g,cap:v,temp:s(l.temperature),na:g==null&&m==null,on:x!=null&&Math.abs(x)>t}}),n=a.loads.map(l=>{let m=s(l.power);return{p:m,na:m==null,on:m!=null&&m>t}}),c=A(r.map(l=>l.p)),u=A(n.map(l=>l.p==null?null:Math.max(0,l.p)));for(let l of n)l.share=u&&l.p!=null?Math.max(0,l.p)/u:0;let b=c==null&&u==null?null:(c??0)-(u??0);if(a.battery_from_balance&&b!=null){let l=b<0?-1:1;for(let m of i)m.p!=null&&(m.p=l*Math.abs(m.p));if(i.length&&i.every(m=>m.p==null)){let m=i.every(x=>x.cap),k=m?A(i.map(x=>x.cap)):i.length;for(let x of i)x.p=b*(m?x.cap:1)/k}for(let m of i)m.on=m.p!=null&&Math.abs(m.p)>t}let d=i.filter(l=>l.soc!=null),p=d.length&&d.every(l=>l.cap),f=A(i.map(l=>l.cap)),_=d.length?p?d.reduce((l,m)=>l+m.soc*m.cap,0)/d.reduce((l,m)=>l+m.cap,0):et(d.map(l=>l.soc)):null,y=p?A(d.map(l=>l.soc/100*l.cap)):null,h=A(i.map(l=>l.p));return{pv:r,bat:i,loads:n,pvTotal:c,loadTotal:u,battery:{soc:_,v:et(i.map(l=>l.v)),p:h,cap:f,stored:y,state:h==null||Math.abs(h)<=t?"idle":h>0?"charging":"discharging"},balance:b}}function it(a,e=0){if(a.state==="idle"||a.cap==null||a.soc==null||!a.p)return null;let s=(a.p>0?a.cap*(1-a.soc/100):a.cap*Math.max(0,a.soc-e)/100)/(Math.abs(a.p)/1e3);return Number.isFinite(s)&&s<1e3?s:null}function rt(a){let e=Math.max(Math.abs(a??0),1);return Math.round(Math.min(150,25+30*Math.log10(e))/15)*15}function nt(a){let e=[],t=0,s=0;for(let[,o,r]of a.matchAll(/([MLHVQ])([^MLHVQ]*)/g)){let i=r.trim().split(/[\s,]+/).map(Number);o==="H"?t=i[0]:o==="V"?s=i[0]:o==="Q"?[t,s]=[i[2],i[3]]:[t,s]=i,e.push([t,s])}return e}function lt(a,e){let t=e.slice(1).map((i,n)=>Math.hypot(i[0]-e[n][0],i[1]-e[n][1])),s=t.reduce((i,n)=>i+n,0),o=0,r=e.map((i,n)=>(n&&(o+=t[n-1]),`${s?Math.round(o/s*1e4)/100:0}%{transform:translate(${i[0]}px,${i[1]}px)}`));return{css:`@keyframes ${a}{${r.join("")}}`,len:s}}function ct(a){return a==null?"na":a>=50?"ok":a>=20?"mid":"low"}var st=new Map;function dt(a){return(e,t=0)=>{let s=a+t,o=st.get(s);return o||(o=new Intl.NumberFormat(a,{minimumFractionDigits:t,maximumFractionDigits:t}),st.set(s,o)),o.format(e)}}var $="\u2014";function H(a,e,t=!1){if(a==null)return $;let s=Math.abs(a),o=t&&a>.5?"+":"";return s>=1e3?o+e(a/1e3,s>=1e4?1:2)+" kW":o+e(Math.round(a)||0,0)+" W"}function T(a,e,t,s=1){return a==null?$:`${t(a,s)} ${e}`}function pt(a,e){if(a==null)return"";let t=Math.round(a*60),s=Math.floor(t/60),o=t%60;return s?`${s} ${e.h} ${o} ${e.min}`:`${o} ${e.min}`}var L=a=>Math.round(a*10)/10;function G(a,e,t,s,o,r=12){[a,e,t,s,o]=[a,e,t,s,o].map(L);let i=s-e;if(Math.abs(i)<1)return`M${a} ${e}H${t}`;let n=Math.sign(i),c=Math.sign(o-a)||1,u=Math.sign(t-o)||1,b=L(Math.min(r,Math.abs(i)/2,Math.abs(o-a),Math.abs(t-o)));return`M${a} ${e}H${o-c*b}Q${o} ${e} ${o} ${e+n*b}V${s-n*b}Q${o} ${s} ${o+u*b} ${s}H${t}`}function ht(a,e,t,s,o,r=10){[a,e,t,s,o]=[a,e,t,s,o].map(L);let i=t-a;if(Math.abs(i)<1)return`M${a} ${e}V${s}`;let n=Math.sign(i),c=Math.sign(o-e)||1,u=Math.sign(s-o)||1,b=L(Math.min(r,Math.abs(i)/2,Math.abs(o-e),Math.abs(s-o)));return`M${a} ${e}V${o-c*b}Q${a} ${o} ${a+n*b} ${o}H${t-n*b}Q${t} ${o} ${t} ${o+u*b}V${s}`}function ut(a,e=72,t=32){if(!a?.length)return"";let s=0;for(let n of a)n>s&&(s=n);let o=e/a.length,r=o*.38,i="";return a.forEach((n,c)=>{let u=Math.max(1.5,s?Math.max(0,n??0)/s*t:0);i+=`M${L(c*o+r/2)} ${L(t-u)}h${L(o-r)}V${t}h${L(r-o)}Z`}),i}var D=class{constructor(e,t){this.n=t,this.ms=e*36e5/t,this.t0=this.slot(Date.now()),this.s=new Map}slot(e){return Math.floor(e/this.ms)*this.ms}get(e){let t=this.s.get(e);return t||this.s.set(e,t={v:new Array(this.n).fill(null),sum:0,c:0}),t}roll(e=Date.now()){let t=Math.round((this.slot(e)-this.t0)/this.ms);if(t<=0)return!1;this.t0+=t*this.ms;for(let s of this.s.values())s.v=t>=this.n?new Array(this.n).fill(null):s.v.slice(t).concat(new Array(t).fill(null)),s.sum=0,s.c=0;return!0}sample(e,t){if(t==null)return;let s=this.get(e);s.sum+=t,s.c++,s.v[this.n-1]=s.sum/s.c}series(e){return this.s.get(e)?.v}total(e){let t=new Array(this.n).fill(null);for(let s of e){let o=this.series(s);o&&o.forEach((r,i)=>{r!=null&&(t[i]=(t[i]??0)+r)})}return t}seed(e,t){let s=this.t0-(this.n-1)*this.ms,o=new Map;for(let i of t||[]){if(i.mean==null)continue;let n=typeof i.start=="number"?i.start:Date.parse(i.start),c=Math.floor((n-s)/this.ms);if(c<0||c>=this.n-1)continue;let u=o.get(c)||[0,0];u[0]+=i.mean,u[1]++,o.set(c,u)}let r=this.get(e);for(let[i,[n,c]]of o)r.v[i]==null&&(r.v[i]=n/c)}async load(e,t){if(!t.length||!e?.callWS)return;let s=await e.callWS({type:"recorder/statistics_during_period",start_time:new Date(this.t0-(this.n-1)*this.ms).toISOString(),statistic_ids:t,period:this.ms>=36e5?"hour":"5minute",types:["mean"],units:{power:"W"}});for(let o of t)this.seed(o,s?.[o])}};var w="demo.",B=a=>({power:`${w}${a}_power`,voltage:`${w}${a}_voltage`,current:`${w}${a}_current`}),mt={solar:[{name:"Z\xF3na 1",...B("pv1")},{name:"Z\xF3na 2",...B("pv2")},{name:"Z\xF3na 3",...B("pv3")}],batteries:[{name:"Baterie A",soc:`${w}bat1_soc`,temperature:`${w}bat1_temp`,capacity:5.12,...B("bat1")},{name:"Baterie B",soc:`${w}bat2_soc`,temperature:`${w}bat2_temp`,capacity:5.12,...B("bat2")}],loads:[{name:"D\u016Fm",power:`${w}house_power`,icon:"house"},{name:"Oh\u0159ev TUV",power:`${w}boiler_power`,icon:"boiler"}]},C=(a,e,t=1)=>({state:a.toFixed(t),attributes:{unit_of_measurement:e}});function q(a){let e=a/1e3,t=.86+.1*Math.sin(e/23),s={},o=0;[[820,112],[540,109],[310,105]].forEach(([c,u],b)=>{let d=c*t*(1+.06*Math.sin(e/5+b*2)),p=u+1.5*Math.sin(e/11+b);o+=d,s[`${w}pv${b+1}_power`]=C(d,"W",0),s[`${w}pv${b+1}_voltage`]=C(p,"V"),s[`${w}pv${b+1}_current`]=C(d/p,"A",2)});let r=1150+260*Math.sin(e/9)+90*Math.sin(e/2.3),i=Math.sin(e/30)>.35?1950+40*Math.sin(e):0;s[`${w}house_power`]=C(r,"W",0),s[`${w}boiler_power`]=C(i,"W",0);let n=o-r-i;return[[.55,78,51.8,24.5],[.45,81,51.6,23.1]].forEach(([c,u,b,d],p)=>{let f=n*c,_=b+f/4e3,y=`${w}bat${p+1}`;s[`${y}_power`]=C(f,"W",0),s[`${y}_voltage`]=C(_,"V",2),s[`${y}_current`]=C(f/_,"A",1),s[`${y}_soc`]=C(u+3*Math.sin(e/60),"%",0),s[`${y}_temp`]=C(d+Math.sin(e/40),"\xB0C")}),s}function bt(a,e,t){return Array.from({length:a},(s,o)=>{let r=(o+1)/a,i=e==="solar"?Math.sin(r*Math.PI*.55):.55+.35*Math.abs(Math.sin(o*1.7));return t*i*(.9+.2*Math.abs(Math.sin(o*2.3)))})}function K(a,e,t,s){if(a==null)return[];if(!Array.isArray(a))throw new Error(`"${e}" must be a list`);return a.map(o=>typeof o=="string"?{[t]:o}:{...o}).filter(s)}var wt=a=>Array.isArray(a)?`rgb(${a.join(",")})`:a,O=(a,e)=>a!==null&&a!==""&&Number.isFinite(Number(a))?Number(a):e;function ft(a){if(!a||typeof a!="object")throw new Error("Invalid configuration");let e=!!a.demo,t=e&&!a.solar&&!a.batteries&&!a.loads?{...a,...mt}:a,s=K(t.solar,"solar","power",n=>n.power||n.voltage&&n.current),o=K(t.batteries,"batteries","soc",n=>n.soc||n.voltage),r=K(t.loads,"loads","power",n=>n.power),i=Object.fromEntries(Object.entries(t.colors||{}).filter(([,n])=>n).map(([n,c])=>[n,wt(c)]));return{demo:e,empty:!s.length&&!o.length&&!r.length,title:t.title??"",appearance:t.appearance==="dark"?"dark":"auto",threshold:O(t.threshold,10),min_soc:O(t.min_soc,0),battery_from_balance:!!t.battery_from_balance,history_hours:O(t.history_hours,12),history_bars:Math.round(Math.min(60,Math.max(6,O(t.history_bars,24)))),wide_breakpoint:O(t.wide_breakpoint,1e3),animation:t.animation!==!1,show_kpis:t.show_kpis!==!1,show_stats:t.show_stats!==!1,show_total:t.show_total!==!1,colors:i,titles:t.titles||{},solar:s.map((n,c)=>({name:`PV ${c+1}`,...n})),batteries:o.map((n,c)=>({name:`BMS ${c+1}`,...n})),loads:r.map((n,c)=>({name:`${c+1}`,...n}))}}var $t=(a,e)=>{let t=0;for(;t<a.length&&a[t]===e[t];)t++;return t};function gt(a,e,t){let s=a?.entities?.[e]?.device_id;if(!s)return{};let o=Object.values(a.entities).filter(i=>i.device_id===s&&i.entity_id!==e&&!i.hidden&&!i.disabled_by),r={};for(let[i,n]of Object.entries(t)){let c=o.filter(u=>a.states[u.entity_id]?.attributes?.device_class===n).map(u=>[$t(u.entity_id,e),u.entity_id]).sort((u,b)=>b[0]-u[0]);(c.length===1||c.length>1&&c[0][0]>c[1][0])&&(r[i]=c[0][1])}return r}function vt(a,e,t){let s=a?.devices?.[a?.entities?.[e]?.device_id],o=s?.name_by_user||s?.name,r=a?.states?.[e]?.attributes?.friendly_name;return(t?o||r:r||o)||""}var V={solar:{main:"power",dc:"power",fill:{voltage:"voltage",current:"current"},icon:"mdi:solar-panel-large",byDevice:!1},batteries:{main:"soc",dc:"battery",fill:{voltage:"voltage",current:"current",power:"power",temperature:"temperature"},icon:"mdi:battery-high",byDevice:!0},loads:{main:"power",dc:"power",fill:null,icon:"mdi:home-lightning-bolt-outline",byDevice:!1}},Z={appearance:"auto",animation:!0,show_kpis:!0,show_stats:!0,show_total:!0,history_hours:12,threshold:10,min_soc:0,battery_from_balance:!1},Mt=["title",...Object.keys(Z)],St=a=>String(a??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),xt=a=>Object.fromEntries(Object.entries(a).filter(([e,t])=>t!==""&&t!=null&&!(e==="invert"&&t===!1)));async function zt(){if(!(customElements.get("ha-form")&&customElements.get("ha-entity-picker"))){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"entities",entities:[]}))?.constructor?.getConfigElement?.()}catch{}await customElements.whenDefined("ha-form")}}var Ct=`
:host { display: block; }
.ed { display: grid; gap: 22px; }
.note { padding: 12px 14px; border-radius: 12px; font-size: 14px; line-height: 1.45;
  background: color-mix(in srgb, var(--primary-color) 12%, transparent); }
.sec { display: grid; gap: 10px; }
.sec-h { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; }
.sec-h ha-icon { color: var(--primary-color); }
.cnt { margin-left: auto; font-size: 13px; font-weight: 400; color: var(--secondary-text-color); }
.hint { margin: -4px 0 2px; font-size: 13px; line-height: 1.4; color: var(--secondary-text-color); }
.none { padding: 2px; font-size: 14px; color: var(--secondary-text-color); }
.it { border: 1px solid var(--divider-color); border-radius: 14px; background: var(--card-background-color); overflow: hidden; }
.it.open { border-color: var(--primary-color); }
.it-h { display: flex; align-items: center; gap: 12px; min-height: 58px; padding: 6px 8px 6px 14px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.it-h > ha-icon { color: var(--secondary-text-color); flex: none; }
.it-t { flex: 1; min-width: 0; display: grid; gap: 1px; }
.it-n, .it-v { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.it-n { font-size: 15px; font-weight: 600; }
.it-v { font-size: 13px; color: var(--secondary-text-color); }
.it-v.miss { color: var(--warning-color, #e6a23c); }
.chev { transition: transform .2s; }
.open .chev { transform: rotate(180deg); }
.it-b { padding: 6px 14px 12px; border-top: 1px solid var(--divider-color); }
.acts { display: flex; align-items: center; gap: 4px; margin-top: 8px; }
.ib { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 44px; height: 44px;
  padding: 0 10px; border: 0; border-radius: 22px; background: none; color: var(--secondary-text-color);
  font: inherit; font-size: 14px; cursor: pointer; }
.ib:hover { background: var(--secondary-background-color); }
.ib[disabled] { opacity: .3; pointer-events: none; }
.ib.del { margin-left: auto; color: var(--error-color, #db4437); }
.ib.del.armed { background: var(--error-color, #db4437); color: #fff; font-weight: 600; }
.add { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; width: 100%;
  border: 1.5px dashed var(--divider-color); border-radius: 14px; background: none;
  color: var(--primary-color); font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
.add:hover { border-color: var(--primary-color); }
.all { display: flex; align-items: center; gap: 12px; min-height: 44px; font-size: 14px; color: var(--secondary-text-color); cursor: pointer; }
.all input { width: 20px; height: 20px; margin: 0; accent-color: var(--primary-color); }
`,U=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._open=null,this._all=!1,this._forms=[],this.shadowRoot.addEventListener("click",e=>this._click(e)),this.shadowRoot.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&e.target.classList?.contains("it-h")&&(e.preventDefault(),this._click(e))})}setConfig(e){let t=JSON.stringify(e);t!==this._json&&(this._json=t,this._config=JSON.parse(t),this._render())}set hass(e){let t=!this._hass;this._hass=e;for(let s of this._forms)s.hass=e;t?this._render():this._live()}connectedCallback(){zt().then(()=>{this._ready=!0,this._render()})}_item(e,t){let s=this._config[e]?.[t];return typeof s=="string"?{[V[e].main]:s}:{...s}}_render(){if(!this._ready||!this._config||!this._hass)return;let t=(this._t=j(this._hass.language)).ed,s=this._config,o=Object.entries(V).map(([r,i])=>{let n=s[r]||[],c=n.map((u,b)=>{let d=`${r}:${b}`,p=this._open===d,f=this._item(r,b);return`<div class="it${p?" open":""}" data-key="${d}">
<div class="it-h" data-act="toggle" role="button" tabindex="0" aria-expanded="${p}">
<ha-icon icon="${i.icon}"></ha-icon>
<div class="it-t"><span class="it-n" data-n="${d}">${St(f.name||`${t.newItem[r]} ${b+1}`)}</span><span class="it-v" data-v="${d}"></span></div>
<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></div>
${p?`<div class="it-b"><div data-form="${d}"></div><div class="acts">
<button class="ib" data-act="up" title="${t.up}" ${b===0?"disabled":""}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
<button class="ib" data-act="down" title="${t.down}" ${b===n.length-1?"disabled":""}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
<button class="ib del" data-act="del"><ha-icon icon="mdi:delete-outline"></ha-icon><span>${t.del}</span></button>
</div></div>`:""}</div>`}).join("");return`<section class="sec" data-sec="${r}">
<div class="sec-h"><ha-icon icon="${i.icon}"></ha-icon>${t.sections[r]}<span class="cnt">${n.length||""}</span></div>
${n.length?`<p class="hint">${t.hint[r]}</p>${c}`:`<div class="none">${t.none[r]}</div>`}
<button class="add" data-act="add"><ha-icon icon="mdi:plus"></ha-icon>${t.add[r]}</button>
</section>`}).join("");this.shadowRoot.innerHTML=`<style>${Ct}</style><div class="ed">
${s.demo?`<div class="note">${t.demoNote}</div>`:""}
${o}
<section class="sec"><div class="sec-h"><ha-icon icon="mdi:palette-outline"></ha-icon>${t.look}</div><div data-form="general"></div></section>
<label class="all"><input type="checkbox" data-act="all" ${this._all?"checked":""}>${t.showAll}</label>
</div>`,this._forms=[];for(let r of this.shadowRoot.querySelectorAll("[data-form]")){let i=r.dataset.form,n=document.createElement("ha-form");if(n.hass=this._hass,n.computeLabel=c=>this._label(c),i==="general")n.schema=this._generalSchema(),n.data={...Z,...s},n.addEventListener("value-changed",c=>this._onGeneral(c));else{let[c,u]=i.split(":");n.schema=this._itemSchema(c),n.data=this._item(c,+u),n.addEventListener("value-changed",b=>this._onItem(b,c,+u,n))}r.replaceWith(n),this._forms.push(n)}this._live()}_label(e){let t=this._t.ed;return e.selector?.color_rgb?{solar:t.cSolar,battery:t.cBattery,load:t.cLoad}[e.name]:t[e.name]??e.name}_sensor(e){return{entity:this._all||!e?{domain:"sensor"}:{domain:"sensor",device_class:e}}}_itemSchema(e){let t=this._t.ed,s=n=>this._sensor(n),o=n=>({name:"more",type:"expandable",flatten:!0,title:t.more,schema:n});if(e==="solar")return[{name:"power",selector:s("power")},{name:"name",selector:{text:{}}},o([{name:"voltage",selector:s("voltage")},{name:"current",selector:s("current")}])];if(e==="batteries")return[{name:"soc",selector:s("battery")},{name:"name",selector:{text:{}}},{name:"capacity",selector:{number:{min:0,max:1e3,step:.01,mode:"box",unit_of_measurement:"kWh"}}},o([{name:"voltage",selector:s("voltage")},{name:"current",selector:s("current")},{name:"power",selector:s("power")},{name:"temperature",selector:s("temperature")},{name:"invert",selector:{boolean:{}}}])];let r=Object.entries(t.icons).map(([n,c])=>({value:n,label:c})),i=this._item(e,+this._open?.split(":")[1]).icon;return i&&!t.icons[i]&&r.push({value:i,label:i}),[{name:"power",selector:s("power")},{name:"name",selector:{text:{}}},{name:"icon",selector:{select:{mode:"dropdown",options:r}}}]}_generalSchema(){let e=this._t.ed,t=s=>({name:s,selector:{boolean:{}}});return[{name:"title",selector:{text:{}}},{name:"appearance",selector:{select:{mode:"list",options:[{value:"auto",label:e.apAuto},{value:"dark",label:e.apDark}]}}},{name:"advanced",type:"expandable",flatten:!0,title:e.advanced,schema:[t("animation"),t("show_kpis"),t("show_stats"),t("show_total"),{name:"history_hours",selector:{number:{min:0,max:48,step:1,mode:"slider"}}},{name:"min_soc",selector:{number:{min:0,max:100,step:1,mode:"slider",unit_of_measurement:"%"}}},{name:"threshold",selector:{number:{min:0,max:500,step:1,mode:"box",unit_of_measurement:"W"}}},t("battery_from_balance"),{name:"colors",type:"expandable",title:e.colors,schema:[{name:"solar",selector:{color_rgb:{}}},{name:"battery",selector:{color_rgb:{}}},{name:"load",selector:{color_rgb:{}}}]}]}]}_live(){if(this._t)for(let e of this.shadowRoot.querySelectorAll("[data-v]")){let[t,s]=e.dataset.v.split(":"),o=this._item(t,+s)[V[t].main],r=o&&this._hass.states[o],i=o?r?`${r.state} ${r.attributes.unit_of_measurement??""}`.trim():o:this._t.ed.noSensor;e.classList.toggle("miss",!o),e.textContent!==i&&(e.textContent=i)}}_fire(){this._json=JSON.stringify(this._config),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:JSON.parse(this._json)},bubbles:!0,composed:!0}))}_onItem(e,t,s,o){e.stopPropagation();let r=V[t],i=this._item(t,s),n=xt(e.detail.value),c=n[r.main];if(c&&c!==i[r.main]){if(r.fill)for(let[b,d]of Object.entries(gt(this._hass,c,r.fill)))n[b]||(n[b]=d);n.name||(n.name=vt(this._hass,c,r.byDevice)),o.data=n}this._config[t][s]=n;let u=this.shadowRoot.querySelector(`[data-n="${t}:${s}"]`);u&&(u.textContent=n.name||`${this._t.ed.newItem[t]} ${s+1}`),this._live(),this._fire()}_onGeneral(e){e.stopPropagation();let t=e.detail.value,s=this._config;for(let r of Mt)t[r]===void 0||t[r]===""||t[r]===Z[r]?delete s[r]:s[r]=t[r];let o=xt(t.colors||{});Object.keys(o).length?s.colors=o:delete s.colors,this._fire()}_click(e){let t=e.target.closest("[data-act]");if(!t)return;let s=t.dataset.act;if(s==="all"){this._all=t.checked,this._render();return}let o=t.closest("[data-sec]")?.dataset.sec,r=t.closest("[data-key]")?.dataset.key,i=r?+r.split(":")[1]:-1,n=this._config;if(s==="toggle")this._open=this._open===r?null:r;else if(s==="add")n[o]=[...n[o]||[],{}],delete n.demo,this._open=`${o}:${n[o].length-1}`,this._fire();else if(s==="del"){if(!t.classList.contains("armed")){t.classList.add("armed"),t.lastElementChild.textContent=this._t.ed.confirm,setTimeout(()=>{t.classList.remove("armed"),t.lastElementChild.textContent=this._t.ed.del},3e3);return}n[o].splice(i,1),n[o].length||delete n[o],this._open=null,this._fire()}else if(s==="up"||s==="down"){let c=s==="up"?i-1:i+1;[n[o][i],n[o][c]]=[n[o][c],n[o][i]],this._open=`${o}:${c}`,this._fire()}this._render()}};customElements.get("bugsa-solar-card-editor")||customElements.define("bugsa-solar-card-editor",U);var Et="1.1.1",Q="bugsa-solar-card",Lt=1e4,Tt=2e3,At=1e3,jt=["power","voltage","current","soc","temperature","capacity"],S=a=>String(a??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),N=a=>a?`<svg class="spark" viewBox="0 0 72 32" preserveAspectRatio="none" aria-hidden="true"><path data-s="${S(a)}"/></svg>`:"",Y=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._seen={},this._visible=!0,this._get=e=>this._cfg?.demo?this._demo?.[e]:this._hass?.states[e]}static getStubConfig(){return{demo:!0}}static getConfigElement(){return document.createElement("bugsa-solar-card-editor")}setConfig(e){let t=ft(e);this._cfg=t;let s=[...t.solar,...t.batteries,...t.loads];this._ids=[...new Set(s.flatMap(o=>jt.map(r=>o[r]).filter(r=>typeof r=="string")))],this._pvIds=t.solar.map(o=>o.power).filter(Boolean),this._ldIds=t.loads.map(o=>o.power).filter(Boolean),this._seen={},this._built=!1,this._emptyLang=null,this._hist=t.history_hours>0?new D(t.history_hours,t.history_bars):null,this._histInit=!1,t.demo&&(this._demo=q(Date.now())),this.isConnected&&(this._stop(),this._start()),this._schedule()}set hass(e){if(this._hass=e,!this._ids||this._cfg.demo){this._cfg?.demo&&!this._built&&this._schedule();return}let t=!this._built||e.language!==this._lang;for(let s of this._ids){let o=e.states[s];o!==this._seen[s]&&(this._seen[s]=o,t=!0)}t&&this._scheduleData()}get hass(){return this._hass}connectedCallback(){this._start(),this._cfg&&this._schedule(!0)}disconnectedCallback(){this._stop()}getCardSize(){return 10}getGridOptions(){return{columns:"full",min_columns:6}}_start(){this._timer||(this._ro=new ResizeObserver(()=>this._schedule(!0)),this._io=new IntersectionObserver(([e])=>{this._visible=e.isIntersecting,this._root?.classList.toggle("paused",!this._visible)}),this._io.observe(this),this._card&&this._ro.observe(this._card),this._timer=setInterval(()=>this._sample(),Lt),this._cfg?.demo&&(this._demoTimer=setInterval(()=>{this._demo=q(Date.now()),this._visible&&this._schedule()},Tt)))}_stop(){clearInterval(this._timer),clearInterval(this._demoTimer),clearTimeout(this._dataT),this._timer=this._demoTimer=this._dataT=0,this._ro?.disconnect(),this._io?.disconnect(),cancelAnimationFrame(this._raf),this._raf=0}_scheduleData(){if(this._dataT)return;let e=Math.max(0,(this._lastData||0)+At-Date.now());this._dataT=setTimeout(()=>{this._dataT=0,this._lastData=Date.now(),this._schedule()},e)}_schedule(e=!1){e&&(this._needLayout=!0),!this._raf&&(this._raf=requestAnimationFrame(()=>{this._raf=0,this._render()}))}_render(){let e=this._cfg;if(!e||!e.demo&&!this._hass)return;let t=this._hass?.language||navigator.language||"en";if(e.empty){if(this._emptyLang===t)return;this._emptyLang=t,this._built=!1,this._card=this._flow=null,this.shadowRoot.innerHTML=`<style>${F}</style><ha-card><div class="root"><p class="empty">${M.panel}${j(t).empty}</p></div></ha-card>`;return}(!this._built||t!==this._lang)&&this._build(t),this._update(),this._hist&&!this._histInit&&this._initHistory(),this._needLayout&&(this._needLayout=!1,this._layout())}_build(e){let t=this._cfg,s=this._t=j(e);this._lang=e,this._nf=dt(e);let o=t.solar.length>0,r=t.batteries.length>0,i=t.loads.length>0,n=!!this._hist,c=[];o&&c.push(`<div class="kpi kpi-solar" data-i="kpv"><div class="tile">${E.sun}</div>
<div class="txt"><span class="lbl ell">${s.kpiSolar}</span><span class="big num" data-k="kpv">${$}</span><span class="sub ell num" data-k="kpvs"></span></div>
${n?`<div class="side">${N("pv")}</div>`:""}</div>`),r&&c.push(`<div class="kpi kpi-bat" data-i="kbt" style="--bsc-bat-art:var(--bsc-bat)"><div class="tile">${E.battery}</div>
<div class="txt"><span class="lbl ell">${s.kpiBattery}</span><span class="big num" data-k="kbt">${$}</span><span class="sub ell num" data-k="kbtv"></span></div>
<div class="side"><div class="bar"><i data-b="kbt"></i></div><span class="st num" data-k="kbts"></span></div></div>`),i&&c.push(`<div class="kpi kpi-load" data-i="kld"><div class="tile">${E.house}</div>
<div class="txt"><span class="lbl ell">${s.kpiLoad}</span><span class="big num" data-k="kld">${$}</span><span class="sub ell num" data-k="klds"></span></div>
${n?`<div class="side">${N("ld")}</div>`:""}</div>`);let u=(g,v,I)=>`<div class="col-h"><div class="tile">${g}</div>
<div class="ell"><h3 class="ell">${S(v)}</h3><p class="ell num" data-k="${I}"></p></div></div>`,b=o?`<section class="col col-solar panel" data-c="solar">
${u(M.panel,t.titles.solar??s.solar,"pvh")}
<div class="items">${t.solar.map((g,v)=>`<div class="item" data-i="pv${v}" data-e="${S(g.power||g.voltage)}" tabindex="0" role="button">
<div class="tile">${E.panel}</div>
<div class="info"><span class="name ell">${S(g.name)}</span><span class="status"><i class="dot"></i><span data-k="pv${v}st"></span></span>
<span class="val num" data-k="pv${v}">${$}</span><span class="meta num ell" data-k="pv${v}m"></span></div>
${n?N(g.power):""}</div>`).join("")}</div></section>`:"",d=t.batteries.map((g,v)=>`<div class="mod" data-i="bt${v}" data-e="${S(g.soc||g.voltage)}" tabindex="0" role="button">
<div class="tile">${E.battery}</div>
<div class="info"><span class="name ell">${S(g.name)}</span><span class="v num" data-k="bt${v}v"></span><span class="soc num" data-k="bt${v}s">${$}</span></div>
<div class="bar"><i data-b="bt${v}"></i></div>
<div class="meta num"><span data-k="bt${v}p"></span><span data-k="bt${v}t"></span></div></div>`).join(""),p=r&&t.show_stats?`<div class="stats">
<div class="stat">${M.battery}<div class="ell"><div class="lbl ell">${s.capacity}</div><div class="sv num ell" data-k="cap"></div></div></div>
<div class="stat" data-i="schg">${M.bolt}<div class="ell"><div class="lbl ell">${s.charging}</div><div class="sv num ell" data-k="chg"></div></div></div>
<div class="stat" data-i="sdis">${M.down}<div class="ell"><div class="lbl ell">${s.discharging}</div><div class="sv num ell" data-k="dis"></div></div></div>
</div>`:"",f=`<section class="col col-bat panel" data-c="bat">
${u(M.battery,t.titles.battery??(r?s.battery:s.balance),"bth")}
${r?`<div class="mods">${d}</div>`:""}
<div class="hub" data-i="hub"><div>${E.rack}</div><div class="txt">
<span class="lbl ell">${r?s.system:s.balance}</span><span class="v num muted ell" data-k="hubv"></span>
<span class="big num" data-k="hub">${$}</span>
${r?'<div class="bar"><i data-b="hub"></i></div><span class="chip" data-i="chip"><span data-k="chipi"></span><span class="num" data-k="chip"></span></span><span class="eta num" data-k="eta"></span>':""}
</div></div>${p}</section>`,_=i&&t.show_total&&t.loads.length>1?`<div class="total">
<div class="head"><div class="tile">${M.house}</div><div class="txt"><div class="lbl ell">${s.totalConsumption}</div><div class="big num" data-k="ldt">${$}</div></div>${n?N("ld"):""}</div>
<div class="shares">${t.loads.map((g,v)=>`<div class="share"><span class="ell">${S(g.name)}</span><span class="pc num" data-k="ld${v}pc"></span>
<span class="sv num" data-k="ld${v}v"></span><span></span><div class="bar"><i data-b="ld${v}"></i></div></div>`).join("")}</div></div>`:"",y=i?`<section class="col col-load panel" data-c="load">
${u(M.house,t.titles.loads??s.loads,"ldh")}
<div class="items">${t.loads.map((g,v)=>`<div class="item" data-i="ld${v}" data-e="${S(g.power)}" tabindex="0" role="button">
<div class="tile">${X(g.icon&&S(g.icon),g.name)}</div>
<div class="info"><span class="name ell">${S(g.name)}</span><span class="val num" data-k="ld${v}">${$}</span><span class="meta num ell" data-k="ld${v}m"></span></div>
${n?N(g.power):""}</div>`).join("")}</div>${_}</section>`:"",h=1+o+i,l=Object.entries({solar:"--bsc-solar",battery:"--bsc-bat",load:"--bsc-load",accent:"--bsc-accent"}).filter(([g])=>t.colors[g]).map(([g,v])=>`${v}:${S(t.colors[g])}`).join(";");this.shadowRoot.innerHTML=`<style>${F}</style>
<ha-card class="${t.appearance==="dark"?"dark":""}" style="${l}">
<div class="root${t.animation?"":" still"}${this._visible?"":" paused"}">
${t.title?`<h2 class="title">${S(t.title)}</h2>`:""}
${t.show_kpis&&c.length?`<section class="kpis panel" style="--kn:${c.length}">${c.join("")}</section>`:""}
<div class="flow" style="--n:${h}">
<svg class="lines" aria-hidden="true">${J}<g data-g></g></svg>
<div class="dots" data-dots aria-hidden="true"></div><style data-kf></style>
${b}${f}${y}
${o?'<div class="pill pv" data-p="pv" hidden><span class="num" data-k="ppv"></span></div>':""}
${i?'<div class="pill ld" data-p="ld" hidden><span class="num" data-k="pld"></span></div>':""}
</div></div></ha-card>`;let m=g=>[...this.shadowRoot.querySelectorAll(g)],k=g=>Object.fromEntries(m(`[data-${g}]`).map(v=>[v.dataset[g],v]));this._card=this.shadowRoot.querySelector("ha-card"),this._root=this._card.firstElementChild,this._flow=this._root.querySelector(".flow"),this._g=this._root.querySelector("[data-g]"),this._dots=this._root.querySelector("[data-dots]"),this._kf=this._root.querySelector("[data-kf]"),this._k=k("k"),this._b=k("b"),this._i=k("i"),this._p=k("p"),this._c=k("c"),this._s={};for(let g of m("[data-s]"))(this._s[g.dataset.s]??=[]).push(g);this._fl={},this._chipState=null;let x=g=>{let v=g.target.closest?.("[data-e]")?.dataset.e;if(!v||this._cfg.demo)return;let I=new Event("hass-more-info",{bubbles:!0,composed:!0});I.detail={entityId:v},this.dispatchEvent(I)};this._card.addEventListener("click",x),this._card.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),x(g))}),this._ro?.disconnect(),this._ro?.observe(this._card),this._built=!0,this._needLayout=!0,this._drawSparks()}_set(e,t){let s=this._k[e];s&&s.textContent!==t&&(s.textContent=t)}_update(){let e=this._cfg,t=this._t,s=this._nf,o=this._m=ot(e,this._get),r=(p,f)=>H(p,s,f),i=(p,f)=>this._set(p,f),n=(p,f)=>{let _=this._b[p],y=`translateX(${((Math.max(0,Math.min(1,f||0))-1)*100).toFixed(1)}%)`;_&&_._tr!==y&&(_.style.transform=_._tr=y)},c=(p,f,_)=>this._i[p]?.classList.toggle(f,!!_),u=p=>`${s((p||0)*100,0)} %`,b=(p,f)=>{if(!p)return;let _=ct(f),y=((f??0)/100).toFixed(2);p.dataset.lvl!==_&&(p.dataset.lvl=_),p._lvl!==y&&p.style.setProperty("--lvl",p._lvl=y)};o.pv.forEach((p,f)=>{i(`pv${f}`,r(p.p)),i(`pv${f}st`,p.na?t.unavailable:p.on?t.producing:t.idle),i(`pv${f}m`,[p.v!=null&&T(p.v,"V",s),p.i!=null&&T(p.i,"A",s)].filter(Boolean).join(" \xB7 ")),c(`pv${f}`,"on",p.on),c(`pv${f}`,"na",p.na)}),e.solar.length&&(i("kpv",r(o.pvTotal)),i("ppv",r(o.pvTotal)),i("pvh",`${t.zones(e.solar.length)} \xB7 ${t.totalProduction} ${r(o.pvTotal)}`),this._hist||i("kpvs",t.zones(e.solar.length)),c("kpv","on",o.pvTotal>e.threshold),this._i.kpv?.querySelector(".sun")?.classList.toggle("off",!(o.pvTotal>e.threshold)));let d=o.battery;if(e.batteries.length){o.bat.forEach((h,l)=>{i(`bt${l}v`,T(h.v,"V",s)),i(`bt${l}s`,h.soc==null?$:`${s(h.soc,0)} %`),i(`bt${l}p`,h.p==null?"":r(h.p,!0)),i(`bt${l}t`,h.temp==null?"":T(h.temp,"\xB0C",s)),n(`bt${l}`,(h.soc??0)/100),b(this._i[`bt${l}`],h.soc),c(`bt${l}`,"chg",h.p>e.threshold),c(`bt${l}`,"na",h.na)});let p=d.soc==null?$:`${s(d.soc,0)} %`,f=t[{charging:"charging",discharging:"discharging",idle:"standby"}[d.state]],_=d.state==="idle"?f:`${f} \xB7 ${r(d.p,!0)}`;i("kbt",p),i("hub",p),i("kbtv",T(d.v,"V",s)),i("hubv",T(d.v,"V",s)),i("kbts",_),i("bth",`${t.modules(e.batteries.length)} \xB7 ${f}`),n("kbt",(d.soc??0)/100),n("hub",(d.soc??0)/100),b(this._i.kbt,d.soc),b(this._i.hub,d.soc),c("kbt","chg",d.state==="charging"),c("hub","on",d.state!=="idle"),i("chip",_),this._chipState!==d.state&&(this._chipState=d.state,this._i.chip.className=`chip ${d.state}`,this._k.chipi.innerHTML=d.state==="charging"?M.bolt:d.state==="discharging"?M.down:"");let y=it(d,e.min_soc);i("eta",y==null?"":`${d.p>0?t.fullIn:t.lastsFor} ${pt(y,t)}`),i("cap",d.cap==null?$:d.stored==null?`${s(d.cap,1)} kWh`:`${s(d.stored,1)} / ${s(d.cap,1)} kWh`),i("chg",r(d.p>0?d.p:0,!0)),i("dis",r(d.p<0?-d.p:0)),c("schg","chg",d.state==="charging"),c("sdis","dis",d.state==="discharging")}else i("hub",r(o.balance,!0)),i("hubv",o.balance==null?"":o.balance>=0?t.surplus:t.deficit),i("bth",`${t.totalProduction} ${r(o.pvTotal)}`),c("hub","on",o.pvTotal>e.threshold||o.loadTotal>e.threshold);e.loads.length&&(o.loads.forEach((p,f)=>{i(`ld${f}`,r(p.p)),i(`ld${f}v`,r(p.p)),i(`ld${f}pc`,u(p.share)),i(`ld${f}m`,p.na?t.unavailable:e.loads.length>1?`${u(p.share)} ${t.ofTotal}`:""),n(`ld${f}`,p.share),c(`ld${f}`,"on",p.on),c(`ld${f}`,"na",p.na)}),i("kld",r(o.loadTotal)),i("ldt",r(o.loadTotal)),i("pld",r(o.loadTotal)),i("ldh",`${t.circuits(e.loads.length)} \xB7 ${t.totalConsumption} ${r(o.loadTotal)}`),i("klds",o.loads.map((p,f)=>[e.loads[f].name,p.p]).filter(([,p])=>p>e.threshold).sort((p,f)=>f[1]-p[1]).slice(0,2).map(([p,f])=>`${p} ${r(f)}`).join(" \xB7 ")),c("kld","on",o.loadTotal>e.threshold)),this._applyFlows()}_applyFlows(){let e=this._m,t=this._cfg.threshold;if(e){for(let[s,o]of Object.entries(this._fl)){let r=s.slice(0,2),i=s.length>2?Number(s.slice(2)):-1,n,c,u=!1;r==="pv"?[c,n]=[e.pvTotal,i<0?e.pvTotal>t:e.pv[i]?.on]:r==="ld"?[c,n]=[e.loadTotal,i<0?e.loadTotal>t:e.loads[i]?.on]:[c,n,u]=[e.bat[i]?.p,e.bat[i]?.on,e.bat[i]?.p<0];let b=`${(this._len[s]/rt(c)).toFixed(2)}s`;for(let d of o)d.classList.toggle("on",!!n),d.classList.toggle("rev",u),d._d!==b&&d.style.setProperty("--dur",d._d=b)}this._p.pv?.classList.toggle("on",e.pvTotal>t),this._p.ld?.classList.toggle("on",e.loadTotal>t)}}_layout(){let e=this._card,t=this._flow,s=this._cfg;if(!t)return;let o=e.clientWidth>=s.wide_breakpoint;this._root.classList.toggle("wide",o);let r=t.getBoundingClientRect();if(!r.width)return;let i=h=>{let l=h.getBoundingClientRect();return{l:l.left-r.left,r:l.right-r.left,t:l.top-r.top,b:l.bottom-r.top,cx:(l.left+l.right)/2-r.left,cy:(l.top+l.bottom)/2-r.top}},n=i(this._i.hub),c=i(this._c.bat),u=[],b={},d=h=>s[h==="pv"?"solar":"loads"].map((l,m)=>i(this._i[h+m]));if(o){if(this._c.solar){let h=i(this._c.solar).r+16;d("pv").forEach((l,m)=>u.push([`pv${m}`,G(l.r,l.cy,n.l,n.cy,h)])),b.pv=[(h+c.l)/2,n.cy]}if(this._c.load){let h=i(this._c.load).l-16;d("ld").forEach((l,m)=>u.push([`ld${m}`,G(n.r,n.cy,l.l,l.cy,h)])),b.ld=[(c.r+h)/2,n.cy]}}else{let h=Math.round(r.width/2);if(this._c.solar){let l=i(this._c.solar);u.push(["pv",`M${h} ${l.b}V${c.t}`]),b.pv=[h,(l.b+c.t)/2]}if(this._c.load){let l=i(this._c.load);u.push(["ld",`M${h} ${c.b}V${l.t}`]),b.ld=[h,(c.b+l.t)/2]}}let p=s.batteries.map((h,l)=>i(this._i[`bt${l}`])),f=Math.max(...p.map(h=>h.b));p.forEach((h,l)=>{if(f-h.b>2||n.t-h.b<6)return;let m=Math.min(Math.max(h.cx,n.l+28),n.r-28);u.push([`bt${l}`,ht(m,n.t,h.cx,h.b,(h.b+n.t)/2,8)])}),this._g.innerHTML=u.map(([h,l])=>`<g class="f ${h.slice(0,2)}" data-f="${h}"><path class="glow" d="${l}"/><path class="base" d="${l}"/></g>`).join("");let _="",y="";this._len={};for(let[h,l]of u){let{css:m,len:k}=lt(`bsc-${h}`,nt(l)),x=Math.max(1,Math.round(k/70));_+=m,this._len[h]=k||1,y+=`<div class="fd ${h.slice(0,2)}" data-f="${h}">${Array.from({length:x},(g,v)=>`<i class="dt" style="animation-name:bsc-${h};animation-delay:calc(var(--dur) * ${(-v/x).toFixed(3)})"></i>`).join("")}</div>`}this._kf.textContent=_,this._dots.innerHTML=y,this._fl={};for(let h of[...this._g.children,...this._dots.children])(this._fl[h.dataset.f]??=[]).push(h);for(let[h,l]of Object.entries(this._p)){let m=b[h];l.hidden=!m,m&&(l.style.left=`${m[0]}px`,l.style.top=`${m[1]}px`)}this._applyFlows()}async _initHistory(){this._histInit=!0;let e=this._hist,t=[...this._pvIds,...this._ldIds];if(this._cfg.demo)for(let s of t){let o=e.get(s);o.v=bt(e.n,this._pvIds.includes(s)?"solar":"load",P(this._get(s))||600),o.v[e.n-1]=null}else try{await e.load(this._hass,t)}catch{}this._sample()}_sample(){let e=this._hist;if(!(!e||!this._cfg)){e.roll();for(let t of[...this._pvIds,...this._ldIds])e.sample(t,P(this._get(t)));this._built&&this._drawSparks()}}_drawSparks(){let e=this._hist;if(e){for(let[t,s]of Object.entries(this._s)){let o=t==="pv"?e.total(this._pvIds):t==="ld"?e.total(this._ldIds):e.series(t),r=ut(o);for(let i of s)i.getAttribute("d")!==r&&i.setAttribute("d",r)}if(this._cfg.solar.length){let t=Math.max(0,...e.total(this._pvIds).filter(s=>s!=null));this._set("kpvs",t>0?`${this._t.peak} ${this._cfg.history_hours} ${this._t.h}: ${H(t,this._nf)}`:this._t.zones(this._cfg.solar.length))}}}};customElements.get(Q)||(customElements.define(Q,Y),(window.customCards||=[]).push({type:Q,name:"Bugsa Solar Card",description:"Animated overview of a solar plant: production, storage and consumption.",preview:!0,documentationURL:"https://github.com/pkejval/bugsa-solar-card"}),console.info(`%c BUGSA-SOLAR-CARD %c ${Et} `,"color:#0b1210;background:#4ade80;font-weight:700;border-radius:3px 0 0 3px","color:#4ade80;background:#0b1210;border-radius:0 3px 3px 0"));
