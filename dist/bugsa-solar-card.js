var Y=`
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
`;var M=(i,s="")=>`<svg class="ln ${s}" viewBox="0 0 24 24" aria-hidden="true">${i}</svg>`,$={sun:M('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),panel:M('<path d="M5 4h14l2 10H3z"/><path d="M4 9h16M9.7 4 9 14M14.3 4l.7 10M12 14v5M8 20h8"/>'),battery:M('<rect x="7" y="4.5" width="10" height="16" rx="2"/><path d="M10 2.5h4M10 10h4M10 15h4"/>'),house:M('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>'),boiler:M('<rect x="6.5" y="2.5" width="11" height="19" rx="5"/><path d="M9.5 9.5c1-1 2-1 2.5 0s1.5 1 2.5 0M9.5 14c1-1 2-1 2.5 0s1.5 1 2.5 0"/>'),plug:M('<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>'),car:M('<path d="M4 16.5v-4.5l2-5h12l2 5v4.5zM4 12h16"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/>'),bolt:M('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',"fill"),down:M('<path d="M12 4v15M6 13l6 6 6-6"/>'),up:M('<path d="M12 20V5M6 11l6-6 6 6"/>')},U=`<defs>
<linearGradient id="bscPanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f86e6"/><stop offset=".55" stop-color="#1f4fa8"/><stop offset="1" stop-color="#0f2b66"/></linearGradient>
<linearGradient id="bscMetal" x1="0" x2="1"><stop offset="0" stop-color="#5d6b7a"/><stop offset=".45" stop-color="#c9d3dd"/><stop offset="1" stop-color="#4a5664"/></linearGradient>
<linearGradient id="bscRack" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3b4654"/><stop offset="1" stop-color="#1b232d"/></linearGradient>
<linearGradient id="bscSparkS" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-solar)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-solar)"/></linearGradient>
<linearGradient id="bscSparkL" x1="0" x2="1"><stop offset="0" stop-color="var(--bsc-accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--bsc-accent)"/></linearGradient>
</defs>`,ht=(()=>{let i=[[16,12],[54,9],[58,38],[8,42]],s=(a,e)=>[0,1].map(r=>(i[0][r]*(1-a)*(1-e)+i[1][r]*a*(1-e)+i[2][r]*a*e+i[3][r]*(1-a)*e).toFixed(1)),t="";for(let a=1;a<4;a++)t+=`M${s(a/4,0)}L${s(a/4,1)}`;for(let a=1;a<3;a++)t+=`M${s(0,a/3)}L${s(1,a/3)}`;return t})(),z={panel:`<svg class="art panel" viewBox="0 0 64 64" aria-hidden="true">
<path class="st" d="M33 40v14M24.5 56h17M33 46l9-6"/>
<path class="pf" d="M16 12 54 9 58 38 8 42Z"/>
<path class="pg" d="${ht}"/>
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
${[0,1,2].map(i=>`<rect class="slot" x="27" y="${18.5+i*18.6}" width="13" height="2.4" rx="1.2"/>
<rect class="slot" x="27" y="${23+i*18.6}" width="13" height="2.4" rx="1.2"/>
<circle class="led" style="animation-delay:${i*.35}s" cx="15" cy="${21.3+i*18.6}" r="2"/>
<circle class="led" style="animation-delay:${i*.35+.6}s" cx="21" cy="${21.3+i*18.6}" r="2"/>`).join("")}
</svg>`,sun:`<svg class="art sun" viewBox="0 0 48 48" aria-hidden="true">
<g class="rays"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/></g>
<circle class="core" cx="24" cy="24" r="9"/>
</svg>`};function Z(i,s){if(i?.includes(":"))return`<ha-icon icon="${i}"></ha-icon>`;let t=i||(/tuv|bojler|boiler|ohřev|ohrev|water|heater/i.test(s)?"boiler":"house");return z[t]&&t!=="battery"&&t!=="rack"?z[t]:$[t]||$.plug}var j=(i,s,t,a)=>`${i} ${i===1?s:i>=2&&i<=4?t:a}`,O=(i,s,t)=>`${i} ${i===1?s:t}`,K={cs:{kpiSolar:"Sol\xE1rn\xED v\xFDroba",kpiBattery:"Stav baterie",kpiLoad:"Spot\u0159eba",solar:"Sol\xE1rn\xED panely",battery:"Baterie / BMS",loads:"Spot\u0159eba",zones:i=>j(i,"z\xF3na","z\xF3ny","z\xF3n"),modules:i=>j(i,"bateriov\xFD modul","bateriov\xE9 moduly","bateriov\xFDch modul\u016F"),circuits:i=>j(i,"okruh","okruhy","okruh\u016F"),totalProduction:"Celkov\xE1 v\xFDroba",totalConsumption:"Celkov\xE1 spot\u0159eba",producing:"Vyr\xE1b\xED",idle:"Ne\u010Dinn\xFD",unavailable:"Nedostupn\xE9",charging:"Nab\xEDjen\xED",discharging:"Vyb\xEDjen\xED",standby:"Klid",system:"Bateriov\xFD syst\xE9m",balance:"Bilance syst\xE9mu",surplus:"P\u0159ebytek v\xFDroby",deficit:"Deficit v\xFDroby",capacity:"Kapacita",fullIn:"Pln\u011B nabito za",lastsFor:"Vydr\u017E\xED",peak:"\u0160pi\u010Dka",ofTotal:"z celkov\xE9 spot\u0159eby",h:"h",min:"min"},en:{kpiSolar:"Solar production",kpiBattery:"Battery",kpiLoad:"Consumption",solar:"Solar panels",battery:"Battery / BMS",loads:"Consumption",zones:i=>O(i,"string","strings"),modules:i=>O(i,"battery module","battery modules"),circuits:i=>O(i,"circuit","circuits"),totalProduction:"Total production",totalConsumption:"Total consumption",producing:"Producing",idle:"Idle",unavailable:"Unavailable",charging:"Charging",discharging:"Discharging",standby:"Standby",system:"Battery system",balance:"System balance",surplus:"Production surplus",deficit:"Production deficit",capacity:"Capacity",fullIn:"Full in",lastsFor:"Lasts",peak:"Peak",ofTotal:"of total",h:"h",min:"min"}};function Q(i){return K[(i||"").slice(0,2)]||K.en}var ut={W:1,kW:1e3,MW:1e6,mW:.001,V:1,mV:.001,kV:1e3,A:1,mA:.001,Wh:.001,kWh:1,MWh:1e3};function tt(i){if(!i)return null;let s=parseFloat(i.state);return Number.isFinite(s)?s:null}function A(i){let s=tt(i);return s==null?null:s*(ut[i.attributes?.unit_of_measurement]??1)}var L=i=>{let s=null;for(let t of i)t!=null&&(s=(s??0)+t);return s},J=i=>{let s=i.filter(t=>t!=null);return s.length?s.reduce((t,a)=>t+a,0)/s.length:null};function bt(i,s,t){if(i==null)return null;if(typeof i=="number")return i;let a=s(i),e=a?.attributes?.unit_of_measurement;if(e==="Ah"||e==="mAh"){let r=tt(a);return r==null||t==null?null:(e==="mAh"?r/1e3:r)*t/1e3}return A(a)}function st(i,s){let t=i.threshold,a=n=>n==null?null:typeof n=="number"?n:A(s(n)),e=(n,v)=>n!=null&&v!=null?n*v:null,r=i.solar.map(n=>{let v=a(n.voltage),C=a(n.current),k=a(n.power)??e(v,C);return{p:k,v,i:C,na:k==null,on:k!=null&&k>t}}),o=i.batteries.map(n=>{let v=a(n.voltage),C=a(n.current),k=a(n.power)??e(v,C);k!=null&&n.invert&&(k=-k);let I=a(n.soc),m=bt(n.capacity,s,v);return{p:k,v,i:C,soc:I,cap:m,temp:a(n.temperature),na:I==null&&v==null,on:k!=null&&Math.abs(k)>t}}),l=i.loads.map(n=>{let v=a(n.power);return{p:v,na:v==null,on:v!=null&&v>t}}),d=L(r.map(n=>n.p)),g=L(l.map(n=>n.p==null?null:Math.max(0,n.p)));for(let n of l)n.share=g&&n.p!=null?Math.max(0,n.p)/g:0;let f=o.filter(n=>n.soc!=null),u=f.length&&f.every(n=>n.cap),c=L(o.map(n=>n.cap)),b=f.length?u?f.reduce((n,v)=>n+v.soc*v.cap,0)/f.reduce((n,v)=>n+v.cap,0):J(f.map(n=>n.soc)):null,p=u?L(f.map(n=>n.soc/100*n.cap)):null,h=L(o.map(n=>n.p));return{pv:r,bat:o,loads:l,pvTotal:d,loadTotal:g,battery:{soc:b,v:J(o.map(n=>n.v)),p:h,cap:c,stored:p,state:h==null||Math.abs(h)<=t?"idle":h>0?"charging":"discharging"},balance:d==null&&g==null?null:(d??0)-(g??0)}}function at(i,s=0){if(i.state==="idle"||i.cap==null||i.soc==null||!i.p)return null;let a=(i.p>0?i.cap*(1-i.soc/100):i.cap*Math.max(0,i.soc-s)/100)/(Math.abs(i.p)/1e3);return Number.isFinite(a)&&a<1e3?a:null}function it(i){let s=Math.max(Math.abs(i??0),1);return Math.max(.45,Math.min(3,3.2-.7*Math.log10(s)))}function et(i){return i==null?"na":i>=50?"ok":i>=20?"mid":"low"}var X=new Map;function ot(i){return(s,t=0)=>{let a=i+t,e=X.get(a);return e||(e=new Intl.NumberFormat(i,{minimumFractionDigits:t,maximumFractionDigits:t}),X.set(a,e)),e.format(s)}}var w="\u2014";function R(i,s,t=!1){if(i==null)return w;let a=Math.abs(i),e=t&&i>.5?"+":"";return a>=1e3?e+s(i/1e3,a>=1e4?1:2)+" kW":e+s(Math.round(i)||0,0)+" W"}function E(i,s,t,a=1){return i==null?w:`${t(i,a)} ${s}`}function rt(i,s){if(i==null)return"";let t=Math.round(i*60),a=Math.floor(t/60),e=t%60;return a?`${a} ${s.h} ${e} ${s.min}`:`${e} ${s.min}`}var T=i=>Math.round(i*10)/10;function N(i,s,t,a,e,r=12){[i,s,t,a,e]=[i,s,t,a,e].map(T);let o=a-s;if(Math.abs(o)<1)return`M${i} ${s}H${t}`;let l=Math.sign(o),d=Math.sign(e-i)||1,g=Math.sign(t-e)||1,f=T(Math.min(r,Math.abs(o)/2,Math.abs(e-i),Math.abs(t-e)));return`M${i} ${s}H${e-d*f}Q${e} ${s} ${e} ${s+l*f}V${a-l*f}Q${e} ${a} ${e+g*f} ${a}H${t}`}function nt(i,s,t,a,e,r=10){[i,s,t,a,e]=[i,s,t,a,e].map(T);let o=t-i;if(Math.abs(o)<1)return`M${i} ${s}V${a}`;let l=Math.sign(o),d=Math.sign(e-s)||1,g=Math.sign(a-e)||1,f=T(Math.min(r,Math.abs(o)/2,Math.abs(e-s),Math.abs(a-e)));return`M${i} ${s}V${e-d*f}Q${i} ${e} ${i+l*f} ${e}H${t-l*f}Q${t} ${e} ${t} ${e+g*f}V${a}`}function lt(i,s=72,t=32){if(!i?.length)return"";let a=0;for(let l of i)l>a&&(a=l);let e=s/i.length,r=e*.38,o="";return i.forEach((l,d)=>{let g=Math.max(1.5,a?Math.max(0,l??0)/a*t:0);o+=`M${T(d*e+r/2)} ${T(t-g)}h${T(e-r)}V${t}h${T(r-e)}Z`}),o}var D=class{constructor(s,t){this.n=t,this.ms=s*36e5/t,this.t0=this.slot(Date.now()),this.s=new Map}slot(s){return Math.floor(s/this.ms)*this.ms}get(s){let t=this.s.get(s);return t||this.s.set(s,t={v:new Array(this.n).fill(null),sum:0,c:0}),t}roll(s=Date.now()){let t=Math.round((this.slot(s)-this.t0)/this.ms);if(t<=0)return!1;this.t0+=t*this.ms;for(let a of this.s.values())a.v=t>=this.n?new Array(this.n).fill(null):a.v.slice(t).concat(new Array(t).fill(null)),a.sum=0,a.c=0;return!0}sample(s,t){if(t==null)return;let a=this.get(s);a.sum+=t,a.c++,a.v[this.n-1]=a.sum/a.c}series(s){return this.s.get(s)?.v}total(s){let t=new Array(this.n).fill(null);for(let a of s){let e=this.series(a);e&&e.forEach((r,o)=>{r!=null&&(t[o]=(t[o]??0)+r)})}return t}seed(s,t){let a=this.t0-(this.n-1)*this.ms,e=new Map;for(let o of t||[]){if(o.mean==null)continue;let l=typeof o.start=="number"?o.start:Date.parse(o.start),d=Math.floor((l-a)/this.ms);if(d<0||d>=this.n-1)continue;let g=e.get(d)||[0,0];g[0]+=o.mean,g[1]++,e.set(d,g)}let r=this.get(s);for(let[o,[l,d]]of e)r.v[o]==null&&(r.v[o]=l/d)}async load(s,t){if(!t.length||!s?.callWS)return;let a=await s.callWS({type:"recorder/statistics_during_period",start_time:new Date(this.t0-(this.n-1)*this.ms).toISOString(),statistic_ids:t,period:this.ms>=36e5?"hour":"5minute",types:["mean"],units:{power:"W"}});for(let e of t)this.seed(e,a?.[e])}};var _="demo.",B=i=>({power:`${_}${i}_power`,voltage:`${_}${i}_voltage`,current:`${_}${i}_current`}),ct={solar:[{name:"Z\xF3na 1",...B("pv1")},{name:"Z\xF3na 2",...B("pv2")},{name:"Z\xF3na 3",...B("pv3")}],batteries:[{name:"Baterie A",soc:`${_}bat1_soc`,temperature:`${_}bat1_temp`,capacity:5.12,...B("bat1")},{name:"Baterie B",soc:`${_}bat2_soc`,temperature:`${_}bat2_temp`,capacity:5.12,...B("bat2")}],loads:[{name:"D\u016Fm",power:`${_}house_power`,icon:"house"},{name:"Oh\u0159ev TUV",power:`${_}boiler_power`,icon:"boiler"}]},S=(i,s,t=1)=>({state:i.toFixed(t),attributes:{unit_of_measurement:s}});function W(i){let s=i/1e3,t=.86+.1*Math.sin(s/23),a={},e=0;[[820,112],[540,109],[310,105]].forEach(([d,g],f)=>{let u=d*t*(1+.06*Math.sin(s/5+f*2)),c=g+1.5*Math.sin(s/11+f);e+=u,a[`${_}pv${f+1}_power`]=S(u,"W",0),a[`${_}pv${f+1}_voltage`]=S(c,"V"),a[`${_}pv${f+1}_current`]=S(u/c,"A",2)});let r=1150+260*Math.sin(s/9)+90*Math.sin(s/2.3),o=Math.sin(s/30)>.35?1950+40*Math.sin(s):0;a[`${_}house_power`]=S(r,"W",0),a[`${_}boiler_power`]=S(o,"W",0);let l=e-r-o;return[[.55,78,51.8,24.5],[.45,81,51.6,23.1]].forEach(([d,g,f,u],c)=>{let b=l*d,p=f+b/4e3,h=`${_}bat${c+1}`;a[`${h}_power`]=S(b,"W",0),a[`${h}_voltage`]=S(p,"V",2),a[`${h}_current`]=S(b/p,"A",1),a[`${h}_soc`]=S(g+3*Math.sin(s/60),"%",0),a[`${h}_temp`]=S(u+Math.sin(s/40),"\xB0C")}),a}function dt(i,s,t){return Array.from({length:i},(a,e)=>{let r=(e+1)/i,o=s==="solar"?Math.sin(r*Math.PI*.55):.55+.35*Math.abs(Math.sin(e*1.7));return t*o*(.9+.2*Math.abs(Math.sin(e*2.3)))})}function G(i,s,t,a,e){if(i==null)return[];if(!Array.isArray(i))throw new Error(`"${s}" must be a list`);return i.map((r,o)=>{let l=typeof r=="string"?{[t]:r}:{...r};if(!a(l))throw new Error(`${s}[${o}]: ${e}`);return l})}var P=(i,s)=>i!==null&&i!==""&&Number.isFinite(Number(i))?Number(i):s;function pt(i){if(!i||typeof i!="object")throw new Error("Invalid configuration");let s=!!i.demo,t=s&&!i.solar&&!i.batteries&&!i.loads?{...i,...ct}:i,a=G(t.solar,"solar","power",o=>o.power||o.voltage&&o.current,'set "power" or "voltage" + "current"'),e=G(t.batteries,"batteries","soc",o=>o.soc||o.voltage,'set "soc" or "voltage"'),r=G(t.loads,"loads","power",o=>o.power,'set "power"');if(!a.length&&!e.length&&!r.length)throw new Error('Configure at least one of "solar", "batteries", "loads" (or set "demo: true")');return{demo:s,title:t.title??"",appearance:t.appearance==="dark"?"dark":"auto",threshold:P(t.threshold,10),min_soc:P(t.min_soc,0),history_hours:P(t.history_hours,12),history_bars:Math.round(Math.min(60,Math.max(6,P(t.history_bars,24)))),wide_breakpoint:P(t.wide_breakpoint,1e3),animation:t.animation!==!1,show_kpis:t.show_kpis!==!1,show_stats:t.show_stats!==!1,show_total:t.show_total!==!1,colors:t.colors||{},titles:t.titles||{},solar:a.map((o,l)=>({name:`PV ${l+1}`,...o})),batteries:e.map((o,l)=>({name:`BMS ${l+1}`,...o})),loads:r.map((o,l)=>({name:`${l+1}`,...o}))}}var ft="1.0.0",H="bugsa-solar-card",mt=1e4,gt=2e3,vt=["power","voltage","current","soc","temperature","capacity"],y=i=>String(i??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]),F=i=>i?`<svg class="spark" viewBox="0 0 72 32" preserveAspectRatio="none" aria-hidden="true"><path data-s="${y(i)}"/></svg>`:"",q=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._seen={},this._visible=!0,this._get=s=>this._cfg?.demo?this._demo?.[s]:this._hass?.states[s]}static getStubConfig(){return{demo:!0}}setConfig(s){let t=pt(s);this._cfg=t;let a=[...t.solar,...t.batteries,...t.loads];this._ids=[...new Set(a.flatMap(e=>vt.map(r=>e[r]).filter(r=>typeof r=="string")))],this._pvIds=t.solar.map(e=>e.power).filter(Boolean),this._ldIds=t.loads.map(e=>e.power).filter(Boolean),this._seen={},this._built=!1,this._hist=t.history_hours>0?new D(t.history_hours,t.history_bars):null,this._histInit=!1,t.demo&&(this._demo=W(Date.now())),this.isConnected&&(this._stop(),this._start()),this._schedule()}set hass(s){if(this._hass=s,!this._ids||this._cfg.demo){this._cfg?.demo&&!this._built&&this._schedule();return}let t=!this._built||s.language!==this._lang;for(let a of this._ids){let e=s.states[a];e!==this._seen[a]&&(this._seen[a]=e,t=!0)}t&&this._schedule()}get hass(){return this._hass}connectedCallback(){this._start(),this._cfg&&this._schedule(!0)}disconnectedCallback(){this._stop()}getCardSize(){return 10}getGridOptions(){return{columns:"full",min_columns:6}}_start(){this._timer||(this._ro=new ResizeObserver(()=>this._schedule(!0)),this._io=new IntersectionObserver(([s])=>{this._visible=s.isIntersecting,this._root?.classList.toggle("paused",!this._visible)}),this._io.observe(this),this._card&&this._ro.observe(this._card),this._timer=setInterval(()=>this._sample(),mt),this._cfg?.demo&&(this._demoTimer=setInterval(()=>{this._demo=W(Date.now()),this._visible&&this._schedule()},gt)))}_stop(){clearInterval(this._timer),clearInterval(this._demoTimer),this._timer=this._demoTimer=0,this._ro?.disconnect(),this._io?.disconnect(),cancelAnimationFrame(this._raf),this._raf=0}_schedule(s=!1){s&&(this._needLayout=!0),!this._raf&&(this._raf=requestAnimationFrame(()=>{this._raf=0,this._render()}))}_render(){let s=this._cfg;if(!s||!s.demo&&!this._hass)return;let t=this._hass?.language||navigator.language||"en";(!this._built||t!==this._lang)&&this._build(t),this._update(),this._hist&&!this._histInit&&this._initHistory(),this._needLayout&&(this._needLayout=!1,this._layout())}_build(s){let t=this._cfg,a=this._t=Q(s);this._lang=s,this._nf=ot(s);let e=t.solar.length>0,r=t.batteries.length>0,o=t.loads.length>0,l=!!this._hist,d=[];e&&d.push(`<div class="kpi kpi-solar" data-i="kpv"><div class="tile">${z.sun}</div>
<div class="txt"><span class="lbl ell">${a.kpiSolar}</span><span class="big num" data-k="kpv">${w}</span><span class="sub ell num" data-k="kpvs"></span></div>
${l?`<div class="side">${F("pv")}</div>`:""}</div>`),r&&d.push(`<div class="kpi kpi-bat" data-i="kbt" style="--bsc-bat-art:var(--bsc-bat)"><div class="tile">${z.battery}</div>
<div class="txt"><span class="lbl ell">${a.kpiBattery}</span><span class="big num" data-k="kbt">${w}</span><span class="sub ell num" data-k="kbtv"></span></div>
<div class="side"><div class="bar"><i data-b="kbt"></i></div><span class="st num" data-k="kbts"></span></div></div>`),o&&d.push(`<div class="kpi kpi-load" data-i="kld"><div class="tile">${z.house}</div>
<div class="txt"><span class="lbl ell">${a.kpiLoad}</span><span class="big num" data-k="kld">${w}</span><span class="sub ell num" data-k="klds"></span></div>
${l?`<div class="side">${F("ld")}</div>`:""}</div>`);let g=(m,x,V)=>`<div class="col-h"><div class="tile">${m}</div>
<div class="ell"><h3 class="ell">${y(x)}</h3><p class="ell num" data-k="${V}"></p></div></div>`,f=e?`<section class="col col-solar panel" data-c="solar">
${g($.panel,t.titles.solar??a.solar,"pvh")}
<div class="items">${t.solar.map((m,x)=>`<div class="item" data-i="pv${x}" data-e="${y(m.power||m.voltage)}" tabindex="0" role="button">
<div class="tile">${z.panel}</div>
<div class="info"><span class="name ell">${y(m.name)}</span><span class="status"><i class="dot"></i><span data-k="pv${x}st"></span></span>
<span class="val num" data-k="pv${x}">${w}</span><span class="meta num ell" data-k="pv${x}m"></span></div>
${l?F(m.power):""}</div>`).join("")}</div></section>`:"",u=t.batteries.map((m,x)=>`<div class="mod" data-i="bt${x}" data-e="${y(m.soc||m.voltage)}" tabindex="0" role="button">
<div class="tile">${z.battery}</div>
<div class="info"><span class="name ell">${y(m.name)}</span><span class="v num" data-k="bt${x}v"></span><span class="soc num" data-k="bt${x}s">${w}</span></div>
<div class="bar"><i data-b="bt${x}"></i></div>
<div class="meta num"><span data-k="bt${x}p"></span><span data-k="bt${x}t"></span></div></div>`).join(""),c=r&&t.show_stats?`<div class="stats">
<div class="stat">${$.battery}<div class="ell"><div class="lbl ell">${a.capacity}</div><div class="sv num ell" data-k="cap"></div></div></div>
<div class="stat" data-i="schg">${$.bolt}<div class="ell"><div class="lbl ell">${a.charging}</div><div class="sv num ell" data-k="chg"></div></div></div>
<div class="stat" data-i="sdis">${$.down}<div class="ell"><div class="lbl ell">${a.discharging}</div><div class="sv num ell" data-k="dis"></div></div></div>
</div>`:"",b=`<section class="col col-bat panel" data-c="bat">
${g($.battery,t.titles.battery??(r?a.battery:a.balance),"bth")}
${r?`<div class="mods">${u}</div>`:""}
<div class="hub" data-i="hub"><div>${z.rack}</div><div class="txt">
<span class="lbl ell">${r?a.system:a.balance}</span><span class="v num muted ell" data-k="hubv"></span>
<span class="big num" data-k="hub">${w}</span>
${r?'<div class="bar"><i data-b="hub"></i></div><span class="chip" data-i="chip"><span data-k="chipi"></span><span class="num" data-k="chip"></span></span><span class="eta num" data-k="eta"></span>':""}
</div></div>${c}</section>`,p=o&&t.show_total&&t.loads.length>1?`<div class="total">
<div class="head"><div class="tile">${$.house}</div><div class="txt"><div class="lbl ell">${a.totalConsumption}</div><div class="big num" data-k="ldt">${w}</div></div>${l?F("ld"):""}</div>
<div class="shares">${t.loads.map((m,x)=>`<div class="share"><span class="ell">${y(m.name)}</span><span class="pc num" data-k="ld${x}pc"></span>
<span class="sv num" data-k="ld${x}v"></span><span></span><div class="bar"><i data-b="ld${x}"></i></div></div>`).join("")}</div></div>`:"",h=o?`<section class="col col-load panel" data-c="load">
${g($.house,t.titles.loads??a.loads,"ldh")}
<div class="items">${t.loads.map((m,x)=>`<div class="item" data-i="ld${x}" data-e="${y(m.power)}" tabindex="0" role="button">
<div class="tile">${Z(m.icon&&y(m.icon),m.name)}</div>
<div class="info"><span class="name ell">${y(m.name)}</span><span class="val num" data-k="ld${x}">${w}</span><span class="meta num ell" data-k="ld${x}m"></span></div>
${l?F(m.power):""}</div>`).join("")}</div>${p}</section>`:"",n=1+e+o,v=Object.entries({solar:"--bsc-solar",battery:"--bsc-bat",load:"--bsc-load",accent:"--bsc-accent"}).filter(([m])=>t.colors[m]).map(([m,x])=>`${x}:${y(t.colors[m])}`).join(";");this.shadowRoot.innerHTML=`<style>${Y}</style>
<ha-card class="${t.appearance==="dark"?"dark":""}" style="${v}">
<div class="root${t.animation?"":" still"}${this._visible?"":" paused"}">
${t.title?`<h2 class="title">${y(t.title)}</h2>`:""}
${t.show_kpis&&d.length?`<section class="kpis panel" style="--kn:${d.length}">${d.join("")}</section>`:""}
<div class="flow" style="--n:${n}">
<svg class="lines" aria-hidden="true">${U}<g data-g></g></svg>
${f}${b}${h}
${e?'<div class="pill pv" data-p="pv" hidden><span class="num" data-k="ppv"></span></div>':""}
${o?'<div class="pill ld" data-p="ld" hidden><span class="num" data-k="pld"></span></div>':""}
</div></div></ha-card>`;let C=m=>[...this.shadowRoot.querySelectorAll(m)],k=m=>Object.fromEntries(C(`[data-${m}]`).map(x=>[x.dataset[m],x]));this._card=this.shadowRoot.querySelector("ha-card"),this._root=this._card.firstElementChild,this._flow=this._root.querySelector(".flow"),this._g=this._root.querySelector("[data-g]"),this._k=k("k"),this._b=k("b"),this._i=k("i"),this._p=k("p"),this._c=k("c"),this._s={};for(let m of C("[data-s]"))(this._s[m.dataset.s]??=[]).push(m);this._fl={},this._chipState=null;let I=m=>{let x=m.target.closest?.("[data-e]")?.dataset.e;if(!x||this._cfg.demo)return;let V=new Event("hass-more-info",{bubbles:!0,composed:!0});V.detail={entityId:x},this.dispatchEvent(V)};this._card.addEventListener("click",I),this._card.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),I(m))}),this._ro?.disconnect(),this._ro?.observe(this._card),this._built=!0,this._needLayout=!0,this._drawSparks()}_set(s,t){let a=this._k[s];a&&a.textContent!==t&&(a.textContent=t)}_update(){let s=this._cfg,t=this._t,a=this._nf,e=this._m=st(s,this._get),r=(c,b)=>R(c,a,b),o=(c,b)=>this._set(c,b),l=(c,b)=>{let p=this._b[c];p&&(p.style.width=`${Math.max(0,Math.min(1,b||0))*100}%`)},d=(c,b,p)=>this._i[c]?.classList.toggle(b,!!p),g=c=>`${a((c||0)*100,0)} %`,f=(c,b)=>{c&&(c.dataset.lvl=et(b),c.style.setProperty("--lvl",((b??0)/100).toFixed(3)))};e.pv.forEach((c,b)=>{o(`pv${b}`,r(c.p)),o(`pv${b}st`,c.na?t.unavailable:c.on?t.producing:t.idle),o(`pv${b}m`,[c.v!=null&&E(c.v,"V",a),c.i!=null&&E(c.i,"A",a)].filter(Boolean).join(" \xB7 ")),d(`pv${b}`,"on",c.on),d(`pv${b}`,"na",c.na)}),s.solar.length&&(o("kpv",r(e.pvTotal)),o("ppv",r(e.pvTotal)),o("pvh",`${t.zones(s.solar.length)} \xB7 ${t.totalProduction} ${r(e.pvTotal)}`),this._hist||o("kpvs",t.zones(s.solar.length)),d("kpv","on",e.pvTotal>s.threshold),this._i.kpv?.querySelector(".sun")?.classList.toggle("off",!(e.pvTotal>s.threshold)));let u=e.battery;if(s.batteries.length){e.bat.forEach((n,v)=>{o(`bt${v}v`,E(n.v,"V",a)),o(`bt${v}s`,n.soc==null?w:`${a(n.soc,0)} %`),o(`bt${v}p`,n.p==null?"":r(n.p,!0)),o(`bt${v}t`,n.temp==null?"":E(n.temp,"\xB0C",a)),l(`bt${v}`,(n.soc??0)/100),f(this._i[`bt${v}`],n.soc),d(`bt${v}`,"chg",n.p>s.threshold),d(`bt${v}`,"na",n.na)});let c=u.soc==null?w:`${a(u.soc,0)} %`,b=t[{charging:"charging",discharging:"discharging",idle:"standby"}[u.state]],p=u.state==="idle"?b:`${b} \xB7 ${r(u.p,!0)}`;o("kbt",c),o("hub",c),o("kbtv",E(u.v,"V",a)),o("hubv",E(u.v,"V",a)),o("kbts",p),o("bth",`${t.modules(s.batteries.length)} \xB7 ${b}`),l("kbt",(u.soc??0)/100),l("hub",(u.soc??0)/100),f(this._i.kbt,u.soc),f(this._i.hub,u.soc),d("kbt","chg",u.state==="charging"),d("hub","on",u.state!=="idle"),o("chip",p),this._chipState!==u.state&&(this._chipState=u.state,this._i.chip.className=`chip ${u.state}`,this._k.chipi.innerHTML=u.state==="charging"?$.bolt:u.state==="discharging"?$.down:"");let h=at(u,s.min_soc);o("eta",h==null?"":`${u.p>0?t.fullIn:t.lastsFor} ${rt(h,t)}`),o("cap",u.cap==null?w:u.stored==null?`${a(u.cap,1)} kWh`:`${a(u.stored,1)} / ${a(u.cap,1)} kWh`),o("chg",r(u.p>0?u.p:0,!0)),o("dis",r(u.p<0?-u.p:0)),d("schg","chg",u.state==="charging"),d("sdis","dis",u.state==="discharging")}else o("hub",r(e.balance,!0)),o("hubv",e.balance==null?"":e.balance>=0?t.surplus:t.deficit),o("bth",`${t.totalProduction} ${r(e.pvTotal)}`),d("hub","on",e.pvTotal>s.threshold||e.loadTotal>s.threshold);s.loads.length&&(e.loads.forEach((c,b)=>{o(`ld${b}`,r(c.p)),o(`ld${b}v`,r(c.p)),o(`ld${b}pc`,g(c.share)),o(`ld${b}m`,c.na?t.unavailable:s.loads.length>1?`${g(c.share)} ${t.ofTotal}`:""),l(`ld${b}`,c.share),d(`ld${b}`,"on",c.on),d(`ld${b}`,"na",c.na)}),o("kld",r(e.loadTotal)),o("ldt",r(e.loadTotal)),o("pld",r(e.loadTotal)),o("ldh",`${t.circuits(s.loads.length)} \xB7 ${t.totalConsumption} ${r(e.loadTotal)}`),o("klds",e.loads.map((c,b)=>[s.loads[b].name,c.p]).filter(([,c])=>c>s.threshold).sort((c,b)=>b[1]-c[1]).slice(0,2).map(([c,b])=>`${c} ${r(b)}`).join(" \xB7 ")),d("kld","on",e.loadTotal>s.threshold)),this._applyFlows()}_applyFlows(){let s=this._m,t=this._cfg.threshold;if(s){for(let[a,e]of Object.entries(this._fl)){let r=a.slice(0,2),o=a.length>2?Number(a.slice(2)):-1,l,d,g=!1;r==="pv"?[d,l]=[s.pvTotal,o<0?s.pvTotal>t:s.pv[o]?.on]:r==="ld"?[d,l]=[s.loadTotal,o<0?s.loadTotal>t:s.loads[o]?.on]:[d,l,g]=[s.bat[o]?.p,s.bat[o]?.on,s.bat[o]?.p<0],e.classList.toggle("on",!!l),e.classList.toggle("rev",g);let f=`${(Math.round(it(d)*4)/4).toFixed(2)}s`;e._d!==f&&e.style.setProperty("--d",e._d=f)}this._p.pv?.classList.toggle("on",s.pvTotal>t),this._p.ld?.classList.toggle("on",s.loadTotal>t)}}_layout(){let s=this._card,t=this._flow,a=this._cfg;if(!t)return;let e=s.clientWidth>=a.wide_breakpoint;this._root.classList.toggle("wide",e);let r=t.getBoundingClientRect();if(!r.width)return;let o=p=>{let h=p.getBoundingClientRect();return{l:h.left-r.left,r:h.right-r.left,t:h.top-r.top,b:h.bottom-r.top,cx:(h.left+h.right)/2-r.left,cy:(h.top+h.bottom)/2-r.top}},l=o(this._i.hub),d=o(this._c.bat),g=[],f={},u=p=>a[p==="pv"?"solar":"loads"].map((h,n)=>o(this._i[p+n]));if(e){if(this._c.solar){let p=o(this._c.solar).r+16;u("pv").forEach((h,n)=>g.push([`pv${n}`,N(h.r,h.cy,l.l,l.cy,p)])),f.pv=[(p+d.l)/2,l.cy]}if(this._c.load){let p=o(this._c.load).l-16;u("ld").forEach((h,n)=>g.push([`ld${n}`,N(l.r,l.cy,h.l,h.cy,p)])),f.ld=[(d.r+p)/2,l.cy]}}else{let p=Math.round(r.width/2);if(this._c.solar){let h=o(this._c.solar);g.push(["pv",`M${p} ${h.b}V${d.t}`]),f.pv=[p,(h.b+d.t)/2]}if(this._c.load){let h=o(this._c.load);g.push(["ld",`M${p} ${d.b}V${h.t}`]),f.ld=[p,(d.b+h.t)/2]}}let c=a.batteries.map((p,h)=>o(this._i[`bt${h}`])),b=Math.max(...c.map(p=>p.b));c.forEach((p,h)=>{if(b-p.b>2||l.t-p.b<6)return;let n=Math.min(Math.max(p.cx,l.l+28),l.r-28);g.push([`bt${h}`,nt(n,l.t,p.cx,p.b,(p.b+l.t)/2,8)])}),this._g.innerHTML=g.map(([p,h])=>`<g class="f ${p.slice(0,2)}" data-f="${p}"><path class="glow" d="${h}"/><path class="base" d="${h}"/><path class="dash" d="${h}"/></g>`).join(""),this._fl={};for(let p of this._g.children)this._fl[p.dataset.f]=p,p.dataset.f.startsWith("pv")&&p.style.setProperty("--o",`${-(p.lastChild.getTotalLength()%24).toFixed(2)}px`);for(let[p,h]of Object.entries(this._p)){let n=f[p];h.hidden=!n,n&&(h.style.left=`${n[0]}px`,h.style.top=`${n[1]}px`)}this._applyFlows()}async _initHistory(){this._histInit=!0;let s=this._hist,t=[...this._pvIds,...this._ldIds];if(this._cfg.demo)for(let a of t){let e=s.get(a);e.v=dt(s.n,this._pvIds.includes(a)?"solar":"load",A(this._get(a))||600),e.v[s.n-1]=null}else try{await s.load(this._hass,t)}catch{}this._sample()}_sample(){let s=this._hist;if(!(!s||!this._cfg)){s.roll();for(let t of[...this._pvIds,...this._ldIds])s.sample(t,A(this._get(t)));this._built&&this._drawSparks()}}_drawSparks(){let s=this._hist;if(s){for(let[t,a]of Object.entries(this._s)){let e=t==="pv"?s.total(this._pvIds):t==="ld"?s.total(this._ldIds):s.series(t),r=lt(e);for(let o of a)o.getAttribute("d")!==r&&o.setAttribute("d",r)}if(this._cfg.solar.length){let t=Math.max(0,...s.total(this._pvIds).filter(a=>a!=null));this._set("kpvs",t>0?`${this._t.peak} ${this._cfg.history_hours} ${this._t.h}: ${R(t,this._nf)}`:this._t.zones(this._cfg.solar.length))}}}};customElements.get(H)||(customElements.define(H,q),(window.customCards||=[]).push({type:H,name:"Bugsa Solar Card",description:"Animated overview of a solar plant: production, storage and consumption.",preview:!0,documentationURL:"https://github.com/pkejval/bugsa-solar-card"}),console.info(`%c BUGSA-SOLAR-CARD %c ${ft} `,"color:#0b1210;background:#4ade80;font-weight:700;border-radius:3px 0 0 3px","color:#4ade80;background:#0b1210;border-radius:0 3px 3px 0"));
