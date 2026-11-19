// The seven invitation pages + countdown. Page text is exactly as supplied.
import React from 'react';
import { PageFrame, Divider, Lotus, Toran, Mandala, Rings, PinIcon, SunsetIcon, Kalash, Diya } from '../art/Ornaments.jsx';
import ElephantScene from '../art/ElephantScene.jsx';
import Temple from '../art/Temple.jsx';
import { EVENT_TIME, MAPS_URL, RSVP_NAME, RSVP_PHONE_DISPLAY, RSVP_PHONE_TEL } from '../config.js';
import { useCountdown } from '../lib/useCountdown.js';
import { useTranslated } from '../lib/hooks.js';
import { useUi } from '../lib/uiText.js';
import { toDevanagari } from '../lib/devanagari.js';

/** Common page shell. `.in` switches the entrance animations on. */
export function Page({ id, inView, className = '', children }) {
  return (
    <div className={`page ${className} ${inView ? 'in' : ''}`} data-page={id}>
      {children}
    </div>
  );
}

// The browser's "Translate to English" renders श्रीकृष्ण as "Srikrishna". In English
// mode that one word is shown as a fixed, untranslated "Shrikrishna" instead; the
// Marathi text itself is never changed. (Same idea as the interface labels in uiText.js.)
// The translator trims the spaces of the text nodes next to the untranslated span
// ("Mr.ShrikrishnaJanardan"), so the word carries its own spaces inside the span.
const KRISHNA_MR = 'श्रीकृष्ण';
const KRISHNA_EN = 'Shrikrishna';

function withShrikrishna(text, english) {
  if (!english || !text.includes(KRISHNA_MR)) return text;
  return text.split(KRISHNA_MR).map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 ? <span translate="no">{` ${KRISHNA_EN} `}</span> : null}
      {part}
    </React.Fragment>
  ));
}

/** Splits a sentence into words so each can be revealed in turn. */
function Words({ text, start = 0.8, step = 0.07 }) {
  return text.split(' ').map((w, i, arr) => (
    <React.Fragment key={i}>
      <span className="word" style={{ '--d': `${start + i * step}s` }}>
        {w}
      </span>
      {i < arr.length - 1 ? ' ' : null}
    </React.Fragment>
  ));
}

/** Rose / marigold / jasmine spray that sits in a corner of a page. */
export function FloralSpray({ pos = 'tl', size = 1 }) {
  return (
    <svg className={`spray spray-${pos}`} viewBox="0 0 150 150" style={{ '--sz': size }} aria-hidden="true">
      <g className="spray-sway">
        {[96, 112, 128, 144, 160].map((a, i) => (
          <use key={a} href="#leaf-up" transform={`translate(8 8) rotate(${a}) scale(${1.9 - Math.abs(i - 2) * 0.12})`} />
        ))}
        {[104, 136, 168].map((a) => (
          <use key={a} href="#leaf-up" transform={`translate(8 8) rotate(${a}) scale(1.25)`} opacity=".85" />
        ))}
        <use href="#fl-marigold" transform="translate(64 26) rotate(10) scale(1.02)" />
        <use href="#fl-marigold-y" transform="translate(26 66) rotate(40) scale(1.02)" />
        <use href="#fl-rose" transform="translate(38 38) scale(1.4)" />
        <use href="#fl-marigold" transform="translate(88 12) scale(.62)" />
        <use href="#fl-marigold-y" transform="translate(12 90) scale(.62)" />
        <use href="#fl-jasmine" transform="translate(64 60) rotate(15) scale(.95)" />
        <use href="#fl-jasmine" transform="translate(52 78) rotate(40) scale(.8)" />
        <use href="#fl-jasmine" transform="translate(80 46) rotate(8) scale(.8)" />
        <use href="#fl-rose" transform="translate(104 8) scale(.52)" />
        <use href="#fl-rose" transform="translate(8 108) scale(.52)" />
      </g>
    </svg>
  );
}

/* ═════════════════════════ PAGE 1 — auspicious introduction ═════════════════════════ */
export function PageIntro({ inView }) {
  return (
    <Page id="p1" inView={inView} className="p-intro">
      <PageFrame />
      <div className="toran-wrap">
        <Toran w={400} h={100} swags={3} sag={19} />
      </div>
      <div className="p-body">
        <div className="om-medal reveal" style={{ '--d': '0.7s' }}>
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <circle r="98" fill="#0b3d28" opacity=".9" />
            <Mandala petals={16} />
            <circle r="34" fill="#072a1c" stroke="#dcb558" strokeWidth="1.6" />
          </svg>
          <span className="om gold-text" aria-hidden="true" translate="no">ॐ</span>
        </div>
        <h2 className="ganesh gold-text wipe" style={{ '--d': '1.1s' }}>
          ॥ श्री गणेशाय नमः ॥
        </h2>
        <Divider className="reveal" />
        <p className="deity reveal" style={{ '--d': '1.7s' }}>
          ॥ श्री भगवती देवी प्रसन्न ॥
        </p>
        <p className="deity reveal" style={{ '--d': '2.0s' }}>
          ॥ श्री केदारलिंग प्रसन्न ॥
        </p>
        <Kalash className="reveal kalash-p1" />
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 2 — bride & groom ═════════════════════════ */
export function PageNames({ inView }) {
  const { english, k: uiKey } = useUi();
  return (
    <Page id="p2" inView={inView} className="p-names">
      <PageFrame corners={['tr', 'bl']} />
      <FloralSpray pos="tl" />
      <FloralSpray pos="br" />
      <div className="p-body">
        <section className="person reveal" style={{ '--d': '0.7s' }}>
          <p className="hon">चि. सौ. कां.</p>
          <h2 className="name gold-text wipe" style={{ '--d': '0.9s' }}>शिवानी</h2>
          <p className="parents" key={uiKey}>
            {withShrikrishna('सौ. श्रद्धा आणि श्री. श्रीकृष्ण जनार्दन पेडणेकर यांची कन्या', english)}
          </p>
        </section>
        <Rings className="reveal" />
        <section className="person reveal" style={{ '--d': '1.5s' }}>
          <p className="hon">चि.</p>
          <h2 className="name gold-text wipe" style={{ '--d': '1.7s' }}>दिपेश</h2>
          <p className="parents">सौ. सुचिता आणि श्री. नागेश विष्णू मालंदकर यांचे सुपुत्र</p>
        </section>
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 3 — the elephant ═════════════════════════ */
export function PageElephant({ inView }) {
  return (
    <Page id="p3" inView={inView} className="p-ele">
      <PageFrame />
      <div className="ele-wrap reveal-scale" style={{ '--d': '0.5s' }}>
        <ElephantScene />
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 4 — date, time, countdown ═════════════════════════ */
function Countdown({ active }) {
  const t = useCountdown(EVENT_TIME, active);
  const latin = useTranslated();
  const { t: ui, no, k: uiKey } = useUi();
  if (t.done) {
    return (
      <div className="cd cd-done">
        <p className="gold-text">शुभ दिन आला आहे!</p>
      </div>
    );
  }
  const cells = [
    ['d', ui.days],
    ['h', ui.hours],
    ['m', ui.minutes],
    ['s', ui.seconds],
  ];
  const label = `साखरपुडा समारंभास ${t.d} दिवस ${t.h} तास ${t.m} मिनिटे बाकी`;
  return (
    <div className="cd" role="timer" aria-label={label}>
      <p className="cd-title" key={uiKey} {...no}>
        {ui.countdown}
      </p>
      <div className="cd-grid" aria-hidden="true">
        {cells.map(([k, l]) => (
          <div className="cd-cell" key={k}>
            <span className="cd-num">
              <span key={t[k]} className="roll">
                {toDevanagari(t[k], 2, latin)}
              </span>
            </span>
            <span className="cd-label" key={uiKey} {...no}>
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageDate({ inView }) {
  const latin = useTranslated();
  return (
    <Page id="p4" inView={inView} className="p-date">
      <PageFrame />
      <div className="p-body">
        <h2 className="title gold-text wipe" style={{ '--d': '0.6s' }}>साखरपुडा समारंभ</h2>
        <Divider className="reveal" />
        <div className="date-block reveal" style={{ '--d': '1.1s' }}>
          <span className="sr">गुरुवार, ३ डिसेंबर २०२६</span>
          <p className="dow" aria-hidden="true">गुरुवार,</p>
          <div className="day-medal" aria-hidden="true">
            <svg viewBox="-100 -100 200 200">
              <g className="sun-spin">
                {Array.from({ length: 24 }, (_, i) => (
                  <path key={i} d="M-3.4 -70 L0 -98 L3.4 -70Z" transform={`rotate(${i * 15})`} fill="url(#gold)" opacity={i % 2 ? 0.55 : 0.95} />
                ))}
              </g>
              <circle r="66" fill="#0b3d28" stroke="url(#gold)" strokeWidth="3.4" />
              <circle r="58" fill="none" stroke="#dcb558" strokeWidth="1" strokeDasharray="0.1 5" strokeLinecap="round" />
            </svg>
            <span className="day gold-text" translate="no">{latin ? '3' : '३'}</span>
          </div>
          <p className="month" aria-hidden="true">डिसेंबर २०२६</p>
        </div>
        <p className="time reveal" style={{ '--d': '1.5s' }}>
          <SunsetIcon />
          <span>सायंकाळी ५:०० वाजता</span>
        </p>
        <div className="reveal" style={{ '--d': '1.8s' }}>
          <Countdown active={inView} />
        </div>
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 5 — venue ═════════════════════════ */
export function PageVenue({ inView }) {
  return (
    <Page id="p5" inView={inView} className="p-venue">
      <PageFrame />
      <div className="temple-wrap reveal-scale" style={{ '--d': '0.5s' }}>
        <Temple />
      </div>
      <div className="p-body">
        <h2 className="venue-name gold-text wipe" style={{ '--d': '1.1s' }}>श्री राम मंदिर</h2>
        <p className="hall reveal" style={{ '--d': '1.4s' }}>श्री वैष्णव आश्रम ट्रस्ट मंगल कार्यालय</p>
        <Divider className="reveal" />
        <address className="addr reveal" style={{ '--d': '1.7s' }}>
          जनता कॉलनी, पश्चिम द्रुतगती महामार्ग,
          <br />
          जोगेश्वरी (पूर्व), मुंबई ४०००६०.
        </address>
        <div className="map-reveal">
          <svg className="route" viewBox="0 0 300 64" aria-hidden="true">
            <path className="route-line" pathLength="1" d="M10 54 C50 54 60 20 100 28 C140 36 130 58 170 50 C210 42 214 14 252 22" fill="none" stroke="#dcb558" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.012 0.02" />
            <circle cx="10" cy="54" r="4" fill="#dcb558" />
            <g className="drop-pin" transform="translate(258 22)">
              <ellipse className="pin-shadow" cx="0" cy="1" rx="9" ry="3" fill="#000" opacity=".3" />
              <g className="pin-body">
                <path d="M0 0 C-9 -12 -13 -17 -13 -23 C-13 -30 -7 -35 0 -35 C7 -35 13 -30 13 -23 C13 -17 9 -12 0 0Z" fill="url(#gold)" stroke="#7d5817" strokeWidth="1" />
                <circle cy="-23" r="5.2" fill="#0b3d28" />
              </g>
            </g>
            <circle className="pin-ripple r1" cx="258" cy="22" r="6" fill="none" stroke="#f0cf70" strokeWidth="1.4" />
            <circle className="pin-ripple r2" cx="258" cy="22" r="6" fill="none" stroke="#f0cf70" strokeWidth="1.4" />
          </svg>
          <a className="btn-gold map-btn" href={MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="स्थळ पहा — Google Maps मध्ये उघडा">
            <PinIcon />
            <span>स्थळ पहा</span>
          </a>
        </div>
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 6 — invitation message ═════════════════════════ */
export function PageMessage({ inView }) {
  return (
    <Page id="p6" inView={inView} className="p-msg">
      <PageFrame corners={['tl', 'br']} />
      <FloralSpray pos="tr" />
      <FloralSpray pos="bl" />
      <div className="p-body">
        <Lotus className="msg-lotus reveal" />
        <p className="msg">
          <Words text="या शुभमुहूर्तावर करण्याचे योजिले आहे. तरी आपण सर्वांनी सहकुटुंब सहपरिवार उपस्थित राहावे, ही नम्र विनंती." />
        </p>
        <Divider heart className="reveal" />
        <Diya className="msg-diya reveal" />
      </div>
    </Page>
  );
}

/* ═════════════════════════ PAGE 7 — RSVP & closing ═════════════════════════ */
export function PageRsvp({ inView }) {
  const { english, k: uiKey } = useUi();
  return (
    <Page id="p7" inView={inView} className="p-rsvp">
      <PageFrame />
      <div className="p-body">
        <h2 className="bless reveal" style={{ '--d': '0.6s' }}>
          आपली उपस्थिती हीच आमच्यासाठी आनंदाची आणि आशीर्वादाची भेट!
        </h2>
        <Divider className="reveal" />
        <div className="contact reveal" style={{ '--d': '1.2s' }}>
          <p className="c-name" key={uiKey}>{withShrikrishna(RSVP_NAME, english)}</p>
          <a className="c-phone" href={`tel:${RSVP_PHONE_TEL}`} aria-label={`फोन करा ${RSVP_PHONE_DISPLAY}`}>
            {RSVP_PHONE_DISPLAY}
          </a>
        </div>
        <Lotus big className="closing-lotus" />
      </div>
    </Page>
  );
}
