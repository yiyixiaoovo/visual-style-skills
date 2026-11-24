# 07 · 官方站点实测目录（4 个表面）

抓的是**原始 CSS**，不是渲染图。四个站点是鹰角家族不同的"语域"，混用会串味。
数值可直接对照 `00-evidence.md` 的 A 级条目。

---

## 表面一览

| 表面 | 地址 | 语域 | 主色 | 字族 |
|---|---|---|---|---|
| 游戏官网 | `ak.hypergryph.com` | 战术终端·夜间 | 黑底 + 青 `#18d1ff` | SourceHanSans / Bender / Oswald / Novecento Wide |
| 泰拉记事社 | `terra-historicus.hypergryph.com` | 纸本史料馆·日间 | **白纸 #fff** + **朱红 `#b0243b`** | SourceHanSans / Geometos / Gilroy / Novecento Wide |
| 国际服官网 | `arknights.global` | 同游戏官网，英文 | 黑底 + Oswald 主导 | Oswald / Bender / Noto Sans CJK / Novecento |
| 终末地官网 | `endfield.hypergryph.com` | 近未来工业·霓虹 | `#191919` + **荧光黄 `#fffa00`** + 品红 `#ff1aac` + 薄荷 `#00ffa2` | Gilroy / Novecento / **ProtestStrike**（模板喷字）/ HarmonyOS Sans |

> 结论：**「舟味」不是一个品牌色，是四套语域共用的排版纪律**。换语域时，变的只有纸/墨/强调色和圆角政策。

---

## 1. 泰拉记事社（最像"印刷品"的官方表面）

实测（175KB CSS）：

| 项 | 值 | 次数 | 说明 |
|---|---|---|---|
| 纸 | `#fff` | 84 | 纯白，不是米白 |
| 墨 | `#000` / `#212121` / `#434343` | 16 / 4 / 9 | 三级墨色 |
| **朱红** | **`#b0243b`** | **12** | 归档/印记/强调；另有更亮的 `#cd1a37` ×3 |
| 荧光黄 | `#fff000` | 2 | 与母品牌同源，点缀 |
| 灰阶 | `#696969` `#999` `#a0a0a0` `#d5d5d5` `#e5e5e5` `#f7f7f7` | — | 无阶梯，按需取 |
| 圆角 | **`.5625rem`(9px) ×14**、`.1875rem`(3px) ×7、`.125rem`(2px) ×7、`.5rem`(8px) ×5 | — | ⚠️ **这个站点有软圆角**，与游戏 UI 的 0/4px 不同 |
| 时长 | `opacity .3s` ×26、`height .3s` ×8 | — | 依旧是 .3s 统治 |
| 字族 | SourceHanSansCN（Regular/Normal/Medium/Bold/Heavy）+ Geometos + Gilroy-ExtraBold + NovecentoSansWide-Bold | — | 中文靠思源，标题靠 Geometos/Gilroy |
| 字距 | `-.125rem` `-.3rem` `-.875rem` | — | 大字负字距比官网更狠（-.875rem ≈ -14px） |
| 贴图 | **`noise.eb1256a4.png`** | 1 | **官方自己也用噪点贴图** |
| 其他 | `backdrop-filter` ×2、`@keyframes` ×10 | — | 极少量毛玻璃 |

**这个表面独有的手法**
- **白纸黑字 + 一处朱红**：整站只有一个彩色，且只出现在印章、分隔线、进度这类"印记"位置。
- **噪点是贴图不是滤镜**：所以质感是"纸"，不是"屏幕像素"。
- **圆角 2–9px**：印刷裁切的柔和边，不是 UI 的 0。

## 2. 终末地（另一套语域，别和方舟混用）

| 项 | 值 | 说明 |
|---|---|---|
| 底 | `#191919`；面板 `#35373c`；深 `#141414` `#1f1f22` | 中性灰阶是主体 |
| 主强调 | **`#fffa00`** ×22、`#fff000` ×6 | 荧光黄是主色，不是点缀 |
| 次强调 | `#ff1aac` 品红 ×6、`#00ffa2` 薄荷 ×6 | **三个高饱和色并存**，与方舟的单色纪律相反 |
| 圆角 | `50%` ×8、`2.625rem`(42px) ×3、`3.375rem`(54px) ×2、`.25rem` | **胶囊/大圆角** |
| 字族 | Gilroy / Novecento Wide / **ProtestStrike**（喷字模板）/ SpaceGrotesk | ProtestStrike 是"警示喷漆"气质 |
| 字距 | `-.0625rem` `-.58rem`（≈ -9px） | 大字压得极紧 |
| 装饰件 | `triangles.svg`、`subpage-title-pumper`、`subpage-title-bolt` | **标题带专属装饰件**（泵/螺栓），不是通用描边 |
| 时长 | `.2s` 主导（比 .3s 快一档） | |

**能借的**：标题装饰件（pumper/bolt）的思路——标题旁边挂一个语义化的工业构件；`triangles.svg` 这种几何碎片。
**不能借的**：三主色并行、大圆角——一进方舟语境就变成"另一个游戏"。

## 3. 国际服（英文语域的字体证据）

实测最有价值的是字族清单，把"什么字干什么活"钉死了：

| 字族 | 实测角色 |
|---|---|
| **Oswald** Bold / DemiBold | 英文标题、压缩显示字 |
| **Bender** / Bender-Light | 元信息标签、编号、制式文字 |
| **Novecento Wide** Medium/Bold、Novecento-Narrow | 宽体工业小标题 |
| Noto Sans CJK SC Regular/Medium/Bold/Black | 中文正文 |
| 系统栈（PingFang / YaHei / Arial） | 兜底 |

→ 这解释了为什么本包把 **Bahnschrift 当 Oswald 的替身**：它同样是"压缩工业无衬线"，而 Bahnschrift 是 Windows 自带、免授权。

## 4. 游戏官网（主阵地的三条硬规则，此前已测）

- 基底 `#000`、正文 `#fff`、次级 `#ababab`、水印字 `#242424`
- 唯一主强调 `#18d1ff`（34 次）；圆角 0 / 4px；零投影；`.3s` / `.6s` + 默认 ease
- 字距两端：`7rem / -.05em` 与 `.75rem / +2px`

---

## 语域选择表（先选语域，再谈风格）

| 你要做的 | 语域 | 底色 | 强调 | 圆角 | 参考模板 |
|---|---|---|---|---|---|
| 海报 / KV / 活动页 | 游戏官网 | 近黑 | 青 `#18d1ff` | 0 | `poster-3x4.html` |
| 人物档案 / 任务简报 | 游戏官网 | 近黑 | 青 / 阵营色 | 0 | `card-3x4.html` `slide-16x9.html` |
| 史料 / 卷宗 / 年鉴 / 印刷物 | **泰拉记事社** | **纸白** | **朱红 `#b0243b`** | **2–9px 允许** | `lore-a4.html` |
| 未来工业 / 霓虹 | 终末地 | `#191919` | 荧光黄 `#fffa00` | 胶囊 | （未建，需另立技能） |

**铁则：同一份物料里只能用一个语域。** 纸本页里放一块黑底霓虹，等于两本书拼在一起。
