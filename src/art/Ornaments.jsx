// Reusable ornamental SVG building blocks. Everything is drawn in code so the
// whole invitation stays crisp at any size and weighs almost nothing.
import React from 'react';

const GOLD = '#d9b252';
const GOLD_DARK = '#8a6118';
const range = (n) => Array.from({ length: n }, (_, i) => i);

/** Rectangle with concave "ticket" corners. */
export function notchPath(x, y, w, h, c) {
  const r = x + w;
  const b = y + h;
  return `M${x + c} ${y}H${r - c}A${c} ${c} 0 0 0 ${r} ${y + c}V${b - c}A${c} ${c} 0 0 0 ${r - c} ${b}H${x + c}A${c} ${c} 0 0 0 ${x} ${b - c}V${y + c}A${c} ${c} 0 0 0 ${x + c} ${y}Z`;
}

/* ───────────────────────── Page frame (viewBox 400 × 588) ───────────────────────── */
const CORNERS = {
  tl: 'translate(10 10)',
  tr: 'translate(390 10) scale(-1 1)',
  bl: 'translate(10 578) scale(1 -1)',
  br: 'translate(390 578) scale(-1 -1)',
};
/** `corners`: true (all), false (none) or an array such as ['tr', 'bl']. */
export function PageFrame({ corners = true, double = true }) {
  const list = corners === true ? ['tl', 'tr', 'bl', 'br'] : corners || [];
  return (
    <svg className="frame" viewBox="0 0 400 588" preserveAspectRatio="none" aria-hidden="true">
      <path className="draw" pathLength="1" d={notchPath(11, 11, 378, 566, 17)} fill="none" stroke={GOLD} strokeWidth="2.4" />
      {double && (
        <path className="draw d2" pathLength="1" d={notchPath(20, 20, 360, 548, 11)} fill="none" stroke={GOLD} strokeWidth=".9" />
      )}
      {double && (
        <path className="fade-in" d={notchPath(25, 25, 350, 538, 8)} fill="none" stroke={GOLD} strokeWidth=".6" strokeDasharray="1 3.4" strokeLinecap="round" opacity=".75" />
      )}
      {list.length > 0 && (
        <g className="corner-pop">
          {list.map((k) => (
            <use key={k} href="#corner-fl" transform={CORNERS[k]} />
          ))}
        </g>
      )}
      {[
        [200, 11],
        [200, 577],
      ].map(([x, y]) => (
        <path key={y} d={`M${x} ${y - 5} L${x + 7} ${y} L${x} ${y + 5} L${x - 7} ${y}Z`} fill="url(#gold)" stroke={GOLD_DARK} strokeWidth=".5" />
      ))}
    </svg>
  );
}

/* ───────────────────────── Divider (viewBox 240 × 28) ───────────────────────── */
export function Divider({ className = '', heart = false }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 28" aria-hidden="true">
      <g className="divider-line">
        <path d="M6 14 L100 12.4 L100 15.6Z" fill="url(#goldH)" />
        <path d="M234 14 L140 12.4 L140 15.6Z" fill="url(#goldH)" />
      </g>
      <g className="divider-core">
        <circle cx="106" cy="14" r="2" fill={GOLD} />
        <circle cx="134" cy="14" r="2" fill={GOLD} />
        {heart ? (
          <path d="M120 22 C108 14 111 6 116 6.4 C118.4 6.6 119.6 8.2 120 9.6 C120.4 8.2 121.6 6.6 124 6.4 C129 6 132 14 120 22Z" fill="url(#gold)" stroke={GOLD_DARK} strokeWidth=".6" />
        ) : (
          <>
            <path d="M120 3 L129 14 L120 25 L111 14Z" fill="url(#gold)" stroke={GOLD_DARK} strokeWidth=".6" />
            <path d="M120 8.5 L124.6 14 L120 19.5 L115.4 14Z" fill="#0b3d28" />
            <circle cx="120" cy="14" r="1.6" fill="#f3d680" />
          </>
        )}
        <path d="M100 14 C95 9 90 9 88 12" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" />
        <path d="M140 14 C145 9 150 9 152 12" fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Lotus (viewBox -100 -90 200 110) ───────────────────────── */
function petalPath(L, w) {
  return `M0 0C${-w} ${-L * 0.18} ${-w * 1.15} ${-L * 0.62} 0 ${-L}C${w * 1.15} ${-L * 0.62} ${w} ${-L * 0.18} 0 0Z`;
}
export function Lotus({ className = '', big = false }) {
  const layers = [
    { angles: [-78, -58, -39, -20, 0, 20, 39, 58, 78], L: 74, w: 15, fill: 'url(#lotusA)', z: 0 },
    { angles: [-64, -43, -22, 0, 22, 43, 64], L: 62, w: 14, fill: 'url(#lotusB)', z: 1 },
    { angles: [-42, -21, 0, 21, 42], L: 49, w: 12.5, fill: 'url(#lotusC)', z: 2 },
  ];
  let idx = 0;
  return (
    <svg className={`lotus ${big ? 'lotus-big' : ''} ${className}`} viewBox="-100 -90 200 108" aria-hidden="true">
      <ellipse className="lotus-glow" cx="0" cy="-28" rx="86" ry="52" fill="url(#glowGold)" />
      {/* leaves under the flower */}
      <g opacity=".95">
        <path d="M-92 4 C-70 -10 -30 -4 -6 6 C-30 14 -70 14 -92 4Z" fill="url(#leafG)" stroke={GOLD} strokeWidth=".7" />
        <path d="M92 4 C70 -10 30 -4 6 6 C30 14 70 14 92 4Z" fill="url(#leafG)" stroke={GOLD} strokeWidth=".7" />
      </g>
      {layers.map((layer) => (
        <g key={layer.z}>
          {layer.angles.map((a) => {
            idx += 1;
            return (
              <g key={a} className="lp" style={{ '--a': `${a}deg`, '--i': idx }}>
                <path d={petalPath(layer.L, layer.w)} fill={layer.fill} stroke={GOLD} strokeWidth=".9" />
                <path d={`M0 -4 L0 ${-layer.L * 0.7}`} stroke="#c0527a" strokeWidth=".6" opacity=".35" fill="none" />
              </g>
            );
          })}
        </g>
      ))}
      <circle cx="0" cy="-6" r="7" fill="url(#goldR)" stroke={GOLD_DARK} strokeWidth=".6" />
      {range(7).map((i) => (
        <circle key={i} cx={(i - 3) * 3.6} cy={-6 - Math.abs(i - 3) * -0.8} r="1.1" fill="#fff4c2" />
      ))}
    </svg>
  );
}

/* ───────────────────────── Garland / toran ───────────────────────── */
/**
 * Marigold toran. `swags` hanging curves across `w`, with mango leaves between
 * the flowers — a traditional doorway decoration. viewBox 0 0 w h.
 */
export function Toran({ w = 400, h = 110, swags = 3, sag = 22, className = '', leaves = true }) {
  const items = [];
  const per = Math.round((w / swags) / 17);
  for (let s = 0; s < swags; s += 1) {
    const x0 = (w / swags) * s;
    const x1 = (w / swags) * (s + 1);
    for (let i = 0; i <= per; i += 1) {
      const t = i / per;
      const x = x0 + (x1 - x0) * t;
      const y = 6 + Math.sin(t * Math.PI) * sag;
      const slope = Math.cos(t * Math.PI) * sag * Math.PI / (x1 - x0);
      items.push({ x, y, ang: (Math.atan(slope) * 180) / Math.PI, i, s, t });
    }
  }
  return (
    <svg className={`toran ${className}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMin meet" aria-hidden="true">
      <g className="toran-sway">
        {leaves &&
          items
            .filter((p, k) => k % 2 === 0 || p.i === per)
            .map((p) => (
              <g key={`l${p.s}-${p.i}`} transform={`translate(${p.x} ${p.y + 4}) rotate(${p.ang * 0.4})`}>
                <use href="#leaf-down" transform="scale(.82)" />
                <use href="#leaf-down" transform="rotate(26) scale(.64)" />
                <use href="#leaf-down" transform="rotate(-26) scale(.64)" />
              </g>
            ))}
        {items.map((p) => (
          <use
            key={`f${p.s}-${p.i}`}
            href={(p.i + p.s) % 2 ? '#fl-marigold-y' : '#fl-marigold'}
            transform={`translate(${p.x} ${p.y}) rotate(${(p.i * 41 + p.s * 17) % 90}) scale(.62)`}
          />
        ))}
      </g>
    </svg>
  );
}

/** Marigold garland following an arch (used around the elephant window). */
export function ArchGarland({ cx, cy, r, bottom, count = 22, scale = 0.56 }) {
  // semicircle from angle 180° to 0°, then straight sides down to `bottom`
  const pts = [];
  for (let i = 0; i <= count; i += 1) {
    const a = Math.PI + (Math.PI * i) / count;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const sides = 8;
  for (let i = 1; i <= sides; i += 1) {
    const y = cy + (i * (bottom - cy)) / sides;
    pts.unshift([cx - r, y]);
    pts.push([cx + r, y]);
  }
  return (
    <g className="arch-garland">
      {pts.map(([x, y], i) => (
        <use
          key={i}
          href={i % 3 === 1 ? '#fl-rose' : i % 2 ? '#fl-marigold-y' : '#fl-marigold'}
          transform={`translate(${x} ${y}) rotate(${(i * 37) % 90}) scale(${scale})`}
        />
      ))}
    </g>
  );
}

/* ───────────────────────── Mandala ───────────────────────── */
export function Mandala({ petals = 16, rings = true, spin = true, className = '' }) {
  const a = 360 / petals;
  return (
    <g className={`${spin ? 'mandala-spin' : ''} ${className}`}>
      {rings && (
        <>
          <circle r="96" fill="none" stroke={GOLD} strokeWidth="1.6" />
          <circle r="91" fill="none" stroke={GOLD} strokeWidth="2.2" strokeDasharray="0.1 5.2" strokeLinecap="round" />
        </>
      )}
      {range(petals).map((i) => (
        <path
          key={`o${i}`}
          d="M0 -58 C9 -66 10 -80 0 -91 C-10 -80 -9 -66 0 -58Z"
          transform={`rotate(${i * a})`}
          fill="url(#gold)"
          stroke={GOLD_DARK}
          strokeWidth=".6"
        />
      ))}
      {range(petals).map((i) => (
        <path
          key={`i${i}`}
          d="M0 -36 C7 -43 8 -53 0 -62 C-8 -53 -7 -43 0 -36Z"
          transform={`rotate(${i * a + a / 2})`}
          fill="#0b3d28"
          stroke={GOLD}
          strokeWidth=".9"
        />
      ))}
    </g>
  );
}

/* ───────────────────────── Rings (viewBox 0 0 170 100) ───────────────────────── */
export function Rings({ className = '' }) {
  return (
    <svg className={`rings ${className}`} viewBox="0 0 170 100" aria-hidden="true">
      <defs>
        <clipPath id="ring-over">
          <rect x="70" y="24" width="30" height="22" />
        </clipPath>
      </defs>
      <ellipse cx="85" cy="92" rx="52" ry="5" fill="rgba(0,0,0,.18)" />
      <g className="ring ring-a">
        <circle cx="62" cy="58" r="28" fill="none" stroke="#7d5817" strokeWidth="8" opacity=".5" transform="translate(1 2)" />
        <circle cx="62" cy="58" r="28" fill="none" stroke="url(#gold)" strokeWidth="6.5" />
        <circle cx="62" cy="58" r="28" fill="none" stroke="#fff3c2" strokeWidth="1" opacity=".7" strokeDasharray="40 140" strokeDashoffset="-18" />
      </g>
      <g className="ring ring-b">
        <circle cx="108" cy="58" r="28" fill="none" stroke="#7d5817" strokeWidth="8" opacity=".5" transform="translate(1 2)" />
        <circle cx="108" cy="58" r="28" fill="none" stroke="url(#gold)" strokeWidth="6.5" />
        <circle cx="108" cy="58" r="28" fill="none" stroke="#fff3c2" strokeWidth="1" opacity=".7" strokeDasharray="40 140" strokeDashoffset="-18" />
      </g>
      {/* weave: ring A passes over ring B at the upper crossing */}
      <g clipPath="url(#ring-over)">
        <circle cx="62" cy="58" r="28" fill="none" stroke="url(#gold)" strokeWidth="6.5" />
      </g>
      {/* a solitaire diamond on each ring */}
      {[62, 108].map((x) => (
        <g className="gem" key={x} transform={`translate(${x} 25)`}>
          <path d="M-9 0 L-5 -7 L5 -7 L9 0 L0 12Z" fill="#fffaf0" stroke="#b9c9d0" strokeWidth=".6" />
          <path d="M-9 0 L9 0 M-5 -7 L0 0 L5 -7 M-3 0 L0 12 L3 0" fill="none" stroke="#a8bcc6" strokeWidth=".5" />
          <path d="M-5 -7 L-9 0 L0 0Z" fill="#e8f4f8" opacity=".9" />
          <path d="M5 -7 L9 0 L0 0Z" fill="#dff0f6" opacity=".7" />
          <path d="M-7 -4 C-9 -8 -3 -11 0 -10 C3 -11 9 -8 7 -4" fill="none" stroke="url(#gold)" strokeWidth="1.6" />
        </g>
      ))}
      {/* sparkles over both diamonds */}
      <g className="sparkle" transform="translate(120 12)">
        <path d="M0 -8 C.8 -2 2 -.8 8 0 C2 .8 .8 2 0 8 C-.8 2 -2 .8 -8 0 C-2 -.8 -.8 -2 0 -8Z" fill="#fff8d8" />
      </g>
      <g className="sparkle s2" transform="translate(98 8)">
        <path d="M0 -5 C.5 -1.2 1.2 -.5 5 0 C1.2 .5 .5 1.2 0 5 C-.5 1.2 -1.2 .5 -5 0 C-1.2 -.5 -.5 -1.2 0 -5Z" fill="#fff8d8" />
      </g>
      <g className="sparkle" style={{ animationDelay: '0.7s' }} transform="translate(50 12)">
        <path d="M0 -8 C.8 -2 2 -.8 8 0 C2 .8 .8 2 0 8 C-.8 2 -2 .8 -8 0 C-2 -.8 -.8 -2 0 -8Z" fill="#fff8d8" />
      </g>
      <g className="sparkle s2" style={{ animationDelay: '1.8s' }} transform="translate(72 8)">
        <path d="M0 -5 C.5 -1.2 1.2 -.5 5 0 C1.2 .5 .5 1.2 0 5 C-.5 1.2 -1.2 .5 -5 0 C-1.2 -.5 -.5 -1.2 0 -5Z" fill="#fff8d8" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Small icons ───────────────────────── */
export function Heart({ size = 18, className = '' }) {
  return (
    <svg className={`heart ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.2 C3 14.4 3.6 7 8 6 C10 5.6 11.5 6.8 12 8.4 C12.5 6.8 14 5.6 16 6 C20.4 7 21 14.4 12 21.2Z" fill="url(#gold)" stroke="#7d5817" strokeWidth=".7" />
      <path d="M8.2 8.4 C7 9 6.6 10.4 7.2 11.6" fill="none" stroke="#fff6cc" strokeWidth="1" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

export function PinIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="ico">
      <path d="M12 2.2c-4.1 0-7.2 3.1-7.2 7.1 0 5.2 7.2 12.5 7.2 12.5s7.2-7.3 7.2-12.5c0-4-3.1-7.1-7.2-7.1Z" fill="currentColor" />
      <circle cx="12" cy="9.4" r="2.9" fill="#0b3d28" />
    </svg>
  );
}

export function ChevronIcon({ dir = 'right', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="ico" style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
      <path d="M9 4.5 16.5 12 9 19.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunsetIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="ico sunset">
      <path d="M6 22a10 10 0 0 1 20 0" fill="none" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 22h28M7 27h18" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5v4M6 10l2.6 2.6M26 10l-2.6 2.6M3 17h3M26 17h3" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Kalash (auspicious pot with mango leaves and coconut). viewBox 0 0 120 150 */
export function Kalash({ className = '' }) {
  return (
    <svg className={`kalash ${className}`} viewBox="0 0 120 150" aria-hidden="true">
      <ellipse cx="60" cy="146" rx="34" ry="3.4" fill="rgba(0,0,0,.18)" />
      {/* leaves */}
      <g transform="translate(60 62)">
        {[-62, -38, -16, 16, 38, 62].map((a) => (
          <use key={a} href="#leaf-up" transform={`rotate(${a}) scale(1.05)`} />
        ))}
      </g>
      {/* coconut */}
      <ellipse cx="60" cy="42" rx="16" ry="18" fill="#7a4d22" stroke={GOLD} strokeWidth="1" />
      <path d="M52 30 C57 26 63 26 68 30" fill="none" stroke="#a9733a" strokeWidth="1.2" opacity=".8" />
      <circle cx="56" cy="46" r="1.6" fill="#3a2410" />
      <circle cx="64" cy="46" r="1.6" fill="#3a2410" />
      <path d="M57 51 q3 2.5 6 0" stroke="#3a2410" fill="none" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M60 24 C60 19 62 15 66 13" stroke="#e8741b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* pot */}
      <path d="M44 64 H76 C79 70 80 74 80 76 C96 86 100 108 88 126 C82 136 72 142 60 142 C48 142 38 136 32 126 C20 108 24 86 40 76 C40 74 41 70 44 64Z" fill="url(#gold)" stroke={GOLD_DARK} strokeWidth="1" />
      <path d="M43 68 H77" stroke="#fff3c2" strokeWidth="1.4" opacity=".8" />
      <path d="M38 80 C52 90 68 90 82 80" fill="none" stroke="#7d5817" strokeWidth="1.2" opacity=".7" />
      <path d="M30 108 C46 118 74 118 90 108" fill="none" stroke="#7d5817" strokeWidth="1.2" opacity=".6" />
      <circle cx="60" cy="100" r="10" fill="none" stroke="#7d5817" strokeWidth="1.2" opacity=".7" />
      {range(8).map((i) => (
        <ellipse key={i} cx="60" cy="100" rx="2.6" ry="6" fill="none" stroke="#7d5817" strokeWidth=".8" opacity=".75" transform={`rotate(${i * 45} 60 100) translate(0 -4)`} />
      ))}
      <path d="M44 66 C36 78 34 90 38 102" fill="none" stroke="#fff6cc" strokeWidth="2" opacity=".5" strokeLinecap="round" />
      <path d="M44 64 H76 L78 72 H42Z" fill="url(#crimson)" opacity=".92" />
    </svg>
  );
}

/** Two oil lamps (diyas) with flickering flames. */
export function Diya({ className = '', ...rest }) {
  return (
    <svg className={`diya ${className}`} viewBox="0 0 60 46" aria-hidden="true" {...rest}>
      <ellipse className="diya-halo" cx="30" cy="14" rx="26" ry="18" fill="url(#glowGold)" />
      <path className="flame" d="M30 2 C37 10 36 17 30 21 C24 17 23 10 30 2Z" fill="#ffb02e" />
      <path className="flame f2" d="M30 8 C34 12 33.5 16 30 19 C26.5 16 26 12 30 8Z" fill="#fff0a0" />
      <path d="M6 24 C10 22 50 22 54 24 C54 36 44 42 30 42 C16 42 6 36 6 24Z" fill="url(#gold)" stroke={GOLD_DARK} strokeWidth=".8" />
      <path d="M10 27 C24 31 36 31 50 27" fill="none" stroke="#7d5817" strokeWidth=".9" opacity=".7" />
      <ellipse cx="30" cy="23" rx="22" ry="2.4" fill="#5d3b0e" />
    </svg>
  );
}
