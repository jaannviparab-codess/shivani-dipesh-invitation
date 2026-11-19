import { useEffect, useState } from 'react';

function compute(target) {
  const diff = target - Date.now();
  if (diff <= 0) return { done: true, d: 0, h: 0, m: 0, s: 0 };
  const total = Math.floor(diff / 1000);
  return {
    done: false,
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * Live countdown to `target` (epoch ms). Always derived from Date.now(), never
 * from a hard-coded value or an accumulating counter, so it can't drift.
 * `active` pauses the timer while the page is not on screen (saves battery).
 */
export function useCountdown(target, active = true) {
  const [left, setLeft] = useState(() => compute(target));

  useEffect(() => {
    if (!active) return undefined;
    setLeft(compute(target));
    let timer;
    const tick = () => {
      const next = compute(target);
      setLeft(next);
      if (next.done) return;
      // re-align to the next whole second so the digits flip on time
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => window.clearTimeout(timer);
  }, [target, active]);

  return left;
}
