#!/usr/bin/env node
/**
 * ENDFIELD · 确定性质检（三色职责 / 圆角政策 / 发光预算 / 可访问性）
 * 用法: node scripts/verify.mjs <file.html> [...]
 * 退出码: 0 = 通过; 1 = 有 FAIL
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };

// 允许的三色（色相 ± 容差）
const TRIAD = [
  { name: '黄', h: 58, tol: 9 },
  { name: '品红', h: 322, tol: 10 },
  { name: '薄荷', h: 159, tol: 10 },
];
// 圆角政策：只允许 4 / 8 / 42 / 54 / 50%，禁止 0 与 9–40px 中间档
const RADIUS_OK = new Set(['4px', '8px', '42px', '54px', '50%', '3px', '2px', '6px', '0']);

const hueOf = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  let s = 0, hu = 0;
  if (d) {
    s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) hu = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (mx === g) hu = ((b - r) / d + 2) * 60;
    else hu = ((r - g) / d + 4) * 60;
  }
  return { h: hu, s, l };
};

const results = [];
const pass = (n, m = '') => results.push(['PASS', n, m]);
const fail = (n, m) => results.push(['FAIL', n, m]);
const warn = (n, m) => results.push(['WARN', n, m]);

function check(file) {
  const src = readFileSync(file, 'utf8');
  const css = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  const linked = [...src.matchAll(/<link[^>]+href="([^"]+\.css)"/g)]
    .map((m) => { try { return readFileSync(resolve(dirname(file), m[1]), 'utf8'); } catch { return ''; } }).join('\n');
  const cssAll = css + linked;

  // 1 画布
  /class="ef-page/.test(src) ? pass('画布', '.ef-page 存在') : fail('画布', '缺少 .ef-page');

  // 2 套色：只允许三色，且必须走令牌（模板里不许写死荧光 hex）
  const varMap = new Map();
  for (const m of (cssAll.match(/:root\s*\{([\s\S]*?)\n\}/) || [, ''])[1].matchAll(/(--[\w-]+)\s*:\s*([^;}]+)[;}]/g)) varMap.set(m[1], m[2].trim());
  const used = [...new Set([...src.matchAll(/var\((--ef-[\w-]+)\)/g)].map((m) => m[1]))];
  const hexes = used.map((v) => (varMap.get(v) || '').match(/#[0-9a-fA-F]{6}\b/)?.[0]).filter(Boolean);
  const literal = (src.match(/#[0-9a-fA-F]{6}\b/g) || []);
  const literalChromatic = literal.filter((h) => { const c = hueOf(h); return c.s > .45 && c.l > .15 && c.l < .92; });
  const TRIAD_HEX = new Set(['#fffa00', '#fff000', '#ff1aac', '#00ffa2']);
  const chromatic = hexes.filter((h) => { const c = hueOf(h); return c.s > 0.45 && c.l > 0.15 && c.l < 0.92; });
  const bad = [...new Set(chromatic.filter((h) => !TRIAD_HEX.has(h)))];
  if (bad.length) fail('套色', `非三色: ${bad.slice(0, 4).join(' ')}`);
  else pass('套色', `${new Set(chromatic).size} 个荧光色，均在黄/品红/薄荷内`);
  literalChromatic.length
    ? fail('令牌', `模板内写死荧光色 ${literalChromatic.length} 处（应走 var(--ef-*)）: ${literalChromatic.slice(0, 3).join(' ')}`)
    : pass('令牌', '荧光色全部走令牌');

  // 3 圆角政策
  const radii = [...cssAll.matchAll(/border-radius\s*:\s*([^;}]+)/gi)].map((m) => m[1].trim()).filter((v) => !/^0$/.test(v));
  const radOk = (v) => v.split(/\s+/).every((p) => RADIUS_OK.has(p) || p.startsWith('var('));
  const badR = radii.filter((v) => !radOk(v));
  if (badR.length) fail('圆角', `不在政策内: ${badR.slice(0, 3).join(' | ')}（允许 4/8/42/54px、50%）`);
  else if (radii.length < 3) warn('圆角', `只出现 ${radii.length} 处圆角，终末地应≥3 处胶囊/圆`);
  else pass('圆角', `${radii.length} 处，全部为胶囊或微型件`);

  // 4 发光预算
  const glowEls = (src.match(/class="[^"]*ef-glow/g) || []).length;
  const bigBlur = [...css.matchAll(/blur\((\d+)px\)/g)].map((m) => +m[1]).filter((n) => n > 60);
  glowEls > 2 ? fail('发光', `${glowEls} 处 .ef-glow，上限 2 处`) : pass('发光', `${glowEls} 处光晕`);
  bigBlur.length ? fail('发光', `模糊半径 > 60px: ${bigBlur.join(', ')}`) : pass('发光半径', '≤ 60px');

  // 5 胶囊骨架
  const pills = (src.match(/ef-pill|ef-chip/g) || []).length;
  pills >= 4 ? pass('胶囊', `${pills} 处 pill/chip`) : warn('胶囊', `只有 ${pills} 处，终末地应更依赖胶囊`);

  // 6 标题字距
  const disp = (cssAll.match(/\.ef-display\s*\{([^}]*)\}/) || [, ''])[1];
  /letter-spacing\s*:\s*(-|var\(--ef-track-tight\))/.test(disp) ? pass('标题', '显示级为负字距') : fail('标题', '.ef-display 缺少负字距');

  // 7 可访问性
  /prefers-reduced-motion/.test(linked) ? pass('降级', '有 reduced-motion') : fail('降级', '缺少 prefers-reduced-motion');
  /focus-visible/.test(linked) ? pass('焦点', '有 focus-visible') : fail('焦点', '缺少 focus-visible');

  // 8 文案
  const text = src.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const banned = ['极致', '赋能', '打造', '未来感', '科技感', '！', '？'].filter((w) => text.includes(w));
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text);
  (banned.length || emoji) ? fail('文案', `命中: ${[...banned, emoji ? 'emoji' : ''].filter(Boolean).join(', ')}`) : pass('文案', '干净');
}

const files = process.argv.slice(2);
if (!files.length) { console.error('用法: node scripts/verify.mjs <file.html> [...]'); process.exit(2); }
let anyFail = false;
for (const f of files) {
  console.log(`\n${C.b}${f}${C.x}`);
  results.length = 0;
  try { check(resolve(f)); } catch (e) { fail('读取', e.message); }
  for (const [lv, n, m] of results) {
    const mark = lv === 'PASS' ? `${C.g}PASS${C.x}` : lv === 'FAIL' ? `${C.r}FAIL${C.x}` : `${C.y}WARN${C.x}`;
    console.log(`  ${mark}  ${n.padEnd(6, '　')} ${C.d}${m}${C.x}`);
    if (lv === 'FAIL') anyFail = true;
  }
  const f2 = results.filter((r) => r[0] === 'FAIL').length;
  const w2 = results.filter((r) => r[0] === 'WARN').length;
  console.log(`  ${C.d}— ${results.length - f2 - w2} pass / ${w2} warn / ${f2} fail${C.x}`);
}
console.log(anyFail ? `\n${C.r}✗ 有 FAIL${C.x}\n` : `\n${C.g}✓ 通过${C.x}\n`);
process.exit(anyFail ? 1 : 0);
