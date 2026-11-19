// draw.mjs: writes front.svg, a one-page summary of the world's news of Thursday 19 November 2026.
// Render it with: node draw.mjs && rsvg-convert -w 1024 -h 1024 front.svg -o entry.png
// Every headline is written in our own words from that day's reporting; nothing is stated as an outcome
// unless it had been reported when the image was drawn.
import { writeFileSync } from 'node:fs';

const W = 1024, H = 1024;
const INK = '#16181d', PAPER = '#f6f1e6', RED = '#b3261e', MUTED = '#5b5f66', RULE = '#2b2e35';
const SERIF = "DejaVu Serif, Georgia, serif";
const SANS = "Fira Sans, DejaVu Sans, Arial, sans-serif";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Lines of text, top-left anchored, with a fixed line height.
function lines(x, y, arr, { size, lh = size * 1.22, font = SANS, weight = 400, fill = INK, anchor = 'start', style = '' }) {
  return arr.map((t, i) =>
    `<text x="${x}" y="${y + i * lh}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${style}>${esc(t)}</text>`
  ).join('\n');
}

function kicker(x, y, label, color = RED) {
  return `<text x="${x}" y="${y}" font-family="${SANS}" font-size="15" font-weight="700" letter-spacing="2" fill="${color}">${esc(label)}</text>`;
}

// Icons: simple, original drawings.
function trioIcon(cx, cy) {
  // Three lecterns around a round table with three small flags (US, CN, RU colours, stylised stripes only).
  const flag = (x, y, colors) => colors.map((c, i) =>
    `<rect x="${x}" y="${y + i * 9}" width="34" height="9" fill="${c}"/>`).join('') +
    `<rect x="${x}" y="${y}" width="34" height="${9 * colors.length}" fill="none" stroke="${INK}" stroke-width="1"/>`+
    `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 58}" stroke="${INK}" stroke-width="2"/>`;
  return `
  <g>
    <ellipse cx="${cx}" cy="${cy + 52}" rx="150" ry="34" fill="#d9cdb4" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${cy + 46}" rx="150" ry="34" fill="#e8dcc2" stroke="${INK}" stroke-width="2"/>
    ${[-95, 0, 95].map((dx) => `
      <circle cx="${cx + dx}" cy="${cy - 22}" r="20" fill="#7a6a55" stroke="${INK}" stroke-width="2"/>
      <path d="M ${cx + dx - 30} ${cy + 36} Q ${cx + dx} ${cy - 10} ${cx + dx + 30} ${cy + 36} Z" fill="#33363d" stroke="${INK}" stroke-width="2"/>`).join('')}
    ${flag(cx - 150, cy - 70, ['#b22234', '#ffffff', '#3c3b6e'])}
    ${flag(cx - 17, cy - 92, ['#de2910', '#de2910', '#ffde00'])}
    ${flag(cx + 116, cy - 70, ['#ffffff', '#0039a6', '#d52b1e'])}
    <text x="${cx}" y="${cy + 54}" font-family="${SANS}" font-size="15" font-weight="700" text-anchor="middle" fill="${INK}" letter-spacing="3">APEC · SHENZHEN</text>
  </g>`;
}

function gavelIcon(cx, cy) {
  return `
  <g transform="translate(${cx} ${cy})">
    <rect x="-46" y="34" width="92" height="14" rx="3" fill="#7a5233" stroke="${INK}" stroke-width="2"/>
    <g transform="rotate(-35)">
      <rect x="-40" y="-18" width="62" height="30" rx="5" fill="#8b5e3c" stroke="${INK}" stroke-width="2"/>
      <rect x="18" y="-6" width="56" height="8" rx="3" fill="#a0714c" stroke="${INK}" stroke-width="2"/>
    </g>
    <path d="M -64 -40 L -64 30 M -76 -40 L -52 -40" stroke="${MUTED}" stroke-width="3"/>
    <path d="M 64 -40 L 64 30 M 52 -40 L 76 -40" stroke="${MUTED}" stroke-width="3"/>
  </g>`;
}

function gulfIcon(cx, cy) {
  // Stylised map: sea in the middle, land on both sides, a warning marker.
  return `
  <g transform="translate(${cx} ${cy})">
    <rect x="-70" y="-46" width="140" height="92" rx="6" fill="#bcd3dc" stroke="${INK}" stroke-width="2"/>
    <path d="M -70 -46 L -10 -46 Q -30 -10 -12 20 Q 0 40 -70 46 Z" fill="#d8c79f" stroke="${INK}" stroke-width="1.5"/>
    <path d="M 70 -46 L 10 -46 Q 40 -20 22 6 Q 10 30 70 30 Z" fill="#d8c79f" stroke="${INK}" stroke-width="1.5"/>
    <path d="M 0 -18 L 14 8 L -14 8 Z" fill="${RED}" stroke="${INK}" stroke-width="1.5"/>
    <text x="0" y="6" font-family="${SANS}" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">!</text>
  </g>`;
}

function globeIcon(cx, cy, r) {
  return `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#cfe0e6" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${MUTED}" stroke-width="1.2"/>
    <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${MUTED}" stroke-width="1.2"/>
    <path d="M ${cx - r * 0.6} ${cy - r * 0.5} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} 0 t ${r * 0.2} ${r * 0.4} q ${-r * 0.3} ${r * 0.3} ${-r * 0.6} ${r * 0.1} z" fill="#a9b98a"/>
    <path d="M ${cx + r * 0.1} ${cy + r * 0.1} q ${r * 0.3} ${-r * 0.1} ${r * 0.5} ${r * 0.2} t ${-r * 0.1} ${r * 0.4} q ${-r * 0.3} 0 ${-r * 0.4} ${-r * 0.3} z" fill="#a9b98a"/>
  </g>`;
}

const parts = [];
parts.push(`<rect width="${W}" height="${H}" fill="${PAPER}"/>`);

// Masthead
parts.push(lines(W / 2, 74, ['THE WORLD IN ONE DAY'], { size: 52, font: SERIF, weight: 700, anchor: 'middle' }));
parts.push(`<rect x="40" y="96" width="${W - 80}" height="40" fill="${INK}"/>`);
parts.push(lines(W / 2, 124, ['THURSDAY · 19 NOVEMBER 2026 · WORLD NEWS'], { size: 22, weight: 700, fill: '#fff', anchor: 'middle', style: 'letter-spacing="3"' }));

// Lead story
parts.push(kicker(40, 172, 'LEAD · ASIA-PACIFIC'));
parts.push(lines(40, 214, ['Trump, Xi and Putin meet', 'in first three-way summit'], { size: 36, font: SERIF, weight: 700, lh: 46 }));
parts.push(lines(40, 300, [
  'On the sidelines of the APEC summit in',
  'Shenzhen, the US, Chinese and Russian',
  'leaders hold their first trilateral talks.',
  'On the table: the Iran war, nuclear arms',
  'control, trade and AI. Few expect a deal.',
], { size: 19, lh: 26, fill: '#2a2d33' }));
parts.push(trioIcon(800, 270));

parts.push(`<line x1="40" y1="450" x2="${W - 40}" y2="450" stroke="${RULE}" stroke-width="2"/>`);

// Second row: two columns
parts.push(kicker(40, 484, 'THE HAGUE · JUSTICE'));
parts.push(lines(40, 520, ['World Court rules on', 'Rohingya genocide case'], { size: 30, font: SERIF, weight: 700, lh: 36 }));
parts.push(lines(40, 596, [
  'The ICJ gives its final, unappealable',
  'judgment in The Gambia v. Myanmar, filed',
  'in 2019 over the 2017 army crackdown.',
  'It could be the first time the court',
  'finds a state committed genocide.',
], { size: 17, lh: 23, fill: '#2a2d33' }));
parts.push(`<g transform="translate(440 640) scale(0.8)">${gavelIcon(0, 0)}</g>`);

parts.push(`<line x1="${W / 2}" y1="466" x2="${W / 2}" y2="760" stroke="${RULE}" stroke-width="1.5"/>`);

parts.push(kicker(532, 484, 'MIDDLE EAST · WAR'));
parts.push(lines(532, 520, ['Trump weighs a new', 'offensive against Iran'], { size: 30, font: SERIF, weight: 700, lh: 36 }));
parts.push(lines(532, 596, [
  'As the US-Iran war hangs over the summit,',
  'reports say the president is weighing',
  'fresh strikes, with Israel’s Netanyahu',
  'pushing for a four- to seven-day',
  'campaign.',
], { size: 17, lh: 23, fill: '#2a2d33' }));
parts.push(`<g transform="translate(932 646) scale(0.7)">${gulfIcon(0, 0)}</g>`);

parts.push(`<line x1="40" y1="772" x2="${W - 40}" y2="772" stroke="${RULE}" stroke-width="2"/>`);

// Bottom strip
parts.push(globeIcon(100, 862, 56));
parts.push(kicker(180, 806, 'ALSO TODAY'));
parts.push(lines(180, 838, [
  '• Xi opens APEC calling for free trade and AI cooperation;',
  '   Putin tells leaders sanctions on Russia have backfired.',
  '• Trump arrived in Shenzhen from the ASEAN meeting in Manila.',
], { size: 18, lh: 25, fill: '#2a2d33' }));
parts.push(lines(180, 930, ['APEC leaders’ summit in Shenzhen holds its second and final day.'], { size: 18, weight: 600, fill: INK }));

parts.push(`<rect x="40" y="962" width="${W - 80}" height="2" fill="${INK}"/>`);
parts.push(lines(W / 2, 992, ['News of 19 November 2026, as reported that day. Drawn by an AI agent.'], { size: 15, fill: MUTED, anchor: 'middle' }));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${parts.join('\n')}\n</svg>\n`;
writeFileSync(new URL('./front.svg', import.meta.url), svg);
console.log(`front.svg written (${svg.length} bytes)`);
