// ─────────────────────────────────────────────────────────────────────────────
//  Everything that may need editing lives here: dates, links and contact.
// ─────────────────────────────────────────────────────────────────────────────

// Ceremony: Thursday, 3 December 2026, 5:00 PM India Standard Time (UTC+05:30).
// The explicit +05:30 offset makes the countdown correct in every time zone.
export const EVENT_ISO = '2026-12-03T17:00:00+05:30';
export const EVENT_TIME = new Date(EVENT_ISO).getTime();

// Exact Google Maps link supplied for the venue (opens the Maps app on phones
// that have it, otherwise Maps in the browser — guests can tap "Directions").
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Shri+Ram+Mandir+Shri+Vaishnav+Ashram+Trust+Mangal+Karyalaya+Janta+Colony+Western+Express+Highway+Jogeshwari+East+Mumbai+400060';

// RSVP contact
export const RSVP_NAME = 'शुभम श्रीकृष्ण पेडणेकर';
export const RSVP_PHONE_DISPLAY = '+91 86527 62542';
export const RSVP_PHONE_TEL = '+918652762542';

// Book proportions (width / height of ONE page).
export const PAGE_ASPECT = 0.68;
