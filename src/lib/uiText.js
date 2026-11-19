// Interface wording (buttons, hints) in Marathi and English.
//
// When a visitor translates the page to English, the browser's translator sometimes
// leaves a short label untouched (e.g. "पुढचे पान" stayed Marathi next to a translated
// "Back page"). So in English mode the interface controls use these exact English
// words, marked translate="no", instead of depending on the translator.
// The invitation's own wording is left to the browser's translation.
import { useUiLang } from './hooks.js';

export const UI = {
  mr: {
    nav: 'पान नेव्हिगेशन',
    prev: 'मागचे पान',
    next: 'पुढचे पान',
    again: 'पुन्हा पहा',
    page: 'पान',
    open: 'आमंत्रण उघडा',
    openHint: 'पुस्तकाला स्पर्श करा',
    rotate: 'उत्तम अनुभवासाठी फोन उभा धरा',
    rotateTitle: 'कृपया फोन उभा धरा',
    rotateBody: 'आमंत्रण स्पष्ट वाचण्यासाठी फोन उभा (पोर्ट्रेट) स्थितीत वापरा.',
    rotateGo: 'तरीही पहा',
    days: 'दिवस',
    hours: 'तास',
    minutes: 'मिनिटे',
    seconds: 'सेकंद',
    countdown: 'समारंभास उरलेला वेळ',
  },
  en: {
    nav: 'Page navigation',
    prev: 'Previous page',
    next: 'Next page',
    again: 'Watch again',
    page: 'Page',
    open: 'Open invitation',
    openHint: 'Tap the book',
    rotate: 'Hold your phone upright for the best view',
    rotateTitle: 'Please hold your phone upright',
    rotateBody: 'The invitation is easiest to read in portrait.',
    rotateGo: 'View anyway',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    countdown: 'Time remaining for the ceremony',
  },
};

/** { t: strings, k: key suffix, no: props to spread on text we must keep exactly as written } */
export function useUi() {
  const lang = useUiLang();
  const english = lang === 'en';
  // `k` is used as a React key so a text label is swapped as a whole element when the
  // language flips, never edited in place (the translator replaces text nodes).
  return { t: english ? UI.en : UI.mr, english, k: english ? 'en' : 'mr', no: english ? { translate: 'no' } : {} };
}
