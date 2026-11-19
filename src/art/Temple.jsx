// Stepped (Hemadpanthi-style) temple front with a shikhara, kalash, saffron
// flag, glowing sanctum doorway and oil lamps. viewBox -150 0 300 214.
import React from 'react';

const GOLD = '#dcb558';
const GOLD_D = '#8a6118';

function Tower({ cx, baseY, tiers, w0, th, shrink }) {
  const out = [];
  for (let i = 0; i < tiers; i += 1) {
    const wb = w0 - i * shrink;
    const wt = wb - shrink * 0.45;
    const yb = baseY - i * th;
    const yt = yb - th;
    out.push(
      <g key={i}>
        <path d={`M${cx - wb} ${yb}H${cx + wb}L${cx + wt} ${yt}H${cx - wt}Z`} fill="url(#templeStone)" stroke={GOLD} strokeWidth=".9" strokeLinejoin="round" />
        <path d={`M${cx - wb - 2.4} ${yb + 1.2}H${cx + wb + 2.4}`} stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
        {i < tiers - 2 && wb > 16 && (
          <>
            <path d={`M${cx - wb * 0.5} ${yb - 0.8}v-${th * 0.5}a${wb * 0.1} ${wb * 0.1} 0 0 1 ${wb * 0.2} 0v${th * 0.5}`} fill="#06241a" stroke={GOLD} strokeWidth=".5" opacity=".9" />
            <path d={`M${cx + wb * 0.3} ${yb - 0.8}v-${th * 0.5}a${wb * 0.1} ${wb * 0.1} 0 0 1 ${wb * 0.2} 0v${th * 0.5}`} fill="#06241a" stroke={GOLD} strokeWidth=".5" opacity=".9" />
          </>
        )}
      </g>,
    );
  }
  return <g>{out}</g>;
}

export default function Temple({ className = '' }) {
  return (
    <svg className={`temple ${className}`} viewBox="-150 0 300 214" role="img" aria-label="मंदिराचे चित्र">
      <defs>
        <linearGradient id="templeStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a6a45" />
          <stop offset="1" stopColor="#0a3a26" />
        </linearGradient>
        <radialGradient id="doorLight" cx=".5" cy=".75" r=".8">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset=".5" stopColor="#f0a838" />
          <stop offset="1" stopColor="#a8501a" />
        </radialGradient>
      </defs>

      {/* rays from the kalash */}
      <g className="temple-rays" transform="translate(0 22)">
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d="M0 0 L-3 -80 L3 -80Z" transform={`rotate(${-72 + i * 12})`} fill="url(#glowGold)" opacity=".55" />
        ))}
      </g>
      <circle cx="0" cy="24" r="48" fill="url(#glowGold)" opacity=".7" />

      {/* steps */}
      <rect x="-134" y="196" width="268" height="12" rx="1.5" fill="url(#templeStone)" stroke={GOLD} strokeWidth=".9" />
      <rect x="-124" y="186" width="248" height="10" rx="1.5" fill="url(#templeStone)" stroke={GOLD} strokeWidth=".9" />
      <rect x="-114" y="176" width="228" height="10" rx="1.5" fill="url(#templeStone)" stroke={GOLD} strokeWidth=".9" />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d="M0 -2.4 L2.4 0 L0 2.4 L-2.4 0Z" transform={`translate(${-126 + i * 11} 202)`} fill={GOLD} opacity=".7" />
      ))}

      {/* side turrets (mirrored) */}
      {[1, -1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <rect x="68" y="136" width="44" height="40" fill="url(#templeStone)" stroke={GOLD} strokeWidth=".9" />
          <path d="M80 176 V150 a8 8 0 0 1 16 0 V176" fill="url(#doorLight)" stroke={GOLD} strokeWidth=".8" />
          <Tower cx={90} baseY={136} tiers={6} w0={22} th={9} shrink={3} />
          <path d="M90 82 v-10" stroke="url(#gold)" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="90" cy="70" rx="3" ry="4" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".5" />
        </g>
      ))}

      {/* sanctum */}
      <rect x="-62" y="120" width="124" height="56" fill="url(#templeStone)" stroke={GOLD} strokeWidth="1.1" />
      {[-62, 62].map((x) => (
        <rect key={x} x={x - 4} y="120" width="8" height="56" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" />
      ))}
      {[-36, 36].map((x) => (
        <g key={x}>
          <rect x={x - 3.6} y="128" width="7.2" height="48" fill="url(#goldV)" stroke={GOLD_D} strokeWidth=".5" />
          <rect x={x - 6} y="124" width="12" height="5" fill="url(#gold)" />
        </g>
      ))}
      <path className="door-glow" d="M-19 176 V146 C-19 132 -9 128 0 120 C9 128 19 132 19 146 V176Z" fill="url(#doorLight)" stroke="url(#gold)" strokeWidth="1.6" />
      <path d="M0 126 V176 M-9 140 V176 M9 140 V176" stroke="#7a3b10" strokeWidth=".6" opacity=".45" />
      <g className="temple-bell" style={{ transformOrigin: '0px 134px' }}>
        <path d="M0 134 V139" stroke="url(#gold)" strokeWidth="1.2" />
        <path d="M-4.4 146 C-4.4 140 4.4 140 4.4 146Z" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".5" />
        <circle cx="0" cy="147.4" r="1.2" fill="#6e4c10" />
      </g>

      {/* main shikhara */}
      <Tower cx={0} baseY={120} tiers={10} w0={62} th={9.4} shrink={5.2} />
      <ellipse cx="0" cy="26" rx="11" ry="4.6" fill="url(#gold)" stroke={GOLD_D} strokeWidth=".6" />
      <path d="M-5 24 C-9 14 9 14 5 24Z" fill="url(#goldR)" stroke={GOLD_D} strokeWidth=".6" />
      <path d="M0 14 V0" stroke="url(#gold)" strokeWidth="1.8" strokeLinecap="round" />
      <g className="flag" style={{ transformOrigin: '0px 4px' }}>
        <path d="M0 2 L22 7 L0 12Z" fill="#e8741b" stroke="#a8501a" strokeWidth=".6" />
        <path d="M2 4 L14 7 L2 10Z" fill="#ffb02e" opacity=".8" />
      </g>

      {/* oil lamps on the steps */}
      {[-96, -66, 66, 96].map((x) => (
        <g key={x}>
          <ellipse className="lamp-halo" cx={x} cy="168" rx="10" ry="8" fill="url(#glowGold)" />
          <path className="lamp-flame" d={`M${x} 160 C${x + 3} 164 ${x + 3} 168 ${x} 170 C${x - 3} 168 ${x - 3} 164 ${x} 160Z`} fill="#ffc83a" />
          <path d={`M${x - 5} 171 H${x + 5} C${x + 5} 175 ${x + 2} 176.4 ${x} 176.4 C${x - 2} 176.4 ${x - 5} 175 ${x - 5} 171Z`} fill="url(#gold)" stroke={GOLD_D} strokeWidth=".4" />
        </g>
      ))}
    </svg>
  );
}
