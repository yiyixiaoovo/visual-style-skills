# AGENTS.md — 非 DSH harness 入口（终末地包）

适用于 Claude Code / Codex / Cursor / Qwen Code / 任何读取 `AGENTS.md` 的宿主。

## 这是什么

「终末地」近未来工业／荧光霓虹语域的视觉技能包。产出**单文件 HTML**，可截图 / 打印。
与 `arknights-design` 是**平行**关系，不是它的变体——两套的底层纪律正好相反。

## 三步上手

1. 读 `SKILL.md`（触发条件、五条硬规则、与方舟的分界线）。
2. 复制模板：
   - `templates/kv-16x9.html` — 网页主视觉
   - `templates/panel-ui-1600.html` — 系统面板（侧栏 + 数据卡）
   - `templates/social-1200x1600.html` — 竖版社交图
3. 交付前必跑：

```bash
node scripts/validate-package.mjs
node scripts/verify.mjs <你的.html>
node tests/run.mjs
```

## 不可违反（详见 SKILL.md）

1. 三色不许串岗：黄=主操作、品红=状态、薄荷=确认
2. 圆角只允许 4/8/42/54px、50%；禁止方角与非胶囊中间档
3. 发光只给荧光色，每页 ≤2 处，模糊 ≤60px
4. 大标题必须紧字距，至少一行描边或反白
5. 荧光色一律走 `var(--ef-*)`，不许写死 hex

## 目录

```
SKILL.md · AGENTS.md · LICENSE · VERSION · CHANGELOG.md
assets/ef.css
references/04-copy-system.md   操作语汇文案库
scripts/verify.mjs             11 项质检
scripts/validate-package.mjs   包完整性
templates/*.html               3 个版面
demo/*.png
```

## 边界

同人向风格方法，与鹰角网络无隶属关系；不含官方素材与商业字体（Gilroy / ProtestStrike / Novecento 均未分发）。
