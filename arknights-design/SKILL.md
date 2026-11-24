---
name: arknights-design
description: |
  当用户要"舟味/明日方舟那种平面设计"——海报、活动主视觉、干员档案卡、信息图、幻灯片、封面、网页头图、社交图——时调用。
  覆盖：视觉语法拆解、设计令牌、版式配方、双语标签系统、几何图版生成、确定性质检、HTML→PNG/PDF 导出。
  不适用于：像素级复刻官方 UI 或角色立绘、需要官方字体与商标授权的商业物料、要"赛博朋克/蒸汽波"等其它风格、以及没有设计判断力兜底的纯 AI 批量出图。
---

# 舟味平面设计（Arknights-style editorial design）

把"感觉"变成规则。这个技能不教你"像不像明日方舟"，它给你一套**可执行、可质检**的编辑设计系统：
先把版面当成一册被投影到屏幕上的**军事档案**排好，再谈风格。

## 触发与不触发

**适用**：海报 / 活动 KV / 干员或角色档案卡 / 数据信息图 / 长图 / 16:9 幻灯片 / 封面 / 网页头图。
**不触发**：要求复刻官方 LOGO、干员立绘、官方 UI 截图的像素级还原；需要鹰角官方字体授权的商业交付；用户明确说要别的风格（赛博朋克霓虹、蒸汽波、极简北欧）。

## 内核：三条不可违反的纪律

1. **一页一套色**：黑 / 白 / 灰打底，有彩色最多 2 个（1 主强调 + 1 状态），另允许 1 处印章红。
2. **字距随字号反向**：显示级越大越紧（−0.05em），元信息越小越松（+0.18em）。这条错了，整张图立刻"不像"。
3. **圆角恒为 0**。所有斜切是 45° 或 90°，不存在 8px / 12px 的柔和圆角。

## 工作流（六步，不要跳步）

| # | 步骤 | 产物 | 详见 |
|---|---|---|---|
| 1 | **读 brief**：产出物形态、尺寸、语言、是否要动效、有没有图 | 一张清单 | 本文件「尺寸预设」 |
| 2 | **定张力**：锚点数 / 干扰密度 / 断裂层，三个量写死 | 一页只能断一层 | `references/08-narrative-engine.md` |
| 2.5 | **选配方**：从 8 个版式原型里挑 1 个，不允许自创布局 | 配方编号 R1–R8 | `references/03-layouts.md` |
| 3 | **定色 + 定调**：暗色 / 纸色二选一；主强调默认 signal 橙，状态默认 cyan | 2 个色号 | `references/02-tokens.md` |
| 4 | **搭骨架**：先放「五件套」——裁切标记、页眉标签、竖排轨道、出血巨字、数据栏 | 空壳 HTML | `templates/` |
| 5 | **填内容**：中文锚点 ≤ 12 字；英文标签查词库；编号按 07 格式 | 成稿 | `references/04-copy-system.md` |
| 6 | **自查 + 导出**：跑质检脚本、截图做三秒测试、导出 PNG/PDF | 交付件 | `references/05-quality-gates.md` |

产出物必须是**可直接打开的单文件 HTML**（外链 `assets/ak.css` 也行），不依赖构建、不依赖网络字体。

## 硬规则（违反任何一条即判定不合格）

| # | 规则 | 为什么 |
|---|---|---|
| 1 | `border-radius: 0`，无例外 | 圆角会立刻把它变成"通用 SaaS 风" |
| 2 | 有彩色 ≤ 2 + 印章红 1 处 | 舟味靠黑白灰的层级，颜色一多就散 |
| 3 | 显示级字号 `letter-spacing: -.05em`，元信息 `+.18em` | 西文压缩体的光学修正，是"高级感"的来源 |
| 4 | 巨字必须出血或贴近出血（≥ 视口宽的 60%） | 巨字不进出血就只是"大字标题" |
| 5 | 一页一个锚点，留白 ≥ 35% | 密→空→密，而不是均匀堆满 |
| 6 | 所有元信息走「等宽 + 全大写 + 宽字距」标签层 | 这一层承担 70% 的"档案感" |
| 7 | 中文不参与字号竞赛：有巨字（≥150px）时中文 ≤ 巨字 1/3；无巨字时中文 ≤ 72px 且 ≤ 西文 0.7× | 中西混排失衡是最大破绽 |
| 8 | 图像必须被处理：去色 / 双色调 / 网点，不允许原图直出 | 未处理的图会破坏单色纪律 |
| 9 | 动效只做三种：显影、打字、绘制；无回弹、无弹簧 | 机械感来自"匀速 + 突变"，不是弹跳 |
| 10 | 不用 box-shadow、不用发光、不用彩色渐变（网点与影像渐隐除外） | 发光 = 廉价赛博朋克 |

## 反模式（出现即返工）

- 紫/蓝渐变背景、渐变文字、玻璃拟态
- 圆角卡片 + 柔和投影 + 悬浮动效
- emoji 当图标、彩色线性图标
- 所有内容居中堆叠、均匀网格、没有静区
- 中英文同一字号并排、中文用英文压缩字体
- 直接写"科技感/未来感/极致体验"这类 AI 味口号
- 像素级复刻官方 LOGO、UI、立绘（版权 + 一眼假）

## 路由表

| 你要做的事 | 先读 |
|---|---|
| 不知道这个风格到底由哪些元素构成 | `references/01-visual-grammar.md` |
| 要改颜色 / 字体 / 间距 / 尺寸 | `references/02-tokens.md` |
| 要选一个版式、或把内容塞进某个版面 | `references/03-layouts.md` |
| 不知道英文标签写什么、编号怎么编 | `references/04-copy-system.md` |
| 出稿前自查、判断"够不够舟味" | `references/05-quality-gates.md` |
| 导出 PNG / PDF / 多尺寸 | `references/06-render-export.md` |
| 不确定某个值是不是"官方的"、能不能写死 | `references/00-evidence.md` |
| 判断这页该用"夜终端"还是"纸本"语域、能不能用软圆角 | `references/07-official-surfaces.md` |
| 客户给了照片/插画，不知道怎么裁、怎么处理 | `references/09-real-assets.md` |
| 版面看着平、不知道该放几个重点、从哪儿打破 | `references/08-narrative-engine.md` |

## 尺寸预设

| 形态 | 类名 | 像素 |
|---|---|---|
| 竖版海报 3:4 | `.ak-page--poster` | 1200 × 1600 |
| 幻灯片 16:9 | `.ak-page--slide` | 1600 × 900 |
| 档案卡 3:4 | `.ak-page--card` | 750 × 1000 |
| 正方形社交图 | `.ak-page--square` | 1080 × 1080 |
| A4 打印 | `.ak-page--a4` | 794 × 1123（96dpi） |

## 文件结构

```
arknights-design/
├── SKILL.md                      ← 你在这里
├── AGENTS.md                     ← 非 DSH harness 入口（Claude Code / Codex / Cursor…）
├── assets/
│   ├── ak.css                    ← 令牌 + 母题库（唯一依赖）
│   └── fonts.md                  ← 字体策略与许可
├── references/
│   ├── 00-evidence.md            ← 证据分级：哪些是实测，哪些是演绎
│   ├── 01-visual-grammar.md      ← 14 个母题：做法 / 用在哪 / 什么时候别用
│   ├── 02-tokens.md              ← 色彩、字阶、间距、动效、双模式
│   ├── 03-layouts.md             ← R1–R8 版式配方（含线框）
│   ├── 04-copy-system.md         ← 双语标签词库 + 编号体系 + 文案语气
│   ├── 05-quality-gates.md       ← 10 项质检 + 打分 + 反模式图鉴
│   ├── 06-render-export.md       ← 无头浏览器渲染、PDF、多尺寸
│   ├── 07-official-surfaces.md   ← 四个官方站点实测：语域 / 圆角政策 / 字族
│   ├── 08-narrative-engine.md    ← 构图张力：锚点数 × 干扰密度 × 断裂层
│   └── 09-real-assets.md         ← 真实素材接入：裁切 / 双色调 / 网点 / 版权
├── templates/
│   ├── poster-3x4.html           ← R1 档案封面（竖版海报）
│   ├── slide-16x9.html           ← R2 任务简报（幻灯片）
│   ├── card-3x4.html             ← R3 人物档案卡（纸色模式）
│   ├── infographic-square.html   ← R4 数据信息图（含 CSS 图表）
│   ├── chapter-square.html       ← R5 章节页
│   ├── kv-sixth-anniversary.html  ← R1+ 周年庆典 KV（制图 + 字符解构 + 鸽群）
│   ├── lore-a4.html              ← 纸本语域：A4 史料页（软圆角例外）
│   ├── longform-1200.html        ← R7 竖直长图（密→空→密）
│   ├── web-hero-1920.html        ← R8 网页头图（底部信息 dock）
│   └── longform-scroll.html      ← R7-S 滚动长图（sticky 进度 + 章节高亮）
│   └── spread-compare.html       ← R6 双栏对比跨页
├── scripts/
│   ├── verify.mjs                ← 单页质检：色数 / 圆角 / 字体 / 反模式
│   ├── validate-package.mjs      ← 包完整性自检
│   └── export.mjs                ← 批量 1×/2× 导出 + 尺寸校验
├── tests/
│   ├── run.mjs                   ← 质检脚本自测（负样本必须被拦下）
│   └── fixtures/                 ← 7 个样本：2 应通过 / 5 应被拦下
├── LICENSE / VERSION
└── demo/
    ├── poster.png                ← R1 样张（罗德岛青）
    ├── poster-rhine.png          ← 同一份 HTML，data-faction="rhine"
    ├── slide.png                 ← R2 样张
    ├── card.png                  ← R3 样张
    ├── infographic.png           ← R4 样张
    ├── chapter.png               ← R5 样张
    ├── kv-anniversary.png        ← 庆典 KV 样张（拉特兰冷调）
    └── lore.png                  ← 纸本史料页样张（泰拉记事社语域）
    └── spread.png                ← R6 样张
```

## 阵营配色（同一结构，换一个槽）

底色与墨色恒定，只换 `--ak-accent` 与 `--ak-status` 两个槽：

```html
<body class="ak" data-mode="dark" data-faction="rhodes">  <!-- 默认：青 #18d1ff -->
<body class="ak" data-mode="paper" data-faction="rhine">  <!-- 莱茵：纸白 + 橙 #ff7b00 -->
<body class="ak" data-mode="dark" data-faction="hyper">   <!-- 鹰角母品牌：荧光黄 #f3ff00 -->
<body class="ak" data-mode="dark" data-faction="terran">  <!-- 泰拉档案：朱红 #b0243b -->
<body class="ak" data-mode="dark" data-faction="laterano"><!-- 拉特兰庆典：圣光青 + 冷调中性色 -->
```

新增阵营只需在 `ak.css` 里加一条 `[data-faction="x"] { --ak-accent: ...; --ak-status: ...; }`，
**不允许**在模板里硬编码颜色。

## 安装

把整个 `arknights-design` 文件夹放进 `~/.dsh/skills/`（Windows：`%USERPROFILE%\.dsh\skills\`），重开会话即可被索引。

## 与终末地的分界

**明日方舟 ≠ 终末地**，两套是平行语域，硬混会互相污染：

| | 本技能（方舟） | `endfield-design`（终末地） |
|---|---|---|
| 色 | 单主色 + 单状态 | 三色并行（黄/品红/薄荷） |
| 形 | 圆角 0，斜切 | 42/54px 胶囊 |
| 光 | 禁发光 | 允许荧光晕 |
| 气质 | 档案、军事 | 工业、霓虹、产品页 |

一句判别：**同时出现「胶囊 + 荧光 + 三色」就是终末地；出现「编号 + 裁切标记 + 单色 + 直角」就是方舟。**

## 边界

- **这是同人向风格方法，不是官方设计规范**：色彩与字型是"受其启发"的再实现，不复制鹰角商标、LOGO、立绘、UI 像素。
- 出现「罗德岛 / 源石 / 干员」等专有名词时，仅作风格演示；对外商业物料须替换为自有设定名词。
- 官方字体（Bender / Novecento Wide / Geometos）非免费，默认不使用；见 `assets/fonts.md` 的替代栈。
