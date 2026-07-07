/**
 * Crops 12 teacher faces from the staff banner.
 * Image: 1284 × 593 px, 6 cols × 2 rows
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// resolve sharp from the pnpm store
const sharpPath = '/home/runner/workspace/node_modules/.pnpm/sharp@0.35.3_@types+node@25.9.4/node_modules/sharp';
const sharp = require(sharpPath);

const SRC   = 'attached_assets/staff-banner_1783421034252.jpg';
const DEST  = 'artifacts/shar-institute/public/assets/images';
const SIZE  = 200;   // output square side

// 6 columns evenly across 1284px
// column centres: image_width / 6 * (col + 0.5)
const IMG_W = 1284;
const IMG_H = 593;

const colCx = [0,1,2,3,4,5].map(c => Math.round(IMG_W / 6 * (c + 0.5)));
// ≈ [107, 321, 535, 749, 963, 1177]

// Row face-centre Y values — tuned from visual inspection
const rowCy = [152, 395];   // row 1 ≈ y=152, row 2 ≈ y=395

// File names in order: [row][col]
const names = [
  // Row 1 — left to right
  ['kamaran', 'bilal-b', 'sarbast', 'bahadin', 'aso', 'ihsan'],
  // Row 2 — left to right
  ['hilal', 'bakhtiar', 'karwan', 'abdullah', 'bilal-a', 'akam'],
];

const HALF = Math.round(SIZE / 2);

const jobs = [];
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 6; col++) {
    const cx = colCx[col];
    const cy = rowCy[row];

    // clamp to image bounds
    const left   = Math.max(0, cx - HALF);
    const top    = Math.max(0, cy - HALF);
    const width  = Math.min(SIZE, IMG_W - left);
    const height = Math.min(SIZE, IMG_H - top);

    const outFile = `${DEST}/${names[row][col]}.png`;
    jobs.push(
      sharp(SRC)
        .extract({ left, top, width, height })
        .resize(200, 200)   // normalise to 200×200
        .png()
        .toFile(outFile)
        .then(() => console.log(`✓ ${names[row][col]}.png  [${left},${top} ${width}×${height}]`))
        .catch(e => console.error(`✗ ${names[row][col]}:`, e.message))
    );
  }
}

await Promise.all(jobs);
console.log('Done.');
