# शिवानी ♥ दिपेश — साखरपुडा समारंभ · Royal 3D Invitation

A cinematic, fully animated Marathi ring-ceremony invitation. A realistic 3-D
invitation book (deep green leather, antique-gold embossing, gold clasp, gilded
page edges) opens with a camera move, golden light and a particle burst, then
reveals seven hand-crafted pages that turn like real paper.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

### Deploying to Vercel

Import the folder (or push it to Git and import the repo) — Vercel detects Vite automatically and
`vercel.json` already sets the build command, the `dist` output folder and long-term caching for
the hashed files in `/assets`. Nothing else to configure.

`dist/` is plain static files with relative paths — upload it to Netlify, Vercel,
GitHub Pages, Cloudflare Pages, S3 or any web host and share the link on WhatsApp.
(Open it through a web server; browsers block ES modules from `file://`.)

## Where to change things

Everything personal is in **`src/config.js`**: ceremony date/time (IST), the exact
Google Maps link and the RSVP contact name / phone.
Page wording lives in `src/components/Pages.jsx` and `src/components/Faces.jsx`.

## The pages

| # | Content |
|---|---------|
| Cover | ॥ श्री गणेशाय नमः ॥ · शिवानी ♥ दिपेश · साखरपुडा समारंभ · gold clasp · **आमंत्रण उघडा** |
| 1 | Auspicious invocation (Ganesh, Bhagwati Devi, Kedarling) under a marigold toran |
| 2 | Bride & groom with parents, interlocking rings |
| 3 | Caparisoned ceremonial elephant in a golden arch (animated trunk, ear, tail, bells) |
| 4 | Date, time and a live countdown (calculated from `2026-12-03T17:00:00+05:30`) |
| 5 | Venue with temple art and the **स्थळ पहा** Google Maps button |
| 6 | Invitation message with word-by-word reveal |
| 7 | RSVP blessing, contact name and phone (tap to call), blooming lotus finale |

On phones the book shows one page at a time; on wide screens it opens as a
two-page spread (pages 2–3, 4–5 and 6–7 share a spread). The layout switches
live if the window is resized or the phone is rotated.

## How it is built

* **React + Vite**, **GSAP** for the cinematic timelines, pure **CSS 3-D** for the book.
  Real DOM text keeps the Devanagari crisp, selectable by screen readers and tiny
  to download — the whole app is ≈ 120 kB gzip plus three self-hosted fonts that
  are loaded by Unicode subset.
* Every ornament (lotus, elephant, temple, toran, rings, corner flourishes…) is
  drawn in SVG — no images to download.
* One shared `<canvas>` draws the floating gold dust, petals and bursts.
* Pages are measured in `cqw` (container-query units), so each page is a perfect
  scaled copy of the design at any size, with a JS-free fallback for older browsers.
* Fonts: Noto Serif Devanagari (text), Tiro Devanagari Marathi (names), Yatra One
  (royal headings) — bundled via `@fontsource`, no external requests.

## Accessibility & performance

* Fully keyboard-operable (← → PageUp/PageDown Home End; visible gold focus rings),
  swipe on touch, labelled buttons, `aria-live` page announcements, hidden pages
  are `inert`, 44 px+ touch targets.
* `prefers-reduced-motion` → no 3-D swings, no particles, content shown instantly
  (add `?reduced` to the URL to preview it).
* Entrance and ambient animations run only on pages that are on screen; off-screen
  leaves are removed from rendering on phones; the canvas is DPR-capped; all
  timers, listeners and tweens are cleaned up on unmount.
