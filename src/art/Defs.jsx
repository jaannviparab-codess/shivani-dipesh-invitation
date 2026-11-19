// Global SVG definitions: gold gradients, flowers, leaves and the corner flourish.
// Rendered once; every other SVG in the page references them with <use>/url(#id).
import React from 'react';

const rot = (n, step, start = 0) => Array.from({ length: n }, (_, i) => start + i * step);

export default function Defs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* ── metals ── */}
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c2" />
          <stop offset=".2" stopColor="#ecc95f" />
          <stop offset=".45" stopColor="#b98a2c" />
          <stop offset=".7" stopColor="#f6dc86" />
          <stop offset="1" stopColor="#8f6519" />
        </linearGradient>
        <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset=".35" stopColor="#d8ae4a" />
          <stop offset=".6" stopColor="#a87820" />
          <stop offset="1" stopColor="#e9c765" />
        </linearGradient>
        <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a87820" />
          <stop offset=".3" stopColor="#f3d680" />
          <stop offset=".55" stopColor="#c99a37" />
          <stop offset=".8" stopColor="#f8e49a" />
          <stop offset="1" stopColor="#9a6c1b" />
        </linearGradient>
        <radialGradient id="goldR" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#fff6cc" />
          <stop offset=".35" stopColor="#e6c05a" />
          <stop offset=".75" stopColor="#a87a22" />
          <stop offset="1" stopColor="#7d5817" />
        </radialGradient>
        <radialGradient id="glowGold" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe9a0" stopOpacity=".95" />
          <stop offset=".5" stopColor="#f0c75a" stopOpacity=".35" />
          <stop offset="1" stopColor="#f0c75a" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="endVignette" cx=".5" cy=".5" r=".75">
          <stop offset=".45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".55" />
        </radialGradient>

        {/* ── greens ── */}
        <linearGradient id="leafG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f9a63" />
          <stop offset="1" stopColor="#1b5a3a" />
        </linearGradient>
        <linearGradient id="emerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14704a" />
          <stop offset="1" stopColor="#07301f" />
        </linearGradient>

        {/* ── lotus petals ── */}
        <linearGradient id="lotusA" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff4ea" />
          <stop offset=".55" stopColor="#f6c4d0" />
          <stop offset="1" stopColor="#d9587d" />
        </linearGradient>
        <linearGradient id="lotusB" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset=".6" stopColor="#f9d6de" />
          <stop offset="1" stopColor="#e47d9c" />
        </linearGradient>
        <linearGradient id="lotusC" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="1" stopColor="#f8c9d5" />
        </linearGradient>

        {/* ── crimson cloth ── */}
        <linearGradient id="crimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8223d" />
          <stop offset="1" stopColor="#5e0f23" />
        </linearGradient>

        {/* ── marigold ── */}
        <g id="fl-marigold">
          <circle r="13" fill="#c25a10" />
          {rot(16, 22.5).map((a) => (
            <ellipse key={a} rx="4.4" ry="8" cy="-6.4" fill="#ef8a1e" transform={`rotate(${a})`} />
          ))}
          {rot(12, 30, 15).map((a) => (
            <ellipse key={a} rx="3.1" ry="5.8" cy="-3.9" fill="#ffb02e" transform={`rotate(${a})`} />
          ))}
          <circle r="3.4" fill="#e0740d" />
          <circle r="1.5" fill="#ffd978" />
        </g>
        <g id="fl-marigold-y">
          <circle r="13" fill="#d98a0c" />
          {rot(16, 22.5).map((a) => (
            <ellipse key={a} rx="4.4" ry="8" cy="-6.4" fill="#f7b61f" transform={`rotate(${a})`} />
          ))}
          {rot(12, 30, 15).map((a) => (
            <ellipse key={a} rx="3.1" ry="5.8" cy="-3.9" fill="#ffd54a" transform={`rotate(${a})`} />
          ))}
          <circle r="3.4" fill="#e59a10" />
          <circle r="1.5" fill="#fff0a0" />
        </g>

        {/* ── rose ── */}
        <g id="fl-rose">
          <circle r="12.5" fill="#8f1530" />
          <circle r="10.5" fill="#c4273f" />
          <path d="M-9 -2 C-8 -9 3 -11 9 -4 C11 2 6 9 -1 9 C-8 9 -11 3 -9 -2Z" fill="#d83a52" />
          <path d="M-6 -1 C-5 -6 2 -7 6 -2 C7 2 4 6 -1 6 C-5 6 -7 3 -6 -1Z" fill="#e9566c" />
          <path d="M-3 0 C-2 -3 2 -4 3.4 -1 C4 1.4 1.5 3 -0.4 2.6 C-2 2 -2 .6 .4 .4" fill="none" stroke="#9c1a33" strokeWidth="1" strokeLinecap="round" />
          <path d="M-10 -3 C-6 -10 4 -11 10 -3" fill="none" stroke="#f08ba0" strokeWidth=".8" opacity=".7" />
        </g>

        {/* ── jasmine ── */}
        <g id="fl-jasmine">
          {rot(5, 72).map((a) => (
            <ellipse key={a} rx="3.6" ry="7" cy="-6" fill="#fffaf0" stroke="#e3d6aa" strokeWidth=".6" transform={`rotate(${a})`} />
          ))}
          <circle r="2.4" fill="#e9c458" />
          <circle r="1" fill="#b98a2c" />
        </g>

        {/* ── mango leaf (hangs downward from 0,0) ── */}
        <g id="leaf-down">
          <path d="M0 0 C-9 8 -10 24 0 38 C10 24 9 8 0 0Z" fill="url(#leafG)" stroke="#d6ae4e" strokeWidth=".7" />
          <path d="M0 2 L0 35" stroke="#a9d9a8" strokeWidth=".7" opacity=".8" />
          <path d="M0 10 L-5 15 M0 17 L-6 23 M0 24 L-4 29 M0 10 L5 15 M0 17 L6 23 M0 24 L4 29" stroke="#a9d9a8" strokeWidth=".5" opacity=".55" fill="none" />
        </g>
        {/* leaf pointing up from 0,0 */}
        <g id="leaf-up">
          <path d="M0 0 C-9 -8 -10 -24 0 -38 C10 -24 9 -8 0 0Z" fill="url(#leafG)" stroke="#d6ae4e" strokeWidth=".7" />
          <path d="M0 -2 L0 -35" stroke="#a9d9a8" strokeWidth=".7" opacity=".8" />
          <path d="M0 -10 L-5 -15 M0 -17 L-6 -23 M0 -24 L-4 -29 M0 -10 L5 -15 M0 -17 L6 -23 M0 -24 L4 -29" stroke="#a9d9a8" strokeWidth=".5" opacity=".55" fill="none" />
        </g>

        {/* ── corner flourish, designed for the TOP-LEFT corner, 100×100 ── */}
        <g id="corner-fl" fill="none" stroke="#dcb558" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
          {[0, 22.5, 45, 67.5, 90].map((a) => (
            <path
              key={a}
              d={`M0 0 C9 -5.4 ${a % 45 === 0 ? 26 : 22} -5.4 ${a % 45 === 0 ? 36 : 30} 0 C${a % 45 === 0 ? 26 : 22} 5.4 9 5.4 0 0Z`}
              transform={`translate(18 18) rotate(${a})`}
              fill="url(#gold)"
              stroke="#8a6118"
              strokeWidth=".55"
            />
          ))}
          <circle cx="18" cy="18" r="10.5" stroke="#dcb558" />
          <circle cx="18" cy="18" r="6.2" fill="url(#goldR)" stroke="#7d5817" strokeWidth=".6" />
          <circle cx="18" cy="18" r="2.4" fill="#0b3d28" stroke="none" />
          <path d="M58 18 C68 18 71 9 79 9 C86 9 89 16 84 19.5 C80 22 76.5 17 80.5 14.8" />
          <path d="M92 13 a1.7 1.7 0 1 0 .01 0" fill="#e9c458" stroke="none" />
          <path d="M66 18 C70 25 76 26 80 23" opacity=".7" />
          <g transform="matrix(0 1 1 0 0 0)">
            <path d="M58 18 C68 18 71 9 79 9 C86 9 89 16 84 19.5 C80 22 76.5 17 80.5 14.8" />
            <path d="M92 13 a1.7 1.7 0 1 0 .01 0" fill="#e9c458" stroke="none" />
            <path d="M66 18 C70 25 76 26 80 23" opacity=".7" />
          </g>
          <path d="M46 46 L52 52 L46 58 L40 52Z" fill="url(#gold)" stroke="#8a6118" strokeWidth=".5" />
        </g>

        {/* ── lotus petal (pointing up) ── */}
        <path id="petal" d="M0 0 C-13 -11 -15 -36 0 -64 C15 -36 13 -11 0 0Z" />
      </defs>
    </svg>
  );
}
