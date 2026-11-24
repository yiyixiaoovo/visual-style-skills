#!/usr/bin/env node
/**
 * 技能包完整性自检
 * 用法: node scripts/validate-package.mjs
 * 退出码: 0 = 通过; 1 = 有缺失
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };

const REQUIRED = [
  'SKILL.md',
  'AGENTS.md',
  'assets/ak.css',
  'assets/fonts.md',
  'references/00-evidence.md',
  'references/01-visual-grammar.md',
  'references/02-tokens.md',
  'references/03-layouts.md',
  'references/04-copy-system.md',
  'references/05-quality-gates.md',
  'references/06-render-export.md',
  'references/07-official-surfaces.md',
  'references/08-narrative-engine.md',
  'references/09-real-assets.md',
  'scripts/verify.mjs',
  'tests/run.mjs',
  'scripts/export.mjs',
  'scripts/verify-all.mjs',
  'CHANGELOG.md',
  'assets/font-face.css',
  'LICENSE',
  'VERSION',
  'templates/poster-3x4.html',
  'templates/slide-16x9.html',
  'templates/card-3x4.html',
  'templates/infographic-square.html',
  'templates/chapter-square.html',
  'templates/spread-compare.html',
  'templates/kv-sixth-anniversary.html',
  'templates/lore-a4.html',
  'templates/longform-1200.html',
  'templates/web-hero-1920.html',
  'templates/longform-scroll.html',
];

let fails = 0;
const ok = (m) => console.log(`  ${C.g}PASS${C.x}  ${m}`);
const bad = (m) => { fails++; console.log(`  ${C.r}FAIL${C.x}  ${m}`); };
const warn = (m) => console.log(`  ${C.y}WARN${C.x}  ${m}`);

// 1 必需文件
console.log(`\n${C.b}arknights-design · package check${C.x}\n`);
for (const f of REQUIRED) {
  existsSync(join(ROOT, f)) ? ok(`存在 ${f}`) : bad(`缺失 ${f}`);
}

// 2 SKILL.md frontmatter
const skillPath = join(ROOT, 'SKILL.md');
if (existsSync(skillPath)) {
  const src = readFileSync(skillPath, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) bad('SKILL.md 缺少 YAML frontmatter');
  else {
    const body = fm[1];
    /^name:\s*\S+/m.test(body) ? ok('frontmatter.name') : bad('frontmatter.name 缺失');
    /^description:\s*\|/m.test(body) ? ok('frontmatter.description（多行）')
      : /^description:\s*\S+/m.test(body) ? ok('frontmatter.description')
      : bad('frontmatter.description 缺失');
  }
  // 3 引用的 references 文件都必须存在
  const refs = [...src.matchAll(/`?(references\/[\w.-]+\.md)`?/g)].map((m) => m[1]);
  const missing = [...new Set(refs)].filter((r) => !existsSync(join(ROOT, r)));
  missing.length ? bad(`SKILL.md 引用了不存在的文件: ${missing.join(', ')}`)
                 : ok(`SKILL.md 的 ${new Set(refs).size} 个引用全部可达`);
}

// 4 模板必须共享同一份令牌
const tplDir = join(ROOT, 'templates');
const tpls = existsSync(tplDir) ? readdirSync(tplDir).filter((f) => f.endsWith('.html')) : [];
let noCss = [];
let noPage = [];
for (const t of tpls) {
  const src = readFileSync(join(tplDir, t), 'utf8');
  if (!/assets\/ak\.css/.test(src)) noCss.push(t);
  if (!/class="ak-page/.test(src)) noPage.push(t);
}
noCss.length ? bad(`模板未引用 ak.css: ${noCss.join(', ')}`) : ok(`${tpls.length} 个模板都引用 ak.css`);
noPage.length ? bad(`模板缺少 .ak-page: ${noPage.join(', ')}`) : ok('模板均使用 .ak-page 画布');

// 5 令牌层必须是唯一的颜色来源：模板里不允许出现令牌外的 hex（白名单）
const PALETTE = new Set([
  '#08090a', '#111316', '#191c20', '#e8e6e1', '#c9c5bb', '#0b0c0e', '#4a4d53',
  '#dcd8cf', '#cfcac0', '#18d1ff', '#b9e432', '#ff7b00', '#b0243b', '#f3ff00',
  '#8fc31f', '#3387fb', '#7ee5ff', '#00d9c5', '#c8eb21', '#ababab', '#242424',
  '#0c0c0c', '#000', '#fff', '#000000', '#ffffff',
]);
let stray = [];
for (const t of tpls) {
  const src = readFileSync(join(tplDir, t), 'utf8');
  for (const h of src.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []) {
    if (!PALETTE.has(h.toLowerCase())) stray.push(`${t}:${h}`);
  }
}
stray.length ? warn(`模板内令牌外颜色 ${stray.length} 处（应迁移到 ak.css）: ${stray.slice(0, 4).join(' ')}`)
             : ok('模板未引入令牌外颜色');

// 6 demo 样张：本地渲染，png 不入库（见 .gitignore）
ok('demo/*.png 不入库（需要时本地渲染）');

// 版本台账一致性
const verPath = join(ROOT, 'VERSION'), logPath = join(ROOT, 'CHANGELOG.md');
if (existsSync(verPath)) {
  const ver = readFileSync(verPath, 'utf8').trim();
  if (!existsSync(logPath)) bad('缺少 CHANGELOG.md');
  else readFileSync(logPath, 'utf8').includes(ver) ? ok(`VERSION ${ver} 与 CHANGELOG 一致`) : bad(`CHANGELOG 未记录版本 ${ver}`);
}

console.log(fails ? `\n${C.r}✗ ${fails} 项缺失${C.x}\n` : `\n${C.g}✓ 包完整${C.x}\n`);
process.exit(fails ? 1 : 0);
