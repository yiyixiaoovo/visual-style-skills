# AGENTS.md — 非 DSH harness 入口

如果你不是 DeepSeek Harness（Claude Code / Codex / Cursor / Qwen Code / Gemini CLI / 任意 AGENTS.md 读取方），从这份文件进入。

## 这是什么

一套「舟味」编辑设计系统：把明日方舟 / 鹰角那种**军事档案印刷品**的排版语言，做成可执行的令牌 + 版式配方 + 质检脚本。产出是**单文件 HTML**，可导出 PNG / PDF。

## 三步上手

1. **读 `SKILL.md`** —— 触发条件、六步工作流、10 条硬规则、路由表。这是唯一入口。
2. **选一个模板复制**，不要从零写：
   - `templates/poster-3x4.html`（R1 档案封面）
   - `templates/slide-16x9.html`（R2 任务简报）
   - `templates/card-3x4.html`（R3 人物档案卡，纸色模式）
   - `templates/infographic-square.html`（R4 数据信息图）
   - `templates/chapter-square.html`（R5 章节页）
   - `templates/spread-compare.html`（R6 双栏对比）
   - `templates/kv-sixth-anniversary.html`（周年庆典 KV，拉特兰冷调）
3. **交付前必跑**：
   ```bash
   node scripts/verify.mjs <你的.html>        # 单页质检，10 项
   node scripts/validate-package.mjs          # 技能包完整性自检
   ```

## 不可违反的五条（详见 SKILL.md）

1. 圆角恒为 0
2. 有彩色 ≤ 2（+ 印章红 1 处）
3. 字距随字号反向：巨字 −0.05em，微标签 +0.18em
4. 一页一个锚点，留白 ≥ 35%
5. 不用投影、不用发光、不用装饰渐变

## 目录

```
SKILL.md                 入口
assets/ak.css            令牌 + 母题库（唯一依赖）
assets/fonts.md          字体策略与许可
references/00-evidence.md  证据分级（哪些是实测、哪些是演绎）
references/01..06        语法 / 令牌 / 配方 / 文案 / 质检 / 导出
templates/*.html         可直接复制的版面
scripts/verify.mjs       确定性质检
scripts/validate-package.mjs  包完整性自检
demo/*.png               渲染样张
```

## 边界

同人向风格方法，非官方规范。不复制鹰角商标、LOGO、立绘、官方 UI 像素；官方字体（Bender / Novecento / Geometos）为商业字体，不得随包分发。
