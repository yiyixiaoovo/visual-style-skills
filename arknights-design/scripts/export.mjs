#!/usr/bin/env node
/**
 * 批量导出 + 尺寸校验：1× / 2× 各导一遍，读 PNG 文件头核对像素。
 * 用法:
 *   node scripts/export.mjs            # 1× 与 2× 都跑，导出到 .export/ 后校验
 *   node scripts/export.mjs --scale=2  # 只跑 2×
 *   node scripts/export.mjs --keep     # 保留产物（默认校验完删除）
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.export');

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p));

const TEMPLATES = [
  { file: 'poster-3x4.html', w: 1200, h: 1600 },
  { file: 'slide-16x9.html', w: 1600, h: 900 },
  { file: 'card-3x4.html', w: 750, h: 1000 },
  { file: 'infographic-square.html', w: 1080, h: 1080 },
  { file: 'chapter-square.html', w: 1080, h: 1080 },
  { file: 'spread-compare.html', w: 1600, h: 900 },
  { file: 'kv-sixth-anniversary.html', w: 1200, h: 1600 },
  { file: 'lore-a4.html', w: 794, h: 1123 },
  { file: 'longform-1200.html', w: 1200, h: 2400 },
  { file: 'web-hero-1920.html', w: 1920, h: 1080 },
];

const args = process.argv.slice(2);
const scaleArg = args.find((a) => a.startsWith('--scale='));
const scales = scaleArg ? [Number(scaleArg.split('=')[1])] : [1, 2];
const keep = args.includes('--keep');

const pngSize = (p) => {
  const b = readFileSync(p);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

if (!EDGE) { console.error('未找到 Edge / Chrome'); process.exit(2); }
mkdirSync(OUT, { recursive: true });

let fail = 0;
console.log(`\n导出校验 · ${scales.map((s) => s + '×').join(' / ')}\n`);

for (const s of scales) {
  for (const t of TEMPLATES) {
    const src = `file:///${join(ROOT, 'templates', t.file).replace(/\\/g, '/')}`;
    const dst = join(OUT, `${t.file.replace('.html', '')}-${s}x.png`);
    const r = spawnSync(EDGE, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      `--user-data-dir=${join(OUT, `.p-${s}-${t.file}`)}`,
      `--force-device-scale-factor=${s}`,
      `--window-size=${t.w},${t.h}`,
      `--screenshot=${dst}`, src,
    ], { encoding: 'utf8' });

    if (!existsSync(dst)) { console.log(`  ✘ ${t.file} ${s}× 未生成`); fail++; continue; }
    const got = pngSize(dst);
    const want = { w: t.w * s, h: t.h * s };
    const ok = got.w === want.w && got.h === want.h;
    const kb = Math.round(statSync(dst).size / 1024);
    console.log(`  ${ok ? '✔' : '✘'} ${t.file.padEnd(26)} ${String(s)}×  ${got.w}×${got.h}  期望 ${want.w}×${want.h}  ${kb}KB`);
    if (!ok) fail++;
  }
}

if (!keep) rmSync(OUT, { recursive: true, force: true });
else console.log(`\n产物保留在 ${OUT}`);
console.log(fail ? `\n✗ ${fail} 项不符合\n` : `\n✓ 全部符合\n`);
process.exit(fail ? 1 : 0);
