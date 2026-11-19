// One lightweight canvas for the whole experience:
//   • slowly floating gold dust
//   • drifting marigold / rose / jasmine petals
//   • on-demand gold bursts (book opening, closing page)
// Sprites are pre-rendered once, so each frame is just a few drawImage calls.
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

function glowSprite(size, inner, mid) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.28, mid);
  grd.addColorStop(1, 'rgba(240,200,90,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

function petalSprite(c1, c2) {
  const w = 28;
  const h = 44;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, c1);
  grd.addColorStop(1, c2);
  g.fillStyle = grd;
  g.beginPath();
  g.moveTo(w / 2, 2);
  g.bezierCurveTo(w + 2, h * 0.25, w - 2, h * 0.85, w / 2, h - 2);
  g.bezierCurveTo(2, h * 0.85, -2, h * 0.25, w / 2, 2);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,.28)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(w / 2, 6);
  g.lineTo(w / 2, h - 8);
  g.stroke();
  return c;
}

const rand = (a, b) => a + Math.random() * (b - a);

const Particles = forwardRef(function Particles({ reduced = false, dim = false }, ref) {
  const canvasRef = useRef(null);
  const S = useRef({ dust: [], petals: [], sparks: [], w: 0, h: 0, dpr: 1, dim: false });
  S.current.dim = dim;

  useImperativeHandle(
    ref,
    () => ({
      /** gold sparks flying out of (x, y) in CSS pixels */
      burst(x, y, count = 80, power = 1) {
        if (reduced) return;
        const s = S.current;
        const n = s.w < 700 ? Math.round(count * 0.6) : count;
        for (let i = 0; i < n; i += 1) {
          const a = rand(0, Math.PI * 2);
          const sp = rand(40, 260) * power;
          s.sparks.push({
            x,
            y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp * 0.8 - rand(10, 70),
            life: 0,
            max: rand(1.1, 2.6),
            r: rand(3, 9),
          });
        }
      },
      /** shower of petals from the top of the screen */
      shower(count = 18) {
        if (reduced) return;
        const s = S.current;
        for (let i = 0; i < count; i += 1) s.petals.push(makePetal(s, true));
      },
    }),
    [reduced],
  );

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = S.current;
    const glow = glowSprite(48, 'rgba(255,244,196,1)', 'rgba(240,200,90,.6)');
    const spark = glowSprite(64, 'rgba(255,250,220,1)', 'rgba(255,214,110,.75)');
    const sprites = [
      petalSprite('#ffb02e', '#e8741b'),
      petalSprite('#ffd54a', '#e59a10'),
      petalSprite('#e9566c', '#9c1a33'),
      petalSprite('#fffaf0', '#e3d6aa'),
    ];
    s.sprites = sprites;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      s.w = w;
      s.h = h;
      s.dpr = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const dustN = Math.min(70, Math.round((w * h) / 16000));
      while (s.dust.length < dustN) s.dust.push(makeDust(s));
      s.dust.length = dustN;
      const petalN = w < 700 ? 7 : 13;
      while (s.petals.length < petalN) s.petals.push(makePetal(s, false));
      s.petals.length = Math.max(petalN, Math.min(s.petals.length, petalN + 24));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h, dpr } = s;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      const fade = s.dim ? 0.55 : 1;

      // dust
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < s.dust.length; i += 1) {
        const p = s.dust[i];
        p.y -= p.v * dt;
        p.x += Math.sin(t * p.f + p.ph) * p.sw * dt;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = rand(0, w);
        }
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph));
        ctx.globalAlpha = p.a * tw * fade;
        ctx.drawImage(glow, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      // sparks
      for (let i = s.sparks.length - 1; i >= 0; i -= 1) {
        const p = s.sparks[i];
        p.life += dt;
        if (p.life >= p.max) {
          s.sparks.splice(i, 1);
          continue;
        }
        p.vx *= 1 - 1.4 * dt;
        p.vy = p.vy * (1 - 1.1 * dt) + 22 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = Math.min(1, k * 1.6);
        const r = p.r * (0.5 + k * 0.7);
        ctx.drawImage(spark, p.x - r, p.y - r, r * 2, r * 2);
      }

      // petals
      ctx.globalCompositeOperation = 'source-over';
      for (let i = s.petals.length - 1; i >= 0; i -= 1) {
        const p = s.petals[i];
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(t * p.f + p.ph) * p.sw) * dt;
        p.rot += p.vr * dt;
        if (p.y > h + 40 || p.x < -60 || p.x > w + 60) {
          if (p.once) {
            s.petals.splice(i, 1);
            continue;
          }
          Object.assign(p, makePetal(s, false), { y: -30 });
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(p.size, p.size * (0.35 + 0.65 * Math.abs(Math.cos(t * p.flip + p.ph))));
        ctx.globalAlpha = p.a * fade;
        ctx.drawImage(s.sprites[p.sp], -14, -22);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
});

function makeDust(s) {
  return {
    x: rand(0, s.w),
    y: rand(0, s.h),
    r: rand(2.5, 7),
    v: rand(4, 14),
    a: rand(0.25, 0.8),
    sw: rand(2, 9),
    f: rand(0.2, 0.7),
    tw: rand(0.6, 1.8),
    ph: rand(0, 6.28),
  };
}

function makePetal(s, once) {
  return {
    x: rand(0, s.w),
    y: once ? rand(-80, -10) : rand(-40, s.h),
    vy: rand(16, 38),
    vx: rand(-8, 10),
    sw: rand(14, 34),
    f: rand(0.4, 1),
    ph: rand(0, 6.28),
    rot: rand(0, 6.28),
    vr: rand(-1, 1),
    flip: rand(0.8, 2.2),
    size: rand(0.5, 0.95) * (s.w < 700 ? 0.8 : 1),
    a: rand(0.55, 0.9),
    sp: Math.floor(rand(0, 4)),
    once,
  };
}

export default Particles;
