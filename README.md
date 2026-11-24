# Visual Style Skills

**简体中文** | [English](README.en.md)

> 两套**平行**的视觉风格技能包：把「看起来像明日方舟 / 终末地」拆成可执行、可质检的规则。
> 产物是**单文件 HTML**，可截图、可打印、不依赖构建、不依赖网络字体。

[![License: MIT](https://img.shields.io/badge/license-MIT-black)](LICENSE)
![no dependencies](https://img.shields.io/badge/dependencies-0-black)
![node](https://img.shields.io/badge/node-%E2%89%A518-black)

## 是什么

不是 prompt 集合，是**设计系统**：令牌 + 母题库 + 版式配方 + 文案系统 + 确定性质检 + 导出链。
每个包都能被 AI agent 直接加载（`SKILL.md`），也能被人直接复制模板用。

## 两套语域，方向相反

| | `arknights-design` | `endfield-design` |
|---|---|---|
| 色 | 单主色 + 单状态（≤2 有彩） | 三色并行，各有职责 |
| 形 | 圆角 0，斜切 45° | 42 / 54px 胶囊 + 50% 圆 |
| 光 | 零投影、禁发光 | 荧光晕，每页 ≤2 处 |
| 字 | 压缩工业体（Oswald 系） | Gilroy / 宽体 + 超紧字距 |
| 节奏 | `.3s` / `.6s`，沉稳 | `.2s`，快一档 |
| 气质 | 档案、军事、克制 | 工业、霓虹、产品页 |

**怎么选**：出现「档案编号 + 裁切标记 + 单色 + 直角」→ 方舟包；出现「胶囊 + 荧光 + 三色」→ 终末地包。
一张图里两种都有 → 返工，不是融合。

## 预览

| 档案封面 | 人物档案卡 | 数据信息图 |
|---|---|---|
| <img src="arknights-design/demo/poster.png" width="240"> | <img src="arknights-design/demo/card.png" width="240"> | <img src="arknights-design/demo/infographic.png" width="240"> |

| 纸本史料页 | 庆典 KV | 终末地面板 |
|---|---|---|
| <img src="arknights-design/demo/lore.png" width="240"> | <img src="arknights-design/demo/kv-anniversary.png" width="240"> | <img src="endfield-design/demo/panel-ui.png" width="240"> |

## 快速开始

```bash
# 一次跑完两包的包完整性 + 自测
npm run check

# 单页质检（色数 / 圆角 / 字体 / 字距 / 结构 / 文案）
node arknights-design/scripts/verify.mjs arknights-design/templates/poster-3x4.html

# 全部模板质检 / 1×+2× 导出并校验尺寸
npm run verify
npm run export
```

## 目录

```
arknights-design/          11 个模板 · 9 篇参考 · 4 个脚本
├── SKILL.md               入口：工作流、10 条硬规则、路由表
├── references/            00 证据分级 … 09 真实素材接入
├── templates/             R1–R8 + 庆典 KV + 纸本史料页 + 滚动长图
├── scripts/               verify / validate-package / export / verify-all
├── tests/                 7 个样本（负样本必须被拦下）
└── demo/                  渲染样张 + 动效页 + 字体核对页

endfield-design/           3 个模板 · 1 篇文案库 · 3 个脚本
├── SKILL.md               三色职责、圆角政策、发光纪律
├── references/04-copy-system.md
├── templates/             KV / 系统面板 / 竖版社交图
└── tests/                 5 个样本
```

## 质量闸门

| 机制 | 说明 |
|---|---|
| **证据分级** | 每个令牌标注 A 实测 / B 推断 / C 演绎；四个官方站点的 CSS 逐项比对 |
| **确定性 lint** | 色相数、圆角政策、字体白名单、字距、结构件、禁用词——不过关不出稿 |
| **负样本自测** | `tests/` 里有「必须失败」的页面，防止质检脚本自己失效 |
| **导出校验** | 读 PNG 文件头核对像素，22 次导出全部对得上 |

## 安装为 Agent 技能

```bash
cp -r arknights-design ~/.dsh/skills/      # DSH
cp -r arknights-design ~/.claude/skills/   # Claude Code
# Codex / Cursor / Qwen Code：读根目录 AGENTS.md
```

## 许可与边界

MIT（见 `LICENSE`，含 NOTICE）。这是**同人向风格研究**，与鹰角网络无隶属关系，未获授权：
不含官方商标、LOGO、角色立绘、UI 截图与商业字体文件。文中提及的第三方项目仅作事实引用，其许可独立。
