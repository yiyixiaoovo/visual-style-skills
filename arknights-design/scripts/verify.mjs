#!/usr/bin/env node
/**
 * AK DESIGN · 确定性质检
 * 用法: node scripts/verify.mjs templates/poster-3x4.html [more.html ...]
 *
 * 退出码: 0 = 全部通过; 1 = 有 FAIL
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };

// —— 色板允许值（与 references/02-tokens.md 同步） ——
const PALETTE = new Set([
  '#08090a', '#111316', '#191c20', '#e8e6e1', '#c9c5bb', '#0b0c0e', '#4a4d53',
  '#18d1ff', '#b9e432', '#ff7b00', '#b0243b', '#f3ff00', '#8fc31f', '#3387fb',
  '#7ee5ff', '#e8e6e3', '#00d9c5', '#c8eb21', '#ababab', '#242424', '#0c0c0c',
  '#000000', '#ffffff', '#fff', '#000',
  '#dcd8cf', '#cfcac0', '#e8e6e1', '#111111', '#696969', '#868686', '#eeeeee', '#f7f7f7',
  '#0a0d11', '#121820', '#1a222b', '#e6e9ec', '#b9c2ca', '#9ad9e8', '#cd1a37', '#fff000', '#fffa00',
]);

const FONT_ALLOW = [
  'bahnschrift', 'oswald', 'archivo', 'arial narrow', 'bebas neue',
  'noto sans sc', 'microsoft yahei', 'pingfang sc', 'source han sans',
  'cascadia mono', 'consolas', 'jetbrains mono', 'ibm plex mono',
  'sans-serif', 'serif', 'monospace', 'system-ui', 'ui-monospace',
];

const BANNED = [
  '极致', '赋能', '打造', '一站式', '沉浸式', '未来感', '科技感',
  '赛博', '颠覆', '重塑', '解锁', '你值得', '！', '？',
  '大约', '左右', '适中', '稍微', '差不多', '大概', '比较好',
];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

// —— 工具 ——
const hex2hsl = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2, d = max - min;
  let s = 0, hue = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / d + 2) * 60;
    else hue = ((r - g) / d + 4) * 60;
  }
  return { h: hue, s, l };
};

const results = [];
const add = (level, name, msg) => results.push({ level, name, msg });
const pass = (n, m = '') => add('PASS', n, m);
const fail = (n, m) => add('FAIL', n, m);
const warn = (n, m) => add('WARN', n, m);

// —— 单文件检查 ——
function check(file) {
  const src = readFileSync(file, 'utf8');
  const css = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  const all = src;

  // 1 圆角（纸本语域可声明例外，上限 9px）
  const radii = [...css.matchAll(/border-radius\s*:\s*([^;}]+)/gi)]
    .map((m) => m[1].trim())
    .filter((v) => !/^(0(px|%|em|rem)?\s*)+$/i.test(v));
  const declLore = /data-surface="lore"/.test(src);
  if (!radii.length) pass('圆角', '全部为 0');
  else if (!declLore) fail('圆角', `发现非零圆角（未声明 data-surface="lore"）: ${radii.slice(0, 3).join(' | ')}`);
  else {
    const tooBig = radii.filter((v) => {
      const n = parseFloat(v);
      return Number.isNaN(n) || n > 9;
    });
    tooBig.length
      ? fail('圆角', `纸本语域上限 9px，发现: ${tooBig.slice(0, 3).join(' | ')}`)
      : pass('圆角', `纸本语域例外 ${radii.length} 处，均 ≤ 9px`);
  }

  // 2 有彩色数量（解析 var() 与实际用到的颜色，跳过印章红）
  const linkedCss = [...src.matchAll(/<link[^>]+href="([^"]+\.css)"/g)]
    .map((m) => { try { return readFileSync(resolve(dirname(file), m[1]), 'utf8'); } catch { return ''; } })
    .join('\n');
  const cssAll = css + linkedCss;
  const varMap = new Map();
  const takeVars = (block) => {
    for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)[;}]/g)) varMap.set(m[1], m[2].trim());
  };
  // 只取 :root，再叠加页面真正声明了的 data-surface / data-faction 块（避免后者覆盖前者）
  takeVars((cssAll.match(/:root\s*\{([\s\S]*?)\n\}/) || [, ''])[1]);
  for (const d of src.matchAll(/data-(surface|faction)="([\w-]+)"/g)) {
    const re = new RegExp('\\[data-' + d[1] + '="' + d[2] + '"\\]\\s*\\{([\\s\\S]*?)\\n\\}', 'g');
    for (const b of cssAll.matchAll(re)) takeVars(b[1]);
  }
  const resolveVar = (name, d = 0) => {
    if (d > 5) return null;
    const v = varMap.get(name);
    if (!v) return null;
    const alias = v.match(/^var\((--[\w-]+)\)$/);
    return alias ? resolveVar(alias[1], d + 1) : v;
  };
  const usedVars = [...new Set([...all.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];
  const resolved = usedVars
    .filter((v) => !/alert|vermillion/i.test(v))
    .map((v) => (resolveVar(v) || '').match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/)?.[0])
    .filter(Boolean);
  const literalHex = (all.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []);
  const alerts = usedVars.filter((v) => /alert|vermillion/i.test(v)).length;
  const hexes = [...new Set([...resolved, ...literalHex].map((h) => h.toLowerCase()))];
  const chroma = hexes
    .map((h) => ({ hex: h, ...hex2hsl(h) }))
    .filter((c) => c.s > 0.25 && c.l > 0.18 && c.l < 0.88);
  const buckets = [];
  for (const c of chroma) {
    const hit = buckets.find((b) => Math.abs(b.h - c.h) < 24 || Math.abs(b.h - c.h) > 336);
    if (hit) hit.items.push(c); else buckets.push({ h: c.h, items: [c] });
  }
  const bud = buckets.length;
  if (bud > 2) fail('有彩色', `${bud} 个色相（${buckets.map((b) => b.items[0].hex).join(' ')}），上限 2 + 印章红`);
  else pass('有彩色', `${bud} 个色相${alerts ? ` + ${alerts} 处印章红` : ''}`);

  // 3 色板外颜色
  const outside = hexes.filter((h) => !PALETTE.has(h));
  outside.length ? warn('色板', `色板外颜色: ${outside.join(' ')}`) : pass('色板', '全部在令牌内');

  // 4 字体白名单
  const fonts = [...all.matchAll(/font-family\s*:\s*([^;}]+)/gi)]
    .map((m) => m[1].replace(/\s+/g, ' ').trim());
  const badFonts = [];
  for (const decl of fonts) {
    if (/var\(/.test(decl)) continue;
    const families = decl.split(',').map((f) => f.replace(/["']/g, '').trim().toLowerCase());
    for (const f of families) if (f && !FONT_ALLOW.includes(f)) badFonts.push(f);
  }
  badFonts.length ? fail('字体', `非白名单家族: ${[...new Set(badFonts)].join(', ')}`)
                  : pass('字体', `${new Set(fonts).size} 处声明，全部合规`);

  // 5 字距
  const bigNoTrack = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(([, , body]) => {
    const m = body.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/i);
    return m && +m[1] >= 64 && !/letter-spacing/i.test(body);
  });
  bigNoTrack.length
    ? warn('字距', `${bigNoTrack.length} 条 ≥64px 的规则没写字距: ${bigNoTrack[0][1].trim().slice(0, 40)}`)
    : pass('字距', '显示级规则均带字距');

  // 6 阴影 / 发光
  const shadows = [...css.matchAll(/(box|text)-shadow\s*:\s*([^;}]+)/gi)].map((m) => m[2].trim());
  const glow = shadows.filter((s) => /(0\s+0\s+[1-9]|\d+px)\s*(#[0-9a-f]{6}|rgba?\()/i.test(s) && !/rgba\(0,\s*0,\s*0/.test(s));
  glow.length ? fail('阴影', `疑似彩色发光: ${glow[0]}`)
              : shadows.length ? warn('阴影', `${shadows.length} 处阴影，确认是黑色可读性投影`)
                               : pass('阴影', '无投影');

  // 7 渐变
  const grads = [...css.matchAll(/linear-gradient\(([^)]+)\)/gi)].map((m) => m[1]);
  const decorative = grads.filter((g) => !/(repeating|transparent|mask)/i.test(g) && (g.match(/#|rgba?\(/g) || []).length >= 2);
  decorative.length ? warn('渐变', `${decorative.length} 处双色线性渐变，确认不是装饰性铺底`)
                    : pass('渐变', '仅网点/遮罩类');

  // 8 禁用词 / emoji
  const text = all.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const hitWord = BANNED.filter((w) => text.includes(w));
  const hitEmoji = EMOJI.test(text);
  (hitWord.length || hitEmoji)
    ? fail('文案', `命中禁用: ${[...hitWord, hitEmoji ? 'emoji' : ''].filter(Boolean).join(', ')}`)
    : pass('文案', '无禁用词 / emoji');

  // 9 结构件
  const need = [['ak-page', '页面容器'], ['ak-label', '标签层'], ['ak-num', '编号数字']];
  const miss = need.filter(([c]) => !new RegExp(`class="[^"]*\\b${c}\\b`).test(src)).map(([, n]) => n);
  const hasRule = /ak-rule|border-top\s*:\s*1px|border-bottom\s*:\s*1px/.test(src);
  if (!hasRule) miss.push('分割线');
  miss.length ? fail('结构', `缺少: ${miss.join(', ')}`) : pass('结构', '五件套齐');

  // 10 中文字号比例（只在页面上存在"西文大字号"时才构成竞争）
  const rules = [...cssAll.matchAll(/([^{}]+)\{([^}]*)\}/g)];
  const sizeOf = (body) => {
    const m = body.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/i);
    return m ? +m[1] : 0;
  };
  const isZh = (sel) => /(ak-zh|zh[-_]|_zh|-zh)/i.test(sel);
  const zhSizes = rules.filter((r) => isZh(r[1])).map((r) => sizeOf(r[2])).filter(Boolean);
  const latinSizes = rules.filter((r) => !isZh(r[1])).map((r) => sizeOf(r[2])).filter(Boolean);
  const maxZh = Math.max(...zhSizes, 0);
  const maxLatin = Math.max(...latinSizes, 0);
  if (!maxZh) {
    pass('中文字号', '未显式声明（继承）');
  } else if (maxLatin < 64) {
    pass('中文字号', `中文是主锚点（最大 ${maxZh}px，西文最大 ${maxLatin}px，不构成竞争）`);
  } else {
    const limit = maxLatin >= 150 ? maxLatin / 3 : Math.min(72, maxLatin * 0.7);
    if (maxZh > limit * 1.05) {
      fail('中文字号', `中文最大 ${maxZh}px > 上限 ${Math.round(limit)}px（西文最大 ${maxLatin}px）`);
    } else {
      pass('中文字号', `${maxZh}px / 上限 ${Math.round(limit)}px（西文 ${maxLatin}px）`);
    }
  }
}

// —— 主流程 ——
const files = process.argv.slice(2);
if (!files.length) {
  console.error('用法: node scripts/verify.mjs <file.html> [...]');
  process.exit(2);
}

let anyFail = false;
for (const f of files) {
  const p = resolve(f);
  console.log(`\n${C.b}${f}${C.x}`);
  results.length = 0;
  try { check(p); } catch (e) { fail('读取', e.message); }
  for (const r of results) {
    const mark = r.level === 'PASS' ? `${C.g}PASS${C.x}` : r.level === 'FAIL' ? `${C.r}FAIL${C.x}` : `${C.y}WARN${C.x}`;
    console.log(`  ${mark}  ${r.name.padEnd(6, '　')} ${C.d}${r.msg}${C.x}`);
    if (r.level === 'FAIL') anyFail = true;
  }
  const fails = results.filter((r) => r.level === 'FAIL').length;
  const warns = results.filter((r) => r.level === 'WARN').length;
  console.log(`  ${C.d}— ${results.length - fails - warns} pass / ${warns} warn / ${fails} fail${C.x}`);
}

console.log(anyFail ? `\n${C.r}✗ 有 FAIL，不建议交付${C.x}\n` : `\n${C.g}✓ 通过${C.x}\n`);
process.exit(anyFail ? 1 : 0);
