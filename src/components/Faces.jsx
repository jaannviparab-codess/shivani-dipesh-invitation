// Non-content faces of the book: the cover, the inside-cover endpaper and the
// blank paper backs (seen only for an instant while a page turns on phones).
import React from 'react';
import { Mandala, Heart, Divider, notchPath, PageFrame } from '../art/Ornaments.jsx';
import { useTranslated } from '../lib/hooks.js';

const range = (n) => Array.from({ length: n }, (_, i) => i);

/* ───────────────────────── COVER ───────────────────────── */
export function CoverFront() {
  const outer = notchPath(15, 15, 370, 558, 22);
  const mid = notchPath(25, 25, 350, 538, 15);
  const pearl = notchPath(33, 33, 334, 522, 11);
  return (
    <div className="page cover-front static">
      <div className="leather" />
      <svg className="cover-art" viewBox="0 0 400 588" preserveAspectRatio="none" aria-hidden="true">
        {/* debossed shadow + raised highlight + gold, for an embossed look */}
        <path d={outer} fill="none" stroke="#02130b" strokeWidth="4.6" transform="translate(1.4 1.8)" opacity=".75" />
        <path d={outer} fill="none" stroke="#fff0b0" strokeWidth="3.4" transform="translate(-.5 -.7)" opacity=".5" />
        <path d={outer} fill="none" stroke="url(#gold)" strokeWidth="3.4" />
        <path d={mid} fill="none" stroke="#02130b" strokeWidth="1.8" transform="translate(.8 1)" opacity=".7" />
        <path d={mid} fill="none" stroke="url(#gold)" strokeWidth="1.4" />
        <path d={pearl} fill="none" stroke="#e9c458" strokeWidth="2.6" strokeDasharray="0.1 6.4" strokeLinecap="round" />
        {[
          'translate(13 13) scale(1.22)',
          'translate(387 13) scale(-1.22 1.22)',
          'translate(13 575) scale(1.22 -1.22)',
          'translate(387 575) scale(-1.22 -1.22)',
        ].map((t) => (
          <g key={t}>
            <use href="#corner-fl" transform={t} style={{ filter: 'drop-shadow(1px 1.4px 0 rgba(0,0,0,.55))' }} />
          </g>
        ))}
        {/* central emblem */}
        <g transform="translate(200 236)">
          <circle r="104" fill="none" stroke="#02130b" strokeWidth="3" transform="translate(1 2)" opacity=".6" />
          <circle r="100" fill="#072a1c" opacity=".92" />
          <circle r="100" fill="none" stroke="url(#gold)" strokeWidth="3" />
          <g style={{ filter: 'drop-shadow(1px 1.5px 0 rgba(0,0,0,.6))' }}>
            <Mandala petals={16} />
          </g>
          <circle r="35" fill="#06251a" stroke="url(#gold)" strokeWidth="2.4" />
          <circle r="29" fill="none" stroke="#e9c458" strokeWidth="1" strokeDasharray="0.1 4" strokeLinecap="round" />
        </g>
        {/* corner jewels on the mid-edges */}
        {[[200, 15], [200, 573]].map(([x, y]) => (
          <path key={y} d={`M${x} ${y - 6}L${x + 9} ${y}L${x} ${y + 6}L${x - 9} ${y}Z`} fill="url(#gold)" stroke="#6e4c10" strokeWidth=".6" />
        ))}
      </svg>

      <p className="cv-top gold-emboss">॥ श्री गणेशाय नमः ॥</p>
      <span className="cv-om gold-emboss" aria-hidden="true" translate="no">ॐ</span>
      <h1 className="cv-names gold-emboss" aria-label="शिवानी ♥ दिपेश">
        <span className="nm" aria-hidden="true">शिवानी</span>
        <Heart size={26} className="cv-heart" />
        <span className="nm" aria-hidden="true">दिपेश</span>
      </h1>
      <Divider className="cv-div" />
      <p className="cv-sub gold-emboss">साखरपुडा समारंभ</p>
      <Divider heart className="cv-div cv-div2" />

      {/* gold clasp on the fore-edge */}
      <div className="clasp" aria-hidden="true">
        <div className="strap">
          <i className="stitch" />
        </div>
        <div className="seal">
          <svg viewBox="-34 -34 68 68">
            <circle r="33" fill="#02130b" opacity=".5" transform="translate(1 2)" />
            {range(18).map((i) => (
              <circle key={i} cx="0" cy="-29" r="4.4" fill="url(#gold)" transform={`rotate(${i * 20})`} />
            ))}
            <circle r="29" fill="url(#goldR)" stroke="#7d5817" strokeWidth=".8" />
            <circle r="23.5" fill="none" stroke="#7d5817" strokeWidth=".9" opacity=".7" />
            <circle r="21" fill="#082c1e" stroke="#f0cf70" strokeWidth="1.2" />
            {range(8).map((i) => (
              <path key={i} d="M0 -3 C4 -8 4.6 -14 0 -18 C-4.6 -14 -4 -8 0 -3Z" transform={`rotate(${i * 45})`} fill="url(#gold)" stroke="#7d5817" strokeWidth=".4" />
            ))}
            <circle r="4.6" fill="#a8223d" stroke="#f0cf70" strokeWidth=".8" />
            <circle cx="-1.4" cy="-1.6" r="1.4" fill="#ff9aa8" opacity=".85" />
          </svg>
        </div>
      </div>
      <div className="sheen" />
    </div>
  );
}

/* ───────────────────────── Inside of the cover ───────────────────────── */
export function Endpaper() {
  const latin = useTranslated(); // translated page → monogram becomes S ♥ D
  return (
    <div className="page endpaper static">
      <svg className="endpaper-art" viewBox="0 0 400 588" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="jaali" width="56" height="56" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#dcb558" strokeWidth=".8">
              <path d="M28 5 L51 28 L28 51 L5 28Z" />
              <circle cx="28" cy="28" r="8.5" />
              {range(8).map((i) => (
                <path key={i} d="M0 -9 C3 -13 3 -17 0 -20 C-3 -17 -3 -13 0 -9Z" transform={`translate(28 28) rotate(${i * 45})`} />
              ))}
            </g>
            {[[0, 0], [56, 0], [0, 56], [56, 56]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="none" stroke="#dcb558" strokeWidth=".8" />
            ))}
          </pattern>
        </defs>
        <rect width="400" height="588" fill="url(#jaali)" opacity=".4" />
        <rect width="400" height="588" fill="url(#endVignette)" />
        <path d={notchPath(16, 16, 368, 556, 20)} fill="#072a1c" stroke="url(#gold)" strokeWidth="2.6" opacity=".96" />
        <path d={notchPath(24, 24, 352, 540, 14)} fill="none" stroke="#dcb558" strokeWidth=".9" />
        <rect x="30" y="30" width="340" height="528" fill="url(#jaali)" opacity=".5" />
        <g transform="translate(200 294)">
          <circle r="124" fill="#06251a" stroke="url(#gold)" strokeWidth="3" />
          <g transform="scale(1.1)">
            <Mandala petals={16} spin={false} />
          </g>
          <circle r="44" fill="#06251a" stroke="url(#gold)" strokeWidth="2.4" />
        </g>
        {[
          'translate(14 14)',
          'translate(386 14) scale(-1 1)',
          'translate(14 574) scale(1 -1)',
          'translate(386 574) scale(-1 -1)',
        ].map((t) => (
          <use key={t} href="#corner-fl" transform={t} />
        ))}
      </svg>
      <div className={`mono gold-emboss ${latin ? 'is-latin' : ''}`} translate="no">
        <span>{latin ? 'S' : 'शि'}</span>
        <Heart size={18} />
        <span>{latin ? 'D' : 'दि'}</span>
      </div>
    </div>
  );
}

/* ───────────────────────── Blank paper (back of a page, phones) ───────────────────────── */
export function BlankFace() {
  return (
    <div className="page blank static">
      <PageFrame corners={false} double={false} />
      <svg className="blank-mandala" viewBox="-100 -100 200 200" aria-hidden="true">
        <Mandala petals={16} spin={false} />
      </svg>
    </div>
  );
}
