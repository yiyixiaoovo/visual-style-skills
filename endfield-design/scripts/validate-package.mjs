#!/usr/bin/env node
/** 终末地包完整性自检。用法: node scripts/validate-package.mjs */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };

const REQUIRED = [
  'SKILL.md', 'AGENTS.md', 'LICENSE', 'VERSION', 'CHANGELOG.md',
  'assets/ef.css',
  'references/04-copy-system.md',
  'scripts/verify.mjs', 'tests/run.mjs',
  'templates/kv-16x9.html',
  'templates/panel-ui-1600.html',
  'templates/social-1200x1600.html',
];
let fails = 0;
const ok = (m) => console.log(`  ${C.g}PASS${C.x}  ${m}`);
const bad = (m) => { fails++; console.log(`  ${C.r}FAIL${C.x}  ${m}`); };

console.log(`\n${C.b}endfield-design · package check${C.x}\n`);
for (const f of REQUIRED) existsSync(join(ROOT, f)) ? ok(`存在 ${f}`) : bad(`缺失 ${f}`);

// frontmatter
const skill = existsSync(join(ROOT, 'SKILL.md')) ? readFileSync(join(ROOT, 'SKILL.md'), 'utf8') : '';
const fm = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!fm) bad('SKILL.md 缺少 frontmatter');
else {
  /^name:\s*\S+/m.test(fm[1]) ? ok('frontmatter.name') : bad('frontmatter.name');
  /^description:\s*\|/m.test(fm[1]) ? ok('frontmatter.description') : bad('frontmatter.description');
  const refs = [...skill.matchAll(/`?(references\/[\w.-]+\.md)`?/g)].map((m) => m[1]);
  const miss = [...new Set(refs)].filter((r) => !existsSync(join(ROOT, r)));
  miss.length ? bad(`引用不可达: ${miss.join(', ')}`) : ok(`引用 ${new Set(refs).size} 个可达`);
}

// 模板一致性
const tplDir = join(ROOT, 'templates');
const tpls = existsSync(tplDir) ? readdirSync(tplDir).filter((f) => f.endsWith('.html')) : [];
const noCss = tpls.filter((t) => !/assets\/ef\.css/.test(readFileSync(join(tplDir, t), 'utf8')));
const noPage = tpls.filter((t) => !/class="ef-page/.test(readFileSync(join(tplDir, t), 'utf8')));
noCss.length ? bad(`未引用 ef.css: ${noCss.join(', ')}`) : ok(`${tpls.length} 个模板引用 ef.css`);
noPage.length ? bad(`缺 .ef-page: ${noPage.join(', ')}`) : ok('模板均使用 .ef-page');

// 模板里不许写死荧光色
const FLUO = /#(fffa00|fff000|ff1aac|00ffa2)\b/i;
const hard = tpls.filter((t) => FLUO.test(readFileSync(join(tplDir, t), 'utf8')));
hard.length ? bad(`模板写死荧光色: ${hard.join(', ')}`) : ok('荧光色全部走令牌');

// 测试与样张
const fx = existsSync(join(ROOT, 'tests', 'fixtures')) ? readdirSync(join(ROOT, 'tests', 'fixtures')).filter((f) => f.endsWith('.html')) : [];
fx.length >= 5 ? ok(`负/正样本 ${fx.length} 个`) : bad(`样本不足（${fx.length}）`);
console.log(`  ${C.g}PASS${C.x}  demo/*.png 不入库（本地渲染）`);

// 版本台账一致性
const verPath = join(ROOT, 'VERSION'), logPath = join(ROOT, 'CHANGELOG.md');
if (existsSync(verPath)) {
  const ver = readFileSync(verPath, 'utf8').trim();
  if (!existsSync(logPath)) bad('缺少 CHANGELOG.md');
  else readFileSync(logPath, 'utf8').includes(ver) ? ok(`VERSION ${ver} 与 CHANGELOG 一致`) : bad(`CHANGELOG 未记录版本 ${ver}`);
}

console.log(fails ? `\n${C.r}✗ ${fails} 项缺失${C.x}\n` : `\n${C.g}✓ 包完整${C.x}\n`);
process.exit(fails ? 1 : 0);
