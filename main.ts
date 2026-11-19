// Entry for make.fun's news-image-20261119: writes the front page of 19 November 2026 to /output/entry.png.
// The image is drawn by draw.mjs (front.svg) and rendered once to entry.png; this program only copies those
// bytes, so both runs in the grader's sandbox write exactly the same file with no network.
//
// Locally: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const image = readFileSync(new URL('./entry.png', import.meta.url));

// Refuse to write anything but a PNG within the gate's limits, so a bad render fails here, not on the server.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!image.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('entry.png is not a PNG');
if (image.length > 1024 * 1024) throw new Error(`entry.png is ${image.length} bytes, over 1 MiB`);
const width = image.readUInt32BE(16), height = image.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over 1024x1024`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
writeFileSync(join(outDir, 'entry.png'), image);
