// The whole invitation: stage, closed book, cinematic opening, page turning.
//
// 3-D approach: pure CSS 3-D transforms (real DOM, so Devanagari text stays
// razor sharp and accessible) driven by GSAP timelines. Every leaf is a
// double-sided sheet hinged on the spine; turning a page animates a single
// progress value p (0 → 1) and paints rotation, lift, shading and cast
// shadows from it on each frame.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import Particles from './Particles.jsx';
import Controls from './Controls.jsx';
import { CoverFront, Endpaper, BlankFace } from './Faces.jsx';
import { PageIntro, PageNames, PageElephant, PageDate, PageVenue, PageMessage, PageRsvp } from './Pages.jsx';
import { Toran } from '../art/Ornaments.jsx';
import { PAGE_ASPECT } from '../config.js';
import { usePrefersReducedMotion } from '../lib/hooks.js';
import { useUi } from '../lib/uiText.js';

const PAGE_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
const TOTAL_PAGES = PAGE_IDS.length;

// Keep animation durations true to the clock on slow phones (GSAP's default would
// stretch them whenever frames take > 500 ms).
gsap.ticker.lagSmoothing(1500, 40);
if (import.meta.env.DEV) window.__gsap = gsap; // handy for slow-motion debugging

/* ── model: which faces sit on which leaf ───────────────────────────────────── */
function buildLeaves(mode) {
  if (mode === 'spread') {
    return [
      { front: 'p1', back: 'p2' },
      { front: 'p3', back: 'p4' },
      { front: 'p5', back: 'p6' },
      { front: 'p7', back: 'end' },
    ];
  }
  return PAGE_IDS.map((id) => ({ front: id, back: 'blank' }));
}

/** face ids visible for a step (leaves 0..step-1 are turned). */
function visibleFaces(mode, rawStep) {
  const leaves = buildLeaves(mode);
  const step = Math.max(0, Math.min(leaves.length - 1, rawStep)); // robust while a layout switch settles
  if (mode === 'spread') {
    return [step === 0 ? 'endpaper' : leaves[step - 1].back, leaves[step]?.front].filter(Boolean);
  }
  return [PAGE_IDS[step]];
}

const stepToSingle = (s) => (s === 0 ? 0 : 2 * s - 1);
const stepToSpread = (p) => Math.ceil(p / 2);
const stepForPage = (mode, pageIndex) => (mode === 'spread' ? Math.ceil(pageIndex / 2) : pageIndex);

function computeLayout(w, h) {
  // compact: a phone held sideways (or a very short window). The bottom bar is dropped —
  // arrows move to the screen sides — so the book can use the full height.
  const compact = h < 520;
  const tight = !compact && h < 700; // small portrait phones: slimmer chrome = bigger book
  const shortDesktop = !compact && w >= 640 && h < 800; // laptops: give the book a little more height
  const controlsH = compact ? 8 : tight ? 84 : w < 640 ? 96 : shortDesktop ? 94 : 108;
  const topPad = compact ? 8 : tight ? 50 : w < 640 ? 56 : shortDesktop ? 36 : 44;
  const availH = Math.max(220, h - controlsH - topPad);
  const spread = w >= 820 && w / h >= 1.12;
  const availW = spread ? (w * 0.93) / 2 : w * 0.94;
  const pageH = Math.min(availH * 0.97, availW / PAGE_ASPECT);
  const pageW = pageH * PAGE_ASPECT;
  const T = Math.round(Math.max(14, Math.min(34, pageW * 0.07)));
  return { mode: spread ? 'spread' : 'single', pageW: Math.round(pageW), pageH: Math.round(pageH), T, controlsH, topPad, compact };
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const toNum = (n) => Number(n.toFixed(3));

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const { t: ui, no: noTranslate, k: uiKey } = useUi();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const stageRef = useRef(null);
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const layout = useMemo(() => computeLayout(size.w, size.h), [size.w, size.h]);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const { mode, pageW, pageH, T } = layout;
  // sideways phones so small that the pages would be unreadable get a friendly prompt
  const tooSmall = layout.compact && layout.pageW < 220;

  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('closed'); // closed | opening | open
  const phaseRef = useRef('closed');
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [inSet, setInSet] = useState(() => new Set());
  const [status, setStatus] = useState('');
  const [rotateSeen, setRotateSeen] = useState(false);

  const modeRef = useRef(mode);
  const leaves = useMemo(() => buildLeaves(mode), [mode]);
  const N = leaves.length;

  // DOM refs
  const els = useRef({}); // leaf elements by index (0 = cover)
  const rig = useRef({}); // camera / float / parallax / tilt / shift / glow …
  const blocks = useRef({});
  const P = useRef([0]); // progress of each leaf, 0 = closed on the right, 1 = turned to the left
  const timeline = useRef(null);
  const floatTl = useRef(null);
  const busy = useRef(false);
  const fx = useRef(null);

  /* ── measure (ResizeObserver also catches the pane/viewport going from 0 → real size) ── */
  useLayoutEffect(() => {
    const el = stageRef.current;
    const measure = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    window.visualViewport?.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, []);

  /* ── fonts: wait briefly so Devanagari never flashes in a fallback face ──── */
  useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const fonts = document.fonts;
    if (fonts && fonts.load) {
      Promise.all([
        fonts.load('400 24px "Noto Serif Devanagari"', 'शिवानी'),
        fonts.load('700 24px "Noto Serif Devanagari"', 'शिवानी'),
        fonts.load('400 24px "Tiro Devanagari Marathi"', 'शिवानी'),
        fonts.load('400 24px "Yatra One"', 'शिवानी'),
      ])
        .then(go)
        .catch(go);
    } else go();
    const t = window.setTimeout(go, 2200);
    return () => window.clearTimeout(t);
  }, []);

  /* ── painting ────────────────────────────────────────────────────────────── */
  const zOf = useCallback((j) => {
    const { T: t } = layoutRef.current;
    if (j === 0) return t / 2;
    const n = buildLeaves(modeRef.current).length;
    const d = Math.max(1.2, (t - 12) / n);
    return t / 2 - 4 - (j - 1) * d;
  }, []);

  const paintBlocks = useCallback(() => {
    const B = blocks.current;
    const { T: t, pageW: pw, mode: m } = layoutRef.current;
    if (!B.rEdge) return;
    const n = buildLeaves(modeRef.current).length;
    let turned = 0;
    for (let j = 1; j <= n; j += 1) turned += P.current[j] || 0;
    const coverP = P.current[0] || 0;
    const wMax = t - 7;
    const wR = Math.max(0.01, wMax * (1 - turned / n));
    const wL = Math.max(0.01, wMax * (turned / n) * clamp01(coverP * 1.2));
    const aR = -t / 2 + 3 + wR;
    const aL = -t / 2 + 3 + wL;
    B.rEdge.style.width = `${toNum(wR)}px`;
    B.rEdge.style.transform = `translateZ(${toNum(aR)}px) rotateY(90deg)`;
    B.rTop.style.height = `${toNum(wR)}px`;
    B.rTop.style.transform = `translateZ(${toNum(aR)}px) rotateX(-90deg)`;
    B.rBot.style.height = `${toNum(wR)}px`;
    B.rBot.style.transform = `translateZ(${toNum(aR)}px) rotateX(90deg)`;
    if (m === 'spread' && B.lEdge) {
      B.lEdge.style.width = `${toNum(wL)}px`;
      B.lEdge.style.transform = `translateZ(${toNum(aL - wL)}px) rotateY(-90deg)`;
      B.lTop.style.height = `${toNum(wL)}px`;
      B.lTop.style.transform = `translateZ(${toNum(aL)}px) rotateX(-90deg)`;
      B.lBot.style.height = `${toNum(wL)}px`;
      B.lBot.style.transform = `translateZ(${toNum(aL)}px) rotateX(90deg)`;
      B.lEdge.style.left = `${-(pw - 5)}px`;
    }
  }, []);

  const paint = useCallback(
    (j) => {
      const L = els.current[j];
      if (!L || !L.el) return;
      const p = clamp01(P.current[j] || 0);
      const { pageW: pw } = layoutRef.current;
      const lift = Math.sin(p * Math.PI) * pw * 0.05;
      L.el.style.transform = `translateZ(${toNum(lift)}px) rotateY(${toNum(-180 * p)}deg) translateZ(${toNum(zOf(j))}px)`;
      // Hide the side that is turned away. Relying on backface-visibility alone lets
      // filtered / animated descendants "ghost" through, so cull explicitly too.
      if (L.fFace) L.fFace.style.visibility = p < 0.5 ? '' : 'hidden'; // '' = inherit from the leaf
      if (L.bFace) L.bFace.style.visibility = p >= 0.5 ? '' : 'hidden';
      if (L.fShade) L.fShade.style.opacity = toNum(clamp01(p / 0.5) * 0.55);
      if (L.bShade) L.bShade.style.opacity = toNum(clamp01((1 - p) / 0.5) * 0.55);
      const cast = Math.sin(p * Math.PI) * 0.6;
      const next = els.current[j + 1];
      if (next && next.fCast) next.fCast.style.opacity = toNum(cast);
      const prev = els.current[j - 1];
      if (prev && prev.bCast) prev.bCast.style.opacity = toNum(cast);
      if (j === 0) {
        const light = Math.sin(p * Math.PI);
        const glowOp = toNum(light * 0.95);
        if (L.light) L.light.style.opacity = glowOp;
        const first = els.current[1];
        if (first && first.light) first.light.style.opacity = glowOp;
      }
    },
    [zOf],
  );

  const paintAll = useCallback(() => {
    const n = buildLeaves(modeRef.current).length;
    for (let j = 0; j <= n; j += 1) paint(j);
    paintBlocks();
  }, [paint, paintBlocks]);

  /** On phones only the page being read (and its neighbours) need to exist as layers. */
  const applyVisibility = useCallback(() => {
    const n = buildLeaves(modeRef.current).length;
    const single = modeRef.current === 'single';
    // on phones the turned-back cover would only show as a sliver at the screen edge
    const cv = els.current[0];
    if (cv && cv.el) cv.el.style.visibility = single && (P.current[0] || 0) >= 0.999 ? 'hidden' : 'visible';
    for (let j = 1; j <= n; j += 1) {
      const L = els.current[j];
      if (!L || !L.el) continue;
      let hide = false;
      if (single) {
        const turned = (P.current[j] || 0) >= 0.999;
        const cur = stepRef.current;
        const near = Math.abs(j - 1 - cur) <= 1 || (P.current[j] > 0.001 && P.current[j] < 0.999);
        hide = (turned && j - 1 < cur) || !near;
      }
      L.el.style.visibility = hide ? 'hidden' : 'visible';
    }
  }, []);

  /* ── (re)layout: keep everything painted when size / mode changes ────────── */
  useLayoutEffect(() => {
    const n = buildLeaves(mode).length;
    const coverOpen = phaseRef.current !== 'closed' ? 1 : 0;
    // keep the reader on the same page when switching between phone / desktop layouts
    let s = stepRef.current;
    if (modeRef.current !== mode) {
      s = mode === 'single' ? stepToSingle(s) : stepToSpread(s);
      stepRef.current = s;
    }
    modeRef.current = mode;
    s = Math.min(n - 1, Math.max(0, s));
    stepRef.current = s;
    const arr = [P.current[0] ?? coverOpen];
    for (let j = 1; j <= n; j += 1) arr[j] = j - 1 < s ? 1 : 0;
    if (phaseRef.current === 'opening') {
      // never rebuild mid-cinematic
      for (let j = 1; j <= n; j += 1) arr[j] = 0;
    }
    P.current = arr;
    paintAll();
    applyVisibility();
    const { shift } = rig.current;
    if (shift) {
      const open = phaseRef.current !== 'closed' && (phaseRef.current === 'open' || P.current[0] > 0.5);
      gsap.set(shift, { x: mode === 'spread' && open ? pageW / 2 : 0 });
    }
    if (rig.current.shadow) {
      gsap.set(rig.current.shadow, { scaleX: mode === 'spread' && phaseRef.current === 'open' ? 2 : 1 });
    }
    if (phaseRef.current === 'open') {
      setStep(s);
      stepRef.current = s;
      setInSet(new Set(visibleFaces(mode, s)));
    }
  }, [mode, pageW, pageH, T, paintAll, applyVisibility]);

  /* ── ambient idle motion + initial pose ──────────────────────────────────── */
  useLayoutEffect(() => {
    const r = rig.current;
    const small = window.innerWidth < 640;
    gsap.set(r.tilt, { rotateY: small ? -16 : -24, rotateX: small ? -5 : -7 });
    gsap.set(r.camera, { z: 0 });
    return () => {
      timeline.current?.kill();
      floatTl.current?.kill();
      gsap.killTweensOf(Object.values(r).filter(Boolean));
    };
  }, []);

  useEffect(() => {
    if (!ready || reduced || phase !== 'closed') return undefined;
    const r = rig.current;
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut', duration: 3.4 } });
    tl.to(r.float, { y: -12, rotateZ: 0.6, rotateX: 1.4 }, 0).to(r.shadow, { opacity: 0.55, scaleX: 0.92 }, 0);
    floatTl.current = tl;
    return () => tl.kill();
  }, [ready, reduced, phase]);

  /* gentle pointer parallax (desktop) */
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover)').matches) return undefined;
    const r = rig.current;
    const qy = gsap.quickTo(r.parallax, 'rotateY', { duration: 0.9, ease: 'power3.out' });
    const qx = gsap.quickTo(r.parallax, 'rotateX', { duration: 0.9, ease: 'power3.out' });
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      qy(nx * (phaseRef.current === 'closed' ? 9 : 4));
      qx(-ny * (phaseRef.current === 'closed' ? 6 : 2.5));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced]);

  /* ── opening cinematic ───────────────────────────────────────────────────── */
  const open = useCallback(() => {
    if (phaseRef.current !== 'closed' || !ready) return;
    phaseRef.current = 'opening';
    setPhase('opening');

    const r = rig.current;
    const { mode: m, pageW: pw, pageH: ph } = layoutRef.current;
    const startFaces = new Set(visibleFaces(m, 0));
    floatTl.current?.kill();
    const cover = els.current[0];
    const seal = cover.el.querySelector('.seal');
    const clasp = cover.el.querySelector('.clasp');
    const rect = stageRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + layoutRef.current.topPad + (rect.height - layoutRef.current.topPad - layoutRef.current.controlsH) / 2;

    const finish = () => {
      phaseRef.current = 'open';
      stepRef.current = 0;
      setStep(0);
      setPhase('open');
      setInSet(startFaces);
      setStatus('पान १ / ७');
      applyVisibility();
    };

    if (reducedRef.current) {
      P.current[0] = 1;
      gsap.set(r.tilt, { rotateY: 0, rotateX: 0 });
      gsap.set(r.float, { y: 0, rotateZ: 0, rotateX: 0 });
      gsap.set(r.shift, { x: m === 'spread' ? pw / 2 : 0 });
      gsap.set(r.shadow, { scaleX: m === 'spread' ? 2 : 1, opacity: 1 });
      gsap.set(clasp, { display: 'none' });
      paintAll();
      finish();
      return;
    }

    const mobile = window.innerWidth < 640;
    const openDur = 2.3;
    const tl = gsap.timeline({ onComplete: finish });
    timeline.current = tl;

    // 1 · camera glides in, book squares up to the viewer
    tl.to(r.camera, { z: m === 'spread' ? 150 : mobile ? 45 : 90, y: -6, duration: 1.5, ease: 'power2.inOut' }, 0);
    tl.to(r.tilt, { rotateY: 0, rotateX: mobile ? 2 : 5, duration: 1.7, ease: 'power3.inOut' }, 0);
    tl.to(r.float, { y: 0, rotateZ: 0, rotateX: 0, duration: 1.1, ease: 'power2.out' }, 0);
    tl.to(r.shadow, { opacity: 1, duration: 1 }, 0);

    // 2 · the gold seal turns and the clasp slides away
    tl.to(seal, { rotate: 360, scale: 1.18, duration: 0.9, ease: 'power2.inOut' }, 0.15);
    tl.to(clasp, { x: pw * 0.34, opacity: 0, duration: 0.75, ease: 'power3.in' }, 0.95);

    // 3 · the cover swings open, golden light spills out
    const t0 = 1.15;
    const proxy = { p: 0 };
    tl.to(
      proxy,
      {
        p: 1,
        duration: openDur,
        ease: 'power3.inOut',
        onUpdate: () => {
          P.current[0] = proxy.p;
          paint(0);
          paintBlocks();
        },
      },
      t0,
    );
    if (m === 'spread') tl.to(r.shift, { x: pw / 2, duration: openDur, ease: 'power3.inOut' }, t0);
    if (m === 'spread') tl.to(r.shadow, { scaleX: 2, duration: openDur, ease: 'power3.inOut' }, t0);
    tl.fromTo(r.glow, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1.25, duration: 1.8, ease: 'power2.out' }, t0 + 0.2);
    tl.to(r.glow, { opacity: 0.55, scale: 1.05, duration: 2.2, ease: 'sine.inOut' }, t0 + 2.0);
    tl.fromTo(r.rays, { opacity: 0, rotate: -12 }, { opacity: 1, rotate: 0, duration: 2.2, ease: 'power2.out' }, t0 + 0.3);
    tl.to(r.rays, { opacity: 0, duration: 1.5, ease: 'sine.inOut' }, t0 + 1.8);
    tl.call(
      () => {
        fx.current?.burst(cx, cy, 120, 1.1);
        setInSet(startFaces);
      },
      null,
      t0 + openDur * 0.52,
    );
    tl.call(() => fx.current?.burst(cx, cy - ph * 0.1, 60, 0.7), null, t0 + openDur * 0.78);
    tl.call(() => fx.current?.shower(10), null, t0 + openDur * 0.8);

    // 4 · camera settles, book rests
    tl.to(r.camera, { z: 0, y: 0, duration: 1.6, ease: 'power2.out' }, t0 + openDur - 0.5);
    tl.to(r.tilt, { rotateX: mobile ? 2 : 4, duration: 1.4, ease: 'power2.out' }, t0 + openDur - 0.5);
    tl.to(r.prompt, { opacity: 0, y: 18, duration: 0.6, ease: 'power2.in' }, 0);
  }, [ready, paint, paintBlocks, paintAll, applyVisibility]);

  /* ── turning pages ───────────────────────────────────────────────────────── */
  const goTo = useCallback(
    (target, opts = {}) => {
      if (phaseRef.current !== 'open' || busy.current) return;
      const n = buildLeaves(modeRef.current).length;
      const to = Math.max(0, Math.min(n - 1, target));
      const from = stepRef.current;
      if (to === from) return;
      busy.current = true;
      stepRef.current = to;
      setStep(to);

      const m = modeRef.current;
      const union = new Set([...visibleFaces(m, from), ...visibleFaces(m, to)]);
      setInSet(union);
      const pages = visibleFaces(m, to).filter((f) => PAGE_IDS.includes(f));
      setStatus(`पान ${pages.map((p) => PAGE_IDS.indexOf(p) + 1).join('–')} / ${TOTAL_PAGES}`);

      const forward = to > from;
      const lo = Math.min(from, to);
      const hi = Math.max(from, to);
      const indices = [];
      for (let k = lo; k < hi; k += 1) indices.push(k + 1); // leaf j = k+1
      if (!forward) indices.reverse();
      const multi = indices.length > 1;
      const dur = opts.fast || multi ? 0.8 : 1.25;
      const stagger = multi ? 0.12 : 0;

      // visibility must be on for every leaf that will move
      indices.forEach((j) => {
        if (els.current[j]?.el) els.current[j].el.style.visibility = 'visible';
      });
      // single-page layout: the neighbours that become visible need to exist
      const nextVisible = forward ? to : to;
      [nextVisible - 1, nextVisible, nextVisible + 1].forEach((k) => {
        const L = els.current[k + 1];
        if (L?.el) L.el.style.visibility = 'visible';
      });

      if (reducedRef.current) {
        indices.forEach((j) => {
          P.current[j] = forward ? 1 : 0;
          paint(j);
        });
        paintBlocks();
        window.setTimeout(() => {
          setInSet(new Set(visibleFaces(m, to)));
          applyVisibility();
          busy.current = false;
        }, 60);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setInSet(new Set(visibleFaces(modeRef.current, stepRef.current)));
          applyVisibility();
          busy.current = false;
        },
      });
      timeline.current = tl;
      indices.forEach((j, i) => {
        const proxy = { p: P.current[j] };
        tl.to(
          proxy,
          {
            p: forward ? 1 : 0,
            duration: dur,
            ease: forward ? 'power2.inOut' : 'power2.inOut',
            onUpdate: () => {
              P.current[j] = proxy.p;
              paint(j);
              paintBlocks();
            },
          },
          i * stagger,
        );
      });
    },
    [paint, paintBlocks, applyVisibility],
  );

  const next = useCallback(() => {
    const n = buildLeaves(modeRef.current).length;
    if (stepRef.current >= n - 1) goTo(0, { fast: true });
    else goTo(stepRef.current + 1);
  }, [goTo]);
  const prev = useCallback(() => goTo(stepRef.current - 1), [goTo]);

  const goToPage = useCallback(
    (pageIndex) => goTo(stepForPage(modeRef.current, pageIndex)),
    [goTo],
  );

  /* ── input: keyboard + swipe ─────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (phaseRef.current === 'closed') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (stepRef.current < buildLeaves(modeRef.current).length - 1) goTo(stepRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(stepRef.current - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0, { fast: true });
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(buildLeaves(modeRef.current).length - 1, { fast: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  useEffect(() => {
    const el = stageRef.current;
    let sx = 0;
    let sy = 0;
    let st = 0;
    let id = null;
    const down = (e) => {
      if (e.target.closest('.controls, .open-prompt')) return;
      id = e.pointerId;
      sx = e.clientX;
      sy = e.clientY;
      st = performance.now();
    };
    const up = (e) => {
      if (id !== e.pointerId) return;
      id = null;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      const dt = performance.now() - st;
      if (phaseRef.current !== 'open') return;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 900) {
        if (dx < 0) {
          if (stepRef.current < buildLeaves(modeRef.current).length - 1) goTo(stepRef.current + 1);
        } else goTo(stepRef.current - 1);
      }
    };
    const cancel = () => {
      id = null;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', cancel);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
    };
  }, [goTo]);

  /* ── rendering helpers ───────────────────────────────────────────────────── */
  const active = useMemo(() => new Set(phase === 'closed' ? [] : visibleFaces(mode, step)), [mode, step, phase]);

  const renderFace = (id) => {
    const inView = inSet.has(id);
    switch (id) {
      case 'p1': return <PageIntro inView={inView} />;
      case 'p2': return <PageNames inView={inView} />;
      case 'p3': return <PageElephant inView={inView} />;
      case 'p4': return <PageDate inView={inView} />;
      case 'p5': return <PageVenue inView={inView} />;
      case 'p6': return <PageMessage inView={inView} />;
      case 'p7': return <PageRsvp inView={inView} />;
      case 'endpaper': return <Endpaper />;
      default: return <BlankFace />;
    }
  };

  const reg = (j, key) => (node) => {
    if (!els.current[j]) els.current[j] = {};
    els.current[j][key] = node;
  };

  useEffect(() => {
    if (!tooSmall) setRotateSeen(false);
  }, [tooSmall]);

  const visiblePages = visibleFaces(mode, step).filter((f) => PAGE_IDS.includes(f)).map((f) => PAGE_IDS.indexOf(f));
  const lastStep = N - 1;
  const bookStyle = {
    width: pageW,
    height: pageH,
    left: -pageW / 2,
    top: -pageH / 2,
    '--pw': `${pageW}px`,
    '--ph': `${pageH}px`,
    '--T': `${T}px`,
  };

  return (
    <div
      ref={stageRef}
      className={`stage phase-${phase} mode-${mode} ${layout.compact ? 'is-compact' : ''} ${ready ? 'is-ready' : ''}`}
      style={{ '--controls-h': `${layout.controlsH}px`, '--top-pad': `${layout.topPad}px` }}
    >
      <h1 className="sr">शिवानी आणि दिपेश — साखरपुडा समारंभ आमंत्रण</h1>

      {/* atmosphere */}
      <div className="backdrop" aria-hidden="true" />
      <div className="spot" aria-hidden="true" />
      <div className="spot spot-2" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Particles ref={fx} reduced={reduced} dim={phase === 'open'} />
      <div className="toran-top" aria-hidden="true">
        <Toran w={mode === 'spread' ? 1200 : 400} h={mode === 'spread' ? 150 : 110} swags={mode === 'spread' ? 6 : 3} sag={mode === 'spread' ? 26 : 20} />
      </div>

      {/* 3-D scene */}
      <div className="scene">
        <div className="rays" ref={(n) => (rig.current.rays = n)} aria-hidden="true" />
        <div className="glow" ref={(n) => (rig.current.glow = n)} style={{ width: mode === 'spread' ? pageW * 2.5 : pageW * 1.9, height: pageH * 1.45, margin: `${-pageH * 0.725}px 0 0 ${-(mode === 'spread' ? pageW * 1.25 : pageW * 0.95)}px` }} aria-hidden="true" />
        <div className="book-shadow" ref={(n) => (rig.current.shadow = n)} style={{ width: pageW * 1.05, marginLeft: -pageW * 0.525, '--ph': `${pageH}px` }} aria-hidden="true" />
        <div className="camera" ref={(n) => (rig.current.camera = n)}>
          <div className="anchor">
            <div className="rig float" ref={(n) => (rig.current.float = n)}>
              <div className="rig parallax" ref={(n) => (rig.current.parallax = n)}>
                <div className="rig tilt" ref={(n) => (rig.current.tilt = n)}>
                  <div className="rig shift" ref={(n) => (rig.current.shift = n)}>
                    <div className="book" style={bookStyle} role="group" aria-label="आमंत्रण पुस्तक">
                      {/* back board + gilded page-edge blocks */}
                      <div className="board-back" style={{ transform: `translateZ(${-T / 2}px)` }}>
                        <i className="board-grain" />
                      </div>
                      <div className="blocks">
                        <i className="edge rEdge" ref={(n) => (blocks.current.rEdge = n)} style={{ left: pageW - 5, height: pageH - 8, top: 4 }} />
                        <i className="edge hEdge" ref={(n) => (blocks.current.rTop = n)} style={{ left: 0, width: pageW - 5, top: 4 }} />
                        <i className="edge hEdge b" ref={(n) => (blocks.current.rBot = n)} style={{ left: 0, width: pageW - 5, bottom: 4 }} />
                        {mode === 'spread' && (
                          <>
                            <i className="edge lEdge" ref={(n) => (blocks.current.lEdge = n)} style={{ height: pageH - 8, top: 4 }} />
                            <i className="edge hEdge" ref={(n) => (blocks.current.lTop = n)} style={{ left: -(pageW - 5), width: pageW - 5, top: 4 }} />
                            <i className="edge hEdge b" ref={(n) => (blocks.current.lBot = n)} style={{ left: -(pageW - 5), width: pageW - 5, bottom: 4 }} />
                          </>
                        )}
                      </div>

                      {/* leaves (index 0 is the cover) */}
                      <div
                        className="leaf cover"
                        ref={reg(0, 'el')}
                        onClick={phase === 'closed' ? open : undefined}
                      >
                        <div className="face front cover-face" ref={reg(0, 'fFace')}>
                          <div className="face-inner">
                            <CoverFront />
                          </div>
                          <i className="g-groove" />
                          <i className="g-shade" ref={reg(0, 'fShade')} />
                        </div>
                        <div className="face back" inert ref={reg(0, 'bFace')}>
                          <div className="face-inner">
                            <Endpaper />
                          </div>
                          <i className="g-gutter-r" />
                          <i className="g-shade" ref={reg(0, 'bShade')} />
                          <i className="g-cast" ref={reg(0, 'bCast')} />
                          <i className="g-light" ref={reg(0, 'light')} />
                        </div>
                        <i className="cover-edge" />
                      </div>

                      <div key={mode} className="leaves" style={{ display: 'contents' }}>
                        {leaves.map((leaf, i) => {
                          const j = i + 1;
                          const frontOn = active.has(leaf.front);
                          const backOn = active.has(leaf.back);
                          return (
                            <div className="leaf" key={`${mode}-${j}`} ref={reg(j, 'el')} style={{ visibility: 'hidden' }}>
                              <div className="face front" aria-hidden={!frontOn} inert={!frontOn} ref={reg(j, 'fFace')}>
                                <div className="face-inner">{renderFace(leaf.front)}</div>
                                <i className="g-gutter-l" />
                                <i className="g-shade" ref={reg(j, 'fShade')} />
                                <i className="g-cast" ref={reg(j, 'fCast')} />
                                <i className="g-light" ref={reg(j, 'light')} />
                              </div>
                              <div className="face back" aria-hidden={!backOn} inert={!backOn} ref={reg(j, 'bFace')}>
                                <div className="face-inner">{renderFace(leaf.back)}</div>
                                <i className="g-gutter-r" />
                                <i className="g-shade" ref={reg(j, 'bShade')} />
                                <i className="g-cast" ref={reg(j, 'bCast')} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "open the invitation" prompt */}
      <div className="open-prompt" ref={(n) => (rig.current.prompt = n)} data-hidden={phase !== 'closed'}>
        <button type="button" className="btn-gold open-btn" onClick={open} disabled={!ready || phase !== 'closed'}>
          <span className="open-btn-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 5.5C6 4.3 9.2 4.3 12 6c2.8-1.7 6-1.7 9-.5v13c-3-1.2-6.2-1.2-9 .5-2.8-1.7-6-1.7-9-.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 6v13" stroke="currentColor" strokeWidth="1.8" /></svg>
          </span>
          <span key={uiKey} {...noTranslate}>
            {ui.open}
          </span>
        </button>
        <p className="open-hint" aria-hidden="true" key={uiKey} {...noTranslate}>
          {ui.openHint}
        </p>
        {layout.compact && (
          <p className="rotate-hint" key={uiKey} {...noTranslate}>
            {ui.rotate}
          </p>
        )}
      </div>

      {/* navigation */}
      <Controls
        visible={phase === 'open'}
        step={step}
        lastStep={lastStep}
        visiblePages={visiblePages}
        total={TOTAL_PAGES}
        onPrev={prev}
        onNext={next}
        onGoto={goToPage}
      />

      {tooSmall && !rotateSeen && (
        <div className="rotate-overlay" role="dialog" aria-modal="true" aria-label={ui.rotateTitle}>
          <svg className="rotate-phone" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="20" y="6" width="24" height="44" rx="4" fill="none" stroke="url(#gold)" strokeWidth="2.6" />
            <path d="M29 11h6" stroke="url(#gold)" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 56c10 6 30 6 40 0m0 0-5-1m5 1 1-5" fill="none" stroke="url(#gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="rotate-title gold-emboss" {...noTranslate} key={`t-${uiKey}`}>
            {ui.rotateTitle}
          </p>
          <p className="rotate-body" {...noTranslate} key={`b-${uiKey}`}>
            {ui.rotateBody}
          </p>
          <button type="button" className="btn-gold" onClick={() => setRotateSeen(true)} autoFocus>
            <span {...noTranslate} key={`g-${uiKey}`}>
              {ui.rotateGo}
            </span>
          </button>
        </div>
      )}
      <div className="sr" aria-live="polite">
        <span key={status}>{status}</span>
      </div>

      {!ready && (
        <div className="preload" role="status" aria-label="लोड होत आहे">
          <span className="preload-ring" />
        </div>
      )}
    </div>
  );
}
