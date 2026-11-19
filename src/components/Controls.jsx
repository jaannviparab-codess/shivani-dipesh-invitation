import React from 'react';
import { ChevronIcon } from '../art/Ornaments.jsx';
import { toDevanagari } from '../lib/devanagari.js';
import { useTranslated } from '../lib/hooks.js';
import { useUi } from '../lib/uiText.js';

/** Bottom navigation: previous / page dots / next. */
export default function Controls({ visible, step, lastStep, visiblePages, total, onPrev, onNext, onGoto }) {
  const atStart = step === 0;
  const atEnd = step === lastStep;
  const latin = useTranslated();
  const { t, no, k } = useUi();
  const label = `${visiblePages.map((i) => toDevanagari(i + 1, 0, latin)).join('–')} / ${toDevanagari(total, 0, latin)}`;
  return (
    <nav className={`controls ${visible ? 'on' : ''}`} aria-label={t.nav} aria-hidden={!visible} inert={!visible}>
      <button type="button" className="nav-btn prev" onClick={onPrev} disabled={atStart}>
        <ChevronIcon dir="left" />
        <span className="nav-label" key={k} {...no}>
          {t.prev}
        </span>
      </button>

      <div className="pager">
        <ol className="dots">
          {Array.from({ length: total }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                className={`dot ${visiblePages.includes(i) ? 'on' : ''}`}
                onClick={() => onGoto(i)}
                aria-label={`${t.page} ${toDevanagari(i + 1, 0, latin)}`}
                aria-current={visiblePages.includes(i) ? 'page' : undefined}
              />
            </li>
          ))}
        </ol>
        <p className="counter" aria-hidden="true">
          <span key={label}>{label}</span>
        </p>
      </div>

      <button type="button" className={`nav-btn next ${atEnd ? 'again' : ''}`} onClick={onNext}>
        <span className="nav-label" key={`${k}-${atEnd ? 'again' : 'next'}`} {...no}>
          {atEnd ? t.again : t.next}
        </span>
        {!atEnd && <ChevronIcon />}
      </button>
    </nav>
  );
}
