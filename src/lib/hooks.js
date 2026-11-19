import { useEffect, useState, useSyncExternalStore } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    // `?reduced` forces the reduced-motion experience (handy for testing)
    if (new URLSearchParams(window.location.search).has('reduced')) return true;
    return window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  });
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches || new URLSearchParams(window.location.search).has('reduced'));
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * Language the page is currently shown in, watched on <html>:
 *   'mr'    – the original Marathi
 *   'en'    – the visitor used the browser's "Translate to English"
 *   'other' – translated into some other language
 * Chrome / Edge set <html lang="…"> and a `translated-*` class when they translate.
 */
const langListeners = new Set();
let langObserver = null;

function readUiLang() {
  const el = document.documentElement;
  const lang = (el.getAttribute('lang') || 'mr').toLowerCase();
  if (lang.startsWith('en')) return 'en';
  if (!lang.startsWith('mr') || /translated-/.test(el.className)) return 'other';
  return 'mr';
}

function subscribeLang(cb) {
  langListeners.add(cb);
  if (!langObserver) {
    langObserver = new MutationObserver(() => langListeners.forEach((fn) => fn()));
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
  }
  return () => {
    langListeners.delete(cb);
    if (!langListeners.size && langObserver) {
      langObserver.disconnect();
      langObserver = null;
    }
  };
}

export function useUiLang() {
  return useSyncExternalStore(subscribeLang, readUiLang, () => 'mr');
}

/** true while the page is shown in any language other than Marathi */
export function useTranslated() {
  return useUiLang() !== 'mr';
}
