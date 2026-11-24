#!/usr/bin/env node
/** 把 templates/ 下所有 HTML 一次跑完 verify。用法: node scripts/verify-all.mjs */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = readdirSync(join(ROOT, 'templates'))
  .filter((f) => f.endsWith('.html'))
  .sort()
  .map((f) => join('templates', f));

const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'verify.mjs'), ...files], { stdio: 'inherit' });
process.exit(r.status ?? 1);
