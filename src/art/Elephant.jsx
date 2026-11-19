// A caparisoned ceremonial elephant (Indian temple / royal-procession style),
// drawn entirely in SVG. Facing right. Local coordinates ≈ 0..440 × -46..312.
import React, { useMemo } from 'react';

const GOLD = '#dcb558';
const GOLD_D = '#8a6118';

/* ── geometry helpers: variable-width "tubes" along bezier curves ───────────── */
function cubic(s, t) {
  const [p0, p1, p2, p3] = s;
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  const l = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / l, ny: dx / l };
}

function sample(segs, n) {
  const out = [];
  for (let i = 0; i <= n; i += 1) {
    const u = i / n;
    const f = u * segs.length;
    const k = Math.min(segs.length - 1, Math.floor(f));
    out.push({ ...cubic(segs[k], f - k), u });
  }
  return out;
}

function Tube({ segs, n = 50, r0, r1, ease = 1, palette, bands = [], bandColor = GOLD, bandWidth = 2.6 }) {
  const { pts, rings } = useMemo(() => {
    const p = sample(segs, n).map((s) => ({ ...s, r: r0 + (r1 - r0) * Math.pow(s.u, ease) }));
    const b = bands.map((u) => {
      const s = sample(segs, 400)[Math.round(u * 400)];
      const r = r0 + (r1 - r0) * Math.pow(u, ease);
      return { ...s, r };
    });
    return { pts: p, rings: b };
  }, [segs, n, r0, r1, ease, bands]);
  return (
    <g>
      {pts.map((p, i) => (
        <circle key={`e${i}`} cx={p.x} cy={p.y} r={p.r + 1.4} fill={palette.edge} />
      ))}
      {pts.map((p, i) => (
        <circle key={`b${i}`} cx={p.x} cy={p.y} r={p.r} fill={palette.base} />
      ))}
      {pts.map((p, i) => (
        <circle key={`s${i}`} cx={p.x + p.r * 0.2} cy={p.y + p.r * 0.32} r={p.r * 0.62} fill={palette.shade} opacity=".8" />
      ))}
      {pts.map((p, i) => (
        <circle key={`h${i}`} cx={p.x - p.r * 0.22} cy={p.y - p.r * 0.32} r={p.r * 0.45} fill={palette.hi} opacity=".55" />
      ))}
      {rings.map((s, i) => (
        <g key={`r${i}`}>
          <path
            d={`M${s.x + s.nx * (s.r + 0.6)} ${s.y + s.ny * (s.r + 0.6)} L${s.x - s.nx * (s.r + 0.6)} ${s.y - s.ny * (s.r + 0.6)}`}
            stroke={GOLD_D}
            strokeWidth={bandWidth + 1.2}
            strokeLinecap="round"
          />
          <path
            d={`M${s.x + s.nx * (s.r + 0.6)} ${s.y + s.ny * (s.r + 0.6)} L${s.x - s.nx * (s.r + 0.6)} ${s.y - s.ny * (s.r + 0.6)}`}
            stroke={bandColor}
            strokeWidth={bandWidth}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

const TRUNK = [
  [[349, 128], [378, 132], [393, 170], [387, 212]],
  [[387, 210], [383, 246], [366, 264], [348, 259]],
  [[348, 259], [337, 256], [333, 244], [342, 239]],
];
const TUSK = [[[340, 150], [366, 176], [394, 172], [404, 140]]];
const TAIL = [[[0, 0], [-10, 30], [-16, 62], [-14, 92]]];

const SKIN = { edge: '#241f19', base: '#5f574b', shade: '#443d33', hi: '#8c8272' };
const IVORY = { edge: '#8c7a4c', base: '#efe3bf', shade: '#cdbb88', hi: '#fffbe8' };
const TAILC = { edge: '#241f19', base: '#4e463b', shade: '#3a342b', hi: '#6c6354' };

function scallopHem(xr, xl, y, depth, count) {
  const w = (xr - xl) / count;
  let d = '';
  for (let i = 0; i < count; i += 1) {
    const x = xr - i * w;
    d += `Q${x - w / 2} ${y + depth} ${x - w} ${y}`;
  }
  return d;
}

const BODY =
  'M322 62C300 56 272 66 258 80C240 70 205 64 172 66C135 68 98 76 80 98C68 112 64 130 66 150C66 178 70 205 74 232C76 256 70 276 72 296L120 296C118 278 118 256 122 236C126 214 134 198 146 190C176 204 220 206 250 196C248 232 250 262 250 296L300 296C298 270 298 248 304 224C310 204 318 190 322 172C330 166 342 156 350 138C356 124 358 104 352 88C347 74 336 64 322 62Z';

export default function ElephantArt() {
  const hem = scallopHem(270, 88, 214, 13, 8);
  const tips = Array.from({ length: 8 }, (_, i) => 270 - (182 / 8) * (i + 1));
  return (
    <g className="ele">
      <defs>
        <linearGradient id="eSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a7165" />
          <stop offset=".55" stopColor="#5a5247" />
          <stop offset="1" stopColor="#38322a" />
        </linearGradient>
        <radialGradient id="eShine" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff2c8" stopOpacity=".34" />
          <stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="eEar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14704a" />
          <stop offset="1" stopColor="#063a25" />
        </linearGradient>
        <pattern id="ePat" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M6 1 L11 6 L6 11 L1 6Z" fill="none" stroke="#e6c05a" strokeWidth=".6" opacity=".65" />
          <circle cx="6" cy="6" r="1" fill="#e6c05a" opacity=".7" />
        </pattern>
      </defs>

      {/* ground shadow */}
      <ellipse cx="206" cy="299" rx="176" ry="9" fill="#000" opacity=".38" />

      <g className="ele-bob">
        {/* tail */}
        <g transform="translate(70 100)">
          <g className="ele-tail">
            <Tube segs={TAIL} n={22} r0={4.6} r1={2.6} palette={TAILC} />
            <path d="M-14 90 C-24 100 -22 120 -14 128 C-6 120 -4 100 -14 90Z" fill="#2c261f" stroke="#1a1612" strokeWidth=".8" />
            <path d="M-14 94 L-14 124 M-18 98 L-17 120 M-10 98 L-11 120" stroke="#4e463b" strokeWidth=".8" />
            <ellipse cx="-14" cy="90" rx="4.4" ry="3" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" />
          </g>
        </g>

        {/* far legs */}
        <path d="M112 190 L152 190 C154 230 152 262 154 296 L110 296 C112 262 110 230 112 190Z" fill="#2f2a23" />
        <path d="M262 190 L302 190 C304 232 302 262 303 296 L260 296 C262 262 260 232 262 190Z" fill="#2f2a23" />
        <path d="M110 268 Q131 276 154 268 L154 278 Q131 286 110 278Z" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" opacity=".8" />
        <path d="M260 268 Q281 276 303 268 L303 278 Q281 286 260 278Z" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" opacity=".8" />

        {/* body, head and near legs */}
        <path d={BODY} fill="url(#eSkin)" stroke="#201b15" strokeWidth="1.4" strokeLinejoin="round" />
        <ellipse cx="190" cy="108" rx="78" ry="30" fill="url(#eShine)" />
        <ellipse cx="96" cy="170" rx="30" ry="44" fill="url(#eShine)" opacity=".7" />
        <ellipse cx="318" cy="96" rx="22" ry="26" fill="url(#eShine)" opacity=".8" />
        {/* skin folds */}
        <g fill="none" stroke="#1d1914" strokeWidth="1.1" strokeLinecap="round" opacity=".45">
          <path d="M86 246 Q96 250 108 246" />
          <path d="M84 252 Q96 257 110 252" />
          <path d="M262 248 Q276 253 290 248" />
          <path d="M262 254 Q276 259 292 254" />
          <path d="M268 200 Q284 212 304 206" />
          <path d="M76 214 Q92 224 112 214" />
        </g>

        {/* caparison */}
        <g className="ele-cloth">
          <path d={`M96 100C130 78 175 76 210 80C234 83 250 92 262 104L270 214${hem}L96 100Z`} fill="url(#crimson)" stroke="url(#gold)" strokeWidth="3.2" strokeLinejoin="round" />
          <path d="M106 108C136 90 176 88 208 92C230 95 244 102 254 112L259 204L99 204Z" fill="none" stroke="#f0cf70" strokeWidth=".9" strokeDasharray="1.5 3" strokeLinecap="round" />
          <path d="M106 108C136 90 176 88 208 92C230 95 244 102 254 112L259 204L99 204Z" fill="url(#ePat)" opacity=".28" />
          {/* central lotus medallion */}
          <g transform="translate(180 152)">
            <circle r="35" fill="#4d0c1d" stroke="url(#gold)" strokeWidth="2" />
            <circle r="30" fill="none" stroke="#f0cf70" strokeWidth=".8" strokeDasharray="1 3" strokeLinecap="round" />
            {Array.from({ length: 12 }, (_, i) => (
              <use key={i} href="#petal" transform={`rotate(${i * 30}) scale(.36)`} fill="url(#gold)" stroke={GOLD_D} strokeWidth="1.2" />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <use key={i} href="#petal" transform={`rotate(${i * 30 + 15}) scale(.24)`} fill="#7a1329" stroke="#f0cf70" strokeWidth="1.4" />
            ))}
            <circle r="6.5" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".6" />
            <circle r="2.4" fill="#1a6a45" />
          </g>
          {[[122, 156], [238, 156]].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <circle r="11" fill="#4d0c1d" stroke="url(#gold)" strokeWidth="1.4" />
              {Array.from({ length: 8 }, (_, i) => (
                <use key={i} href="#petal" transform={`rotate(${i * 45}) scale(.14)`} fill="#f0cf70" />
              ))}
              <circle r="2.2" fill="url(#goldR)" />
            </g>
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d="M0 -3.4 L3 0 L0 3.4 L-3 0Z" transform={`translate(${116 + i * 13.4} 196)`} fill="url(#gold)" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={120 + i * 17} cy="106" r="1.5" fill="#f0cf70" opacity=".85" />
          ))}
          {/* tassels */}
          {tips.map((x, i) => (
            <g key={i} className="ele-tassel" style={{ transformOrigin: `${x + 11}px 214px`, animationDelay: `${i * 0.3}s` }}>
              <path d={`M${x + 11.4} 224 L${x + 11.4} 232`} stroke="url(#gold)" strokeWidth="1.6" />
              <circle cx={x + 11.4} cy="235" r="3" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".5" />
              <path d={`M${x + 8.6} 238 L${x + 14.2} 238 L${x + 15} 245 L${x + 7.8} 245Z`} fill="url(#gold)" />
            </g>
          ))}
        </g>

        {/* belly chain with bells */}
        <path d="M252 206 C222 232 150 232 112 206" fill="none" stroke="url(#gold)" strokeWidth="2.2" strokeLinecap="round" opacity=".95" />
        {[0.12, 0.3, 0.5, 0.7, 0.88].map((t, i) => {
          const x = 252 - 140 * t;
          const y = 206 + 24 * Math.sin(Math.PI * t) + 1;
          return (
            <g key={i} className="ele-bell" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.4}s` }}>
              <path d={`M${x - 4.5} ${y} A4.5 5.2 0 0 0 ${x + 4.5} ${y}Z`} fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" />
              <circle cx={x} cy={y + 6.4} r="1.5" fill="#6e4c10" />
            </g>
          );
        })}

        {/* howdah (royal seat with canopy) */}
        <g className="ele-howdah">
          <path d="M118 62 C140 70 220 70 242 62 L240 74 C214 84 146 84 120 74Z" fill="url(#crimson)" stroke="url(#gold)" strokeWidth="1.6" />
          <rect x="124" y="50" width="112" height="14" rx="3" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".8" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={134 + i * 11.5} cy="57" r="2" fill="#7a1329" />
          ))}
          <rect x="130" y="16" width="100" height="34" fill="#25110a" opacity=".55" />
          {[132, 162, 198, 228].map((x) => (
            <g key={x}>
              <rect x={x - 2.6} y="14" width="5.2" height="38" fill="url(#goldV)" stroke={GOLD_D} strokeWidth=".5" />
              <rect x={x - 4} y="40" width="8" height="3" fill="url(#gold)" />
            </g>
          ))}
          <path d="M120 17C124 -8 156 -24 180 -24C204 -24 236 -8 240 17Q231 28 220 17Q210 28 200 17Q190 28 180 17Q170 28 160 17Q150 28 140 17Q130 28 120 17Z" fill="url(#crimson)" stroke="url(#gold)" strokeWidth="2.2" strokeLinejoin="round" />
          {[-44, -22, 0, 22, 44].map((a) => (
            <path key={a} d={`M180 -24 Q${180 + a * 1.9} -2 ${180 + a * 2.15} 17`} fill="none" stroke="#f0cf70" strokeWidth=".9" opacity=".8" />
          ))}
          <path d="M122 14 Q180 4 238 14" fill="none" stroke="url(#gold)" strokeWidth="3" />
          {[140, 160, 180, 200, 220].map((x) => (
            <circle key={x} cx={x} cy="27" r="1.9" fill="#fff6d8" stroke="#c9a043" strokeWidth=".5" />
          ))}
          <path d="M174 -24 h12 l-2 6 h-8Z" fill="url(#gold)" />
          <ellipse cx="180" cy="-27" rx="6" ry="6.5" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".6" />
          <path d="M180 -33 L180 -46" stroke="url(#gold)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M180 -46 L184.6 -39.5 L180 -34 L175.4 -39.5Z" fill="url(#gold)" />
        </g>

        {/* ear */}
        <g transform="translate(286 84)">
          <g className="ele-ear">
            <path d="M0 0C-24 -6 -54 8 -62 40C-68 68 -54 96 -34 106C-18 112 -4 96 4 76C10 54 10 24 0 0Z" fill="#4a4338" stroke="#1d1914" strokeWidth="1.3" />
            <path d="M-3 5C-24 0 -50 12 -56 40C-61 64 -50 88 -34 98C-20 103 -8 90 -1 74C5 54 5 28 -3 5Z" fill="url(#eEar)" stroke="url(#gold)" strokeWidth="2.2" />
            <path d="M-6 12C-24 8 -44 18 -49 40C-53 60 -45 80 -33 89C-22 93 -12 82 -6 68C-1 52 -1 30 -6 12Z" fill="url(#ePat)" opacity=".5" />
            <g transform="translate(-28 52)">
              {Array.from({ length: 8 }, (_, i) => (
                <use key={i} href="#petal" transform={`rotate(${i * 45}) scale(.2)`} fill="url(#gold)" stroke={GOLD_D} strokeWidth="1.4" />
              ))}
              <circle r="3.4" fill="#7a1329" stroke="#f0cf70" strokeWidth=".8" />
            </g>
            {Array.from({ length: 7 }, (_, i) => (
              <circle key={i} cx={-48 + i * 8.6} cy={90 - Math.sin((i / 6) * Math.PI) * -3 - (i === 0 || i === 6 ? 6 : 0)} r="1.7" fill="url(#goldR)" />
            ))}
          </g>
        </g>

        {/* head: face cloth, crown fan, eye */}
        <g className="ele-face">
          <path d="M311 66C334 66 350 82 352 108C352 118 350 126 346 132C340 120 338 104 326 92C320 84 314 76 311 66Z" fill="url(#crimson)" stroke="url(#gold)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M318 74C332 78 342 90 345 112" fill="none" stroke="#f0cf70" strokeWidth=".9" strokeDasharray="1.2 2.6" strokeLinecap="round" />
          {[[324, 82], [333, 96], [341, 112]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3.2 - i * 0.4} fill={i === 1 ? '#18a064' : '#ffd56a'} stroke={GOLD_D} strokeWidth=".7" />
          ))}
          <g transform="translate(316 64)">
            {[-96, -78, -60, -42, -24, -6, 12].map((a) => (
              <path key={a} d="M0 0 C-3.2 -6 -2.6 -14 0 -22 C2.6 -14 3.2 -6 0 0Z" transform={`rotate(${a})`} fill="url(#gold)" stroke={GOLD_D} strokeWidth=".5" />
            ))}
            <circle r="5.2" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".6" />
            <circle r="2" fill="#a8223d" />
          </g>
          {/* eye */}
          <ellipse cx="321" cy="104" rx="7" ry="5" fill="#1b1611" />
          <ellipse cx="321.4" cy="104" rx="3.8" ry="3.8" fill="#d89a2c" />
          <circle cx="321.6" cy="104" r="2" fill="#120d08" />
          <circle cx="320" cy="102.4" r="1.3" fill="#fff" />
          <path d="M312 101 C316 94 326 93 332 99" fill="none" stroke="#120d08" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M313 112 C318 116 326 116 330 112" fill="none" stroke="#2b251d" strokeWidth="1.1" opacity=".6" strokeLinecap="round" />
          <path d="M306 122 C312 136 324 146 338 150" fill="none" stroke="#1d1914" strokeWidth="1.2" opacity=".55" strokeLinecap="round" />
          <path d="M300 96 C304 90 310 86 316 84" fill="none" stroke="#1d1914" strokeWidth="1" opacity=".4" strokeLinecap="round" />
        </g>

        {/* trunk with golden bands */}
        <g transform="translate(349 128)">
          <g className="ele-trunk">
            <g transform="translate(-349 -128)">
              <Tube segs={TRUNK} n={64} r0={21} r1={8.5} ease={0.85} palette={SKIN} bands={[0.07, 0.16, 0.26, 0.36, 0.47, 0.58]} bandWidth={2.4} />
              <path d="M349 132 C366 150 374 176 372 206" fill="none" stroke="#f0cf70" strokeWidth=".9" strokeDasharray="1 3.2" strokeLinecap="round" opacity=".8" />
            </g>
          </g>
        </g>

        {/* tusk with golden caps */}
        <Tube segs={TUSK} n={26} r0={7.4} r1={2.3} ease={1} palette={IVORY} bands={[0.06, 0.3]} bandWidth={3.2} />
        <circle cx="404" cy="140" r="2.8" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".5" />

        {/* neck garland with bells */}
        <path d="M262 100 C268 154 296 190 322 178" fill="none" stroke="url(#gold)" strokeWidth="2.6" strokeLinecap="round" />
        {[0.18, 0.34, 0.5, 0.66, 0.82].map((t, i) => {
          const u = 1 - t;
          const x = u * u * u * 262 + 3 * u * u * t * 268 + 3 * u * t * t * 296 + t * t * t * 322;
          const y = u * u * u * 100 + 3 * u * u * t * 154 + 3 * u * t * t * 190 + t * t * t * 178;
          return (
            <g key={i} className="ele-bell" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.35}s` }}>
              <path d={`M${x - 5} ${y + 1} A5 5.8 0 0 0 ${x + 5} ${y + 1}Z`} fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" />
              <circle cx={x} cy={y + 8} r="1.6" fill="#6e4c10" />
            </g>
          );
        })}
        <use href="#fl-marigold" transform="translate(264 102) scale(.5)" />
        <use href="#fl-rose" transform="translate(318 178) scale(.46)" />

        {/* anklets and toenails */}
        <path d="M71 262 Q96 273 120 262 L120 275 Q96 286 71 275Z" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".8" />
        <path d="M250 262 Q275 273 299 262 L299 275 Q275 286 250 275Z" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".8" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`a${i}`} cx={79 + i * 9.4} cy={273 + Math.sin((i / 4) * Math.PI) * 3.2} r="1.5" fill="#7a1329" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={`b${i}`} cx={258 + i * 9.4} cy={273 + Math.sin((i / 4) * Math.PI) * 3.2} r="1.5" fill="#7a1329" />
        ))}
        {[[76, 292], [91, 294], [106, 294], [118, 292]].map(([x, y]) => (
          <ellipse key={`h${x}`} cx={x} cy={y} rx="4.4" ry="3.2" fill="#e9dfc4" stroke="#8c7a4c" strokeWidth=".6" />
        ))}
        {[[254, 292], [269, 294], [284, 294], [296, 292]].map(([x, y]) => (
          <ellipse key={`f${x}`} cx={x} cy={y} rx="4.4" ry="3.2" fill="#e9dfc4" stroke="#8c7a4c" strokeWidth=".6" />
        ))}
      </g>
    </g>
  );
}
