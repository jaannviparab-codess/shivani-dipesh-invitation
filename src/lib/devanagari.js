const DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/** 7 -> "७", 5 padded to 2 -> "०५".  `latin: true` keeps Western digits (7, 05). */
export function toDevanagari(value, pad = 0, latin = false) {
  const text = String(Math.max(0, Math.floor(value))).padStart(pad, '0');
  return latin ? text : text.replace(/\d/g, (d) => DIGITS[Number(d)]);
}
