// The elephant "window": an arched alcove with a golden sun, stars, flower
// garland and the decorated elephant standing on a patterned temple floor.
import React from 'react';
import ElephantArt from './Elephant.jsx';
import { ArchGarland, Diya } from './Ornaments.jsx';

const ARCH = 'M18 440V150A142 142 0 0 1 302 150V440Z';
const STARS = [
  [70, 52, 1.6], [112, 30, 1.2], [160, 20, 1.8], [212, 34, 1.2], [252, 56, 1.6], [48, 96, 1.1],
  [274, 96, 1.2], [92, 78, 1], [230, 74, 1], [136, 52, 0.9], [188, 56, 1],
];

export default function ElephantScene() {
  return (
    <svg className="ele-scene" viewBox="0 0 320 440" role="img" aria-label="सोन्याच्या अलंकारांनी सजवलेला पारंपरिक हत्ती">
      <defs>
        <clipPath id="archClip">
          <path d={ARCH} />
        </clipPath>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#031209" />
          <stop offset=".45" stopColor="#08301f" />
          <stop offset=".8" stopColor="#14593a" />
          <stop offset="1" stopColor="#2c6b3e" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e3a27" />
          <stop offset="1" stopColor="#031a10" />
        </linearGradient>
      </defs>

      <g clipPath="url(#archClip)">
        <rect width="320" height="440" fill="url(#sky)" />
        {STARS.map(([x, y, r], i) => (
          <circle key={i} className="star" cx={x} cy={y} r={r} fill="#fff1b8" style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
        ))}

        {/* sun */}
        <circle cx="160" cy="176" r="130" fill="url(#glowGold)" opacity=".55" />
        <g transform="translate(160 176)">
          <g className="sun-rays">
            {Array.from({ length: 36 }, (_, i) => (
              <path
                key={i}
                d={`M-3.4 -72 L0 -${i % 2 ? 112 : 140} L3.4 -72Z`}
                transform={`rotate(${i * 10})`}
                fill="url(#gold)"
                opacity={i % 2 ? 0.4 : 0.62}
              />
            ))}
          </g>
          <circle r="68" fill="url(#goldR)" />
          <circle r="62" fill="none" stroke="#7d5817" strokeWidth="1" opacity=".5" />
          <circle r="56" fill="none" stroke="#fff3c2" strokeWidth=".8" strokeDasharray="1 4" strokeLinecap="round" opacity=".8" />
        </g>

        {/* floor */}
        <rect x="0" y="380" width="320" height="60" fill="url(#floor)" />
        <path d="M0 380H320" stroke="#e6c05a" strokeWidth="1.6" />
        <path d="M0 386H320" stroke="#e6c05a" strokeWidth=".6" strokeDasharray="1 3" strokeLinecap="round" />
        {Array.from({ length: 15 }, (_, i) => (
          <use key={i} href="#petal" transform={`translate(${i * 22 - 2} 442) scale(.34)`} fill="url(#gold)" stroke="#8a6118" strokeWidth="1.6" opacity=".85" />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d="M0 -4 L4 0 L0 4 L-4 0Z" transform={`translate(${i * 22 + 9} 408)`} fill="none" stroke="#e6c05a" strokeWidth=".8" opacity=".6" />
        ))}

        {/* elephant */}
        <g transform="translate(-8 169) scale(.72)">
          <ElephantArt />
        </g>

        {/* flower heaps + lamps in the foreground */}
        {[[34, 404], [286, 404]].map(([x, y]) => (
          <g key={x}>
            <use href="#fl-marigold" transform={`translate(${x - 10} ${y + 4}) scale(.78)`} />
            <use href="#fl-marigold-y" transform={`translate(${x + 7} ${y + 8}) scale(.7) rotate(20)`} />
            <use href="#fl-rose" transform={`translate(${x + 1} ${y - 6}) scale(.7)`} />
            <use href="#fl-marigold" transform={`translate(${x + 18} ${y - 2}) scale(.6)`} />
            <use href="#fl-jasmine" transform={`translate(${x - 14} ${y - 8}) scale(.8)`} />
          </g>
        ))}
        <Diya x="52" y="398" width="34" height="26" />
        <Diya x="234" y="398" width="34" height="26" />
      </g>

      {/* frame */}
      <path d={ARCH} fill="none" stroke="url(#gold)" strokeWidth="4" />
      <path d="M25 440V150A135 135 0 0 1 295 150V440" fill="none" stroke="#e6c05a" strokeWidth=".8" strokeDasharray="1 3.2" strokeLinecap="round" opacity=".9" />
      <ArchGarland cx={160} cy={150} r={148} bottom={392} count={26} scale={0.5} />
      <path d="M160 -2 L170 10 L160 22 L150 10Z" fill="url(#gold)" stroke="#7d5817" strokeWidth=".7" />
      <circle cx="160" cy="10" r="3" fill="#a8223d" />
    </svg>
  );
}
