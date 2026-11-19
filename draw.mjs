// draw.mjs: writes front.svg, a one-page front page of the world's news of Thursday 19 November 2026.
// Render: node draw.mjs && rsvg-convert -w 1024 -h 1024 front.svg -o entry.png
// Every item is written in our own words from reporting dated 18-19 November 2026. Events still under way
// when the page was drawn are worded as under way; nothing is stated as an outcome before it was reported.
import { writeFileSync } from 'node:fs';

const W = 1024, H = 1024;
const C = {
  paper: '#f7f2e7', card: '#fffdf8', ink: '#15171c', body: '#2c2f36', muted: '#666a72', red: '#b3261e', rule: '#2b2e35',
  europe: '#2f5fa7', americas: '#2e7d4f', asia: '#b3261e', mideast: '#c76b1e', africa: '#7a5230', oceania: '#6b4fa0',
  sea: '#20354d', land: '#d9c9a3',
};
const SERIF = 'DejaVu Serif, Georgia, serif';
const SANS = 'Fira Sans, DejaVu Sans, Arial, sans-serif';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Greedy word wrap by an estimated glyph width (em fraction per character).
function wrap(text, width, size, em = 0.5) {
  const max = Math.max(4, Math.floor(width / (size * em)));
  const out = []; let line = '';
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}
function text(x, y, s, { size, font = SANS, weight = 400, fill = C.ink, anchor = 'start', italic = false, ls = 0 }) {
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${italic ? ' font-style="italic"' : ''}${ls ? ` letter-spacing="${ls}"` : ''}>${esc(s)}</text>`;
}
// A wrapped block; returns [svg, height used].
function block(x, y, s, width, opts) {
  const lh = opts.lh ?? opts.size * 1.2;
  const ls = wrap(s, width, opts.size, opts.em ?? 0.5).slice(0, opts.maxLines ?? 99);
  return [ls.map((l, i) => text(x, y + i * lh, l, opts)).join(''), ls.length * lh];
}

// ---------- the stories ----------
const hero = [
  { n: 1, place: 'SHENZHEN · DIPLOMACY', region: 'asia', art: 'summit',
    head: 'Trump, Xi and Putin hold first three-way summit',
    body: 'The US, Chinese and Russian leaders meet on the APEC sidelines; the Iran war, nuclear arms and Ukraine are on the table. No deal is expected.' },
  { n: 2, place: 'NEW YORK · MARKETS', region: 'americas', art: 'ipo',
    head: 'Anthropic makes its Nasdaq debut as ANT',
    body: 'The AI company priced its listing at $83 a share, above its $70-78 range. First trades today, with heavy retail demand expected.' },
  { n: 3, place: 'WORLDWIDE · GAMES', region: 'americas', art: 'game',
    head: 'GTA VI goes on sale after years of delays',
    body: 'Rockstar’s game unlocks at midnight local time on PS5 and Xbox Series X|S. Pre-orders topped an estimated $1.5bn (Sensor Tower). No PC date yet.' },
];
const row2 = [
  { n: 4, place: 'THE HAGUE · LAW', region: 'europe', art: 'court',
    head: 'World Court gives Rohingya genocide judgment',
    body: 'Final ruling in The Gambia v. Myanmar, filed in 2019. A first finding that a state committed genocide is possible.' },
  { n: 5, place: 'ANTALYA · CLIMATE', region: 'mideast', art: 'climate',
    head: 'COP31 races to its Friday close',
    body: 'A new draft is awaited; the Arab Group and Russia rejected the first, which urged faster moves off fossil fuels.' },
  { n: 6, place: 'GULF · WAR', region: 'mideast', art: 'gulf',
    head: 'Gulf on alert after Iranian drone attacks',
    body: 'Bahrain and Kuwait targeted after US strikes on Iran’s Qeshm island; Gulf states and the Arab League condemn Tehran.' },
  { n: 7, place: 'BERLIN · UKRAINE', region: 'europe', art: 'berlin',
    head: 'Ukraine’s allies meet in Berlin',
    body: 'Merz hosts some 40 delegations of the Coalition of the Willing on security guarantees and 2027 military aid.' },
  { n: 8, place: 'SEOUL · EDUCATION', region: 'asia', art: 'exam',
    head: '551,864 sit Korea’s suneung',
    body: 'The nation slows for the college entrance exam: offices open at 10am and flights pause for the listening test.' },
];
const briefs = [
  { n: 9, place: 'SHENZHEN', region: 'asia', t: 'Xi closes APEC urging free trade and AI cooperation; Putin says sanctions have backfired.' },
  { n: 10, place: 'SHENZHEN', region: 'asia', t: 'Japan’s Takaichi on her first China trip as PM; no formal talks with Xi expected.' },
  { n: 11, place: 'ODISHA', region: 'asia', t: 'Cyclone Akvan nears India’s coast: about 50,000 evacuated, red alert in 11 districts, schools shut.' },
  { n: 12, place: 'FLORES', region: 'asia', t: 'A magnitude 5.8 quake strikes near Ruteng, Indonesia; no casualties reported.' },
  { n: 13, place: 'NEW DELHI', region: 'asia', t: 'Government tells Supreme Court the Air India crash probe is near its end.' },
  { n: 14, place: 'WASHINGTON', region: 'americas', t: 'Trump weighs a new Iran offensive and claims an “indication” Tehran seeks biological weapons.' },
  { n: 15, place: 'FLORIDA', region: 'americas', t: 'Schools stay shut in Broward after 15 inches of rain flooded Hollywood.' },
  { n: 16, place: 'BENTONVILLE', region: 'americas', t: 'Walmart reports third-quarter results before the bell.' },
  { n: 17, place: 'MEXICO CITY', region: 'americas', t: 'Peso slides on fears of a Fed rate rise.' },
  { n: 18, place: 'LIMA', region: 'americas', t: 'Peru declares a fuel emergency.' },
  { n: 19, place: 'VANDENBERG', region: 'americas', t: 'SpaceX set to fly the USSF-317 Space Force mission tonight.' },
  { n: 20, place: 'GAZA', region: 'mideast', t: 'Israeli tanks hold east of Nuseirat, across the Yellow Line; Hamas calls it a truce breach.' },
  { n: 21, place: 'RIYADH', region: 'mideast', t: 'Saudi-led coalition says it repelled Houthi missiles fired at the capital and the south.' },
  { n: 22, place: 'HORMUZ', region: 'mideast', t: 'ADNOC ship attacked in the strait; one crew member missing.' },
  { n: 23, place: 'KINSHASA', region: 'africa', t: 'Congo’s Ebola outbreak passes 11,000 cases; WHO says it is not under control.' },
  { n: 24, place: 'ADDIS ABABA', region: 'africa', t: 'Ethiopia and Eritrea mass forces on their border, monitors say.' },
  { n: 25, place: 'DAKAR', region: 'africa', t: 'Senegal’s ruling Pastef expels President Faye.' },
  { n: 26, place: 'KHARTOUM', region: 'africa', t: 'UN: over 2,230 civilians killed in Sudan Jan–Oct, most by drones.' },
  { n: 27, place: 'BRUSSELS', region: 'europe', t: 'EU ministers take up the 2028–34 budget and the rule of law.' },
  { n: 28, place: 'KYIV', region: 'europe', t: 'Ukraine warns of fake government and media sites tied to Russia.' },
  { n: 29, place: 'TURIN', region: 'europe', t: 'ATP Finals round-robin decides the last semi-final places.' },
  { n: 30, place: 'COOK ISLANDS', region: 'oceania', t: 'Cyclone Xavier moves over the islands.' },
  { n: 31, place: 'NEW ZEALAND', region: 'oceania', t: '24 sperm whales strand on a northern beach.' },
  { n: 32, place: 'AUSTRALIA', region: 'oceania', t: 'Teenager charged with terrorism offences after bomb materials seized.' },
  { n: 33, place: 'CRICKET', region: 'oceania', t: 'Henry Nicholls hits his 12th Test century as NZ get on top of India.' },
];
// Map positions (lon, lat) for the numbered stories.
const where = {
  1: [114, 22.5], 2: [-74, 40.7], 4: [4.3, 52.1], 5: [30.7, 36.9], 6: [50.6, 26.2], 7: [13.4, 52.5], 8: [127, 37.5],
  11: [85.8, 19.8], 12: [120.5, -8.6], 13: [77.2, 28.6], 14: [-77, 38.9], 15: [-80.2, 26], 17: [-99.1, 19.4], 18: [-77, -12],
  19: [-120.6, 34.7], 20: [34.4, 31.4], 21: [46.7, 24.7], 23: [15.3, -4.3], 24: [38.7, 9], 25: [-17.4, 14.7], 26: [32.5, 15.5],
  28: [30.5, 50.4], 30: [-159.8, -21.2], 31: [174, -36], 32: [151, -33.9],
};
const ALL = [...hero, ...row2, ...briefs];
const count = (r) => ALL.filter((s) => s.region === r).length;

// ---------- small original illustrations ----------
// Each drawing is clipped to its own box so no shape spills onto the headline below it.
let clipN = 0;
function art(kind, x, y, w, h) {
  const id = `art${clipN++}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${artBody(kind, x, y, w, h)}</g>`;
}
function artBody(kind, x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const bg = (c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  switch (kind) {
    case 'summit': {
      const flag = (fx, fy, cols) => cols.map((c, i) => `<rect x="${fx}" y="${fy + i * 6}" width="24" height="6" fill="${c}"/>`).join('') + `<line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy + 40}" stroke="${C.ink}" stroke-width="1.5"/>`;
      return bg('#e9dfc8') + `<ellipse cx="${cx}" cy="${y + h - 14}" rx="${w * 0.38}" ry="12" fill="#cbb995" stroke="${C.ink}"/>` +
        [-1, 0, 1].map((d) => `<circle cx="${cx + d * 60}" cy="${y + h - 46}" r="11" fill="#7a6a55" stroke="${C.ink}"/><path d="M ${cx + d * 60 - 17} ${y + h - 18} Q ${cx + d * 60} ${y + h - 44} ${cx + d * 60 + 17} ${y + h - 18} Z" fill="#33363d"/>`).join('') +
        flag(cx - 92, y + 6, ['#b22234', '#fff', '#3c3b6e']) + flag(cx - 12, y + 4, ['#de2910', '#de2910', '#ffde00']) + flag(cx + 70, y + 6, ['#fff', '#0039a6', '#d52b1e']);
    }
    case 'ipo': {
      const pts = [[0, 0.75], [0.15, 0.62], [0.3, 0.68], [0.45, 0.45], [0.6, 0.5], [0.75, 0.3], [0.9, 0.22]];
      const path = pts.map(([px, py], i) => `${i ? 'L' : 'M'} ${x + 14 + px * (w - 28)} ${y + py * h}`).join(' ');
      return bg('#123a33') + `<path d="${path}" fill="none" stroke="#7fe0b8" stroke-width="3"/>` +
        text(x + 12, y + 22, 'ANT', { size: 18, weight: 700, fill: '#fff' }) + text(x + w - 12, y + 22, '$83', { size: 18, weight: 700, fill: '#ffd166', anchor: 'end' }) +
        text(x + 12, y + h - 8, 'NASDAQ · FIRST DAY', { size: 10, weight: 700, fill: '#9fd6c3', ls: 1 });
    }
    case 'game':
      return bg('#2a1840') + `<circle cx="${cx}" cy="${y + h * 0.78}" r="${h * 0.34}" fill="#ff8a3d"/>` +
        [[0.05, 0.45], [0.16, 0.3], [0.28, 0.5], [0.62, 0.35], [0.75, 0.2], [0.88, 0.42]].map(([px, ph]) => `<rect x="${x + px * w}" y="${y + h * ph}" width="${w * 0.1}" height="${h * (1 - ph)}" fill="#4b2d6e"/>`).join('') +
        `<path d="M ${x + w * 0.42} ${y + h} L ${x + w * 0.45} ${y + h * 0.35} L ${x + w * 0.47} ${y + h} Z" fill="#2e7d4f"/>` +
        text(cx, y + 16, 'OUT TODAY', { size: 10, weight: 700, fill: '#ffd166', anchor: 'middle', ls: 2 });
    case 'court':
      return bg('#e7e1d3') + `<path d="M ${cx - 40} ${y + 18} L ${cx} ${y + 6} L ${cx + 40} ${y + 18} Z" fill="#b9ad94" stroke="${C.ink}"/>` +
        [-30, -10, 10, 30].map((d) => `<rect x="${cx + d - 3}" y="${y + 19}" width="6" height="${h - 32}" fill="#cfc4ac" stroke="${C.ink}" stroke-width="0.8"/>`).join('') +
        `<rect x="${cx - 44}" y="${y + h - 13}" width="88" height="7" fill="#b9ad94" stroke="${C.ink}"/>`;
    case 'climate':
      return bg('#dfeee0') + `<circle cx="${x + w - 26}" cy="${y + 16}" r="10" fill="#f2a33a"/>` +
        `<path d="M ${x} ${y + h} Q ${cx} ${y + h * 0.35} ${x + w} ${y + h} Z" fill="#7fae6a"/>` +
        `<line x1="${x + 30}" y1="${y + h}" x2="${x + 30}" y2="${y + 14}" stroke="${C.ink}" stroke-width="1.5"/><circle cx="${x + 30}" cy="${y + 14}" r="5" fill="none" stroke="${C.ink}"/>`;
    case 'gulf':
      return bg('#bcd3dc') + `<path d="M ${x} ${y} L ${x + w * 0.4} ${y} Q ${x + w * 0.25} ${cy} ${x + w * 0.45} ${y + h} L ${x} ${y + h} Z" fill="${C.land}"/>` +
        `<path d="M ${x + w} ${y} L ${x + w * 0.62} ${y} Q ${x + w * 0.8} ${cy} ${x + w * 0.6} ${y + h} L ${x + w} ${y + h} Z" fill="${C.land}"/>` +
        `<path d="M ${cx} ${cy - 13} L ${cx + 12} ${cy + 9} L ${cx - 12} ${cy + 9} Z" fill="${C.red}"/>` + text(cx, cy + 7, '!', { size: 13, weight: 700, fill: '#fff', anchor: 'middle' });
    case 'berlin': {
      // A columned gate under the blue and yellow of Ukraine.
      const gw = w * 0.56, gx = cx - gw / 2, top = y + 14;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h / 2}" fill="#2f6fc0"/><rect x="${x}" y="${y + h / 2}" width="${w}" height="${h / 2}" fill="#f5c518"/>` +
        `<rect x="${gx}" y="${top}" width="${gw}" height="8" fill="#efe8d6" stroke="${C.ink}" stroke-width="0.8"/>` +
        [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${gx + 3 + i * (gw - 10) / 5}" y="${top + 8}" width="4" height="${h - 30}" fill="#efe8d6" stroke="${C.ink}" stroke-width="0.6"/>`).join('') +
        `<rect x="${gx - 4}" y="${y + h - 8}" width="${gw + 8}" height="5" fill="#efe8d6" stroke="${C.ink}" stroke-width="0.8"/>`;
    }
    case 'plan':
      return bg('#2b2e35') + `<rect x="${cx - 20}" y="${y + 10}" width="40" height="${h - 20}" fill="#f2efe6"/>` +
        [0, 1, 2, 3].map((i) => `<line x1="${cx - 14}" y1="${y + 18 + i * 8}" x2="${cx + 14}" y2="${y + 18 + i * 8}" stroke="#999" stroke-width="2"/>`).join('') +
        text(cx, y + h - 13, '?', { size: 14, weight: 700, fill: C.red, anchor: 'middle' });
    case 'exam':
      return bg('#e8e4f2') + [0, 1, 2, 3, 4].map((i) => `<rect x="${x + 12 + i * (w - 24) / 5}" y="${y + 14}" width="${(w - 24) / 5 - 6}" height="${h - 26}" fill="#fff" stroke="${C.ink}" stroke-width="0.8"/><line x1="${x + 16 + i * (w - 24) / 5}" y1="${y + 22}" x2="${x + 8 + (i + 1) * (w - 24) / 5 - 6}" y2="${y + 22}" stroke="#aaa"/>`).join('');
  }
  return '';
}

// ---------- simple world map (coarse continents, our own outline) ----------
const continents = [
  [[-168, 66], [-140, 70], [-95, 72], [-62, 60], [-55, 50], [-80, 25], [-97, 16], [-80, 8], [-105, 20], [-118, 33], [-125, 48], [-150, 58]],
  [[-80, 10], [-60, 8], [-35, -6], [-40, -22], [-58, -38], [-70, -54], [-75, -40], [-72, -18], [-81, -4]],
  [[-10, 36], [-8, 44], [-2, 48], [-5, 58], [10, 62], [28, 71], [60, 70], [100, 76], [140, 72], [180, 66], [160, 58], [140, 42], [122, 30], [108, 18], [104, 2], [92, 20], [78, 8], [70, 22], [57, 25], [48, 30], [36, 32], [28, 37], [12, 38], [0, 38]],
  [[-17, 21], [-10, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [32, -28], [20, -35], [12, -18], [9, 4], [-8, 4]],
  [[36, 32], [48, 30], [57, 25], [58, 17], [44, 12], [38, 20]],
  [[114, -22], [130, -12], [143, -11], [153, -27], [146, -39], [131, -32], [115, -34]],
  [[166, -46], [172, -40], [178, -37], [174, -42], [168, -46]],
];
function worldMap(x, y, w, h) {
  const px = (lon) => x + ((lon + 180) / 360) * w;
  const py = (lat) => y + ((80 - lat) / 140) * h;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.sea}"/>`;
  s += continents.map((poly) => `<path d="${poly.map(([lo, la], i) => `${i ? 'L' : 'M'} ${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join(' ')} Z" fill="${C.land}" stroke="#b9a77d" stroke-width="0.6"/>`).join('');
  for (const [n, [lo, la]] of Object.entries(where)) {
    const st = ALL.find((t) => t.n === Number(n));
    s += `<circle cx="${px(lo).toFixed(1)}" cy="${py(la).toFixed(1)}" r="6.5" fill="${C[st.region]}" stroke="#fff" stroke-width="1"/>` +
      text(px(lo).toFixed(1), (py(la) + 3).toFixed(1), n, { size: 7.5, weight: 700, fill: '#fff', anchor: 'middle' });
  }
  return s;
}

// ---------- page ----------
const P = [];
P.push(`<rect width="${W}" height="${H}" fill="${C.paper}"/>`);
P.push(text(24, 26, 'THE WORLD IN ONE DAY', { size: 15, weight: 700, fill: C.red, ls: 2 }));
P.push(text(W - 24, 26, `WORLD NEWS · ONE PAGE · ${ALL.length} STORIES`, { size: 12, weight: 700, fill: C.muted, anchor: 'end', ls: 1.5 }));
P.push(`<rect x="24" y="34" width="${W - 48}" height="2.5" fill="${C.ink}"/>`);
P.push(text(24, 96, 'Thursday 19 November 2026', { size: 58, font: SERIF, weight: 700 }));
P.push(text(24, 126, 'Three leaders meet in Shenzhen · The Hague rules on Myanmar · Anthropic lists · GTA VI lands', { size: 17, font: SERIF, italic: true, fill: C.red }));

// Region bar
const regions = [['ASIA-PACIFIC', 'asia'], ['AMERICAS', 'americas'], ['MIDDLE EAST', 'mideast'], ['AFRICA', 'africa'], ['EUROPE', 'europe'], ['OCEANIA', 'oceania']];
let rx = 24; const total = ALL.length;
for (const [label, key] of regions) {
  const rw = ((W - 48) * count(key)) / total;
  P.push(`<rect x="${rx}" y="138" width="${rw}" height="18" fill="${C[key]}"/>`);
  P.push(text(rx + rw / 2, 151, `${label} ${count(key)}`, { size: 10, weight: 700, fill: '#fff', anchor: 'middle' }));
  rx += rw;
}

// Stat strip
const stats = [['551,864', 'sit Korea’s college exam'], ['$83', 'Anthropic’s IPO price, above range'], ['$1.5bn+', 'GTA VI pre-orders (est.)'], ['11,000+', 'Ebola cases in Congo'], ['3', 'nuclear powers at one table']];
const sw = (W - 48) / stats.length;
stats.forEach(([big, small], i) => {
  const sx = 24 + i * sw;
  if (i) P.push(`<line x1="${sx}" y1="164" x2="${sx}" y2="206" stroke="#bbb"/>`);
  P.push(text(sx + sw / 2, 186, big, { size: 22, font: SERIF, weight: 700, fill: C.red, anchor: 'middle' }));
  P.push(text(sx + sw / 2, 202, small, { size: 10.5, fill: C.body, anchor: 'middle' }));
});
P.push(`<rect x="24" y="212" width="${W - 48}" height="1.5" fill="${C.ink}"/>`);

// Hero cards
const hw = (W - 48 - 2 * 12) / 3;
hero.forEach((s, i) => {
  const x = 24 + i * (hw + 12), y = 222, h = 210;
  P.push(`<rect x="${x}" y="${y}" width="${hw}" height="${h}" fill="${C.card}" stroke="#d6cdb8"/>`);
  P.push(art(s.art, x + 8, y + 8, hw - 16, 78));
  P.push(text(x + 10, y + 104, `${s.n} · ${s.place}`, { size: 10.5, weight: 700, fill: C[s.region], ls: 1 }));
  const [hs, hh] = block(x + 10, y + 126, s.head, hw - 20, { size: 19, font: SERIF, weight: 700, em: 0.58, lh: 21 });
  P.push(hs);
  P.push(block(x + 10, y + 126 + hh + 2, s.body, hw - 20, { size: 11.5, fill: C.body, lh: 14, em: 0.49, maxLines: 5 })[0]);
});

// Second row
const cw = (W - 48 - 4 * 10) / 5;
row2.forEach((s, i) => {
  const x = 24 + i * (cw + 10), y = 442, h = 180;
  P.push(`<rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="${C.card}" stroke="#d6cdb8"/>`);
  P.push(art(s.art, x + 6, y + 6, cw - 12, 50));
  P.push(text(x + 8, y + 72, `${s.n} · ${s.place}`, { size: 9.5, weight: 700, fill: C[s.region], ls: 0.5 }));
  const [hs, hh] = block(x + 8, y + 90, s.head, cw - 16, { size: 14, font: SERIF, weight: 700, em: 0.58, lh: 16 });
  P.push(hs);
  P.push(block(x + 8, y + 90 + hh + 1, s.body, cw - 16, { size: 10.5, fill: C.body, lh: 12.6, em: 0.49, maxLines: 6 })[0]);
});

// Map
const mx = 24, my = 634, mw = 268, mh = 268;
P.push(worldMap(mx, my, mw, mh));
P.push(text(mx + 10, my + 18, 'WHERE IT HAPPENED', { size: 11, weight: 700, fill: '#fff', ls: 1.5 }));
P.push(text(mx + 10, my + mh - 10, 'Numbers match the stories. Positions approximate.', { size: 8.5, fill: '#c8d3de' }));

// Briefs, three columns, filled in order and balanced by line count.
const bx = 306, by = 646, gap = 12, colW = (W - 24 - bx - 2 * gap) / 3, BS = 10, BLH = 11.8;
P.push(text(bx, by - 2, `ALSO ON THURSDAY 19 NOVEMBER · ${briefs.length} MORE STORIES`, { size: 11, weight: 700, fill: C.red, ls: 1 }));
P.push(`<line x1="${bx}" y1="${by + 4}" x2="${W - 24}" y2="${by + 4}" stroke="${C.ink}"/>`);
const lines = briefs.map((b) => wrap(`${b.n} ${b.place} — ${b.t}`, colW, BS, 0.47));
const totalLines = lines.reduce((a, l) => a + l.length, 0);
const cols = [[], [], []]; let ci = 0, used = 0;
lines.forEach((l, i) => {
  if (ci < 2 && used + l.length / 2 > ((ci + 1) * totalLines) / 3) { ci++; }
  cols[ci].push(i); used += l.length;
});
cols.forEach((idxs, c) => {
  let yy = by + 19; const x = bx + c * (colW + gap);
  for (const i of idxs) {
    const b = briefs[i];
    lines[i].forEach((l, li) => {
      if (li === 0) {
        const lead = `${b.n} ${b.place}`;
        P.push(`<text x="${x}" y="${yy}" font-family="${SANS}" font-size="${BS}" fill="${C.body}"><tspan font-weight="700" fill="${C[b.region]}">${esc(lead)}</tspan>${esc(l.slice(lead.length))}</text>`);
      } else P.push(text(x, yy, l, { size: BS, fill: C.body }));
      yy += BLH;
    });
    yy += 3.5;
  }
});

// Footer
P.push(`<rect x="24" y="912" width="${W - 48}" height="1.5" fill="${C.ink}"/>`);
P.push(block(24, 932, 'DATE CHECK — Every story here happened, began or was reported on Thursday 19 November 2026. Briefs 20, 24, 25 and 28 were first reported late on Wednesday 18 November and still led Thursday’s coverage. Results still pending when this page was drawn (the summit, the ICJ ruling, ANT’s first trade, COP31, Berlin) are shown as under way, not decided.', W - 48, { size: 11, fill: C.body, lh: 14, em: 0.47 })[0]);
P.push(text(24, 984, 'Sources: Al Jazeera, CNN, CNBC, Rockstar Games, RTÉ, AFP, Times of Israel, Korea JoongAng Daily, Ukrinform, The Federal, OkayAfrica, allAfrica, Rio Times, Stuff. Original drawings. The World in One Day — 19 November 2026.', { size: 9.5, fill: C.muted }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${P.join('\n')}\n</svg>\n`;
writeFileSync(new URL('./front.svg', import.meta.url), svg);
console.log(`front.svg written (${svg.length} bytes, ${ALL.length} stories)`);
