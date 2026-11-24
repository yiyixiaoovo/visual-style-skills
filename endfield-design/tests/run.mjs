#!/usr/bin/env node
/** 终末地质检脚本自测：负样本必须 FAIL，正样本必须 PASS。用法: node tests/run.mjs */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERIFY = join(ROOT, 'scripts', 'verify.mjs');
const FIX = join(ROOT, 'tests', 'fixtures');

const CASES = [
  { file: 'good-minimal.html', expect: 0, why: '最小合法页' },
  { file: 'bad-glow.html', expect: 1, why: '3 处光晕（上限 2）' },
  { file: 'bad-radius.html', expect: 1, why: '20px 中间档圆角' },
  { file: 'bad-hex.html', expect: 1, why: '荧光色写死不走令牌' },
  { file: 'bad-copy.html', expect: 1, why: '营销词 + emoji' },
];

const C = { r: '\x1b[31m', g: '\x1b[32m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };
let bad = 0;
console.log(`\n${C.b}endfield verify self-test${C.x}\n`);
for (const c of CASES) {
  const p = join(FIX, c.file);
  if (!existsSync(p)) { console.log(`  ${C.r}MISS${C.x}  ${c.file}`); bad++; continue; }
  const r = spawnSync(process.execPath, [VERIFY, p], { encoding: 'utf8' });
  const got = r.status ?? 1;
  const ok = got === c.expect;
  if (!ok) bad++;
  console.log(`  ${ok ? `${C.g}✔${C.x}` : `${C.r}✘${C.x}`}  ${c.file.padEnd(22)} 期望 exit=${c.expect} 实际=${got}   ${C.d}${c.why}${C.x}`);
}
console.log(bad ? `\n${C.r}✗ ${bad} 项不符合预期${C.x}\n` : `\n${C.g}✓ 全部符合预期（${CASES.length} 项）${C.x}\n`);
process.exit(bad ? 1 : 0);
