# 字体策略

## 1. 官方实际用什么（侦察结论，来自 ak.hypergryph.com 与 hypergryph.com 的 CSS）

| 家族 | 角色 | 许可 |
|---|---|---|
| `SourceHanSans-Regular/Medium/Bold/Heavy` | 中文正文与标题（思源黑体 SC） | SIL OFL，免费可商用 |
| `Bender-Regular/Bold` | 拉丁小标签、编号、制式文字 | 商业字体，**不可免费商用** |
| `Oswald-Medium/DemiBold` | 拉丁压缩体，巨型数字/标题 | SIL OFL，免费可商用 |
| `Novecentosanswide-*` | 宽体工业小标题 | 商业字体，**不可免费商用** |
| `Geometos` | 鹰角母品牌几何展示体 | 商业字体，**不可免费商用** |

官方 CSS 里 **没有 fallback 栈**，一个字重就是一个字体家族（`font-family: Oswald-Medium`）。
我们**不复制这种写法**——那会让离线渲染直接掉字。

---

## 2. 本系统的栈（免费 / 系统自带，离线可用）

```css
--ak-font-display: "Bahnschrift","Oswald","Archivo Narrow","Arial Narrow",
                   "Noto Sans SC","Microsoft YaHei",sans-serif;
--ak-font-ui:      "Bahnschrift","Segoe UI","Noto Sans SC","Microsoft YaHei",sans-serif;
--ak-font-zh:      "Microsoft YaHei","Noto Sans SC","PingFang SC","Source Han Sans SC",sans-serif;
--ak-font-mono:    "Cascadia Mono","Consolas","JetBrains Mono","IBM Plex Mono",monospace;
```

| 角色 | 首选 | 为什么 | 备选 |
|---|---|---|---|
| 显示 | **Bahnschrift** | Windows 10+ 自带，DIN 变体，压缩机械，最接近 Oswald 的气质 | Oswald（Google Fonts） |
| 中文 | **微软雅黑** | 全平台 Windows 必有；字面干净、字重齐 | Noto Sans SC / 思源黑体 |
| 等宽 | **Cascadia Mono** | Windows 11 自带；`0` 带斜线，编号更"仪器" | Consolas / JetBrains Mono |

**不要用**：Arial / Helvetica（太通用）、思源宋体（语域不对，那是古典不是军工）、任何手写体。

---

## 3. 三条排版纪律

1. **一个字重一个用法**：显示只用 700，正文 400/500。不要用 300 细体做大标题——会变成时装广告。
2. **中文永不进显示栈**：压缩西文没有汉字字形，回退时字宽会变，整版塌掉。
3. **字距必须显式写**：西文默认字距在巨字上显松、在标签上显挤，两端都要手调（−.05em / +.18em）。

---

## 4. 需要更高保真时

| 想要 | 做法 | 代价 |
|---|---|---|
| 更接近 Oswald 的压缩感 | 联网加载 Oswald 400/700 | 离线渲染会回退 |
| 更接近 Novecento Wide | 加载 `Archivo Black` 或 `Bebas Neue`（均免费） | 字形略有差异 |
| 完全离线 + 高保真 | 把 woff2 base64 内嵌进 HTML | 文件体积 +200–400KB，只在最终交付件里做 |

**内嵌写法**（仅交付件）：

```css
@font-face {
  font-family: "AK Display";
  src: url("data:font/woff2;base64,....") format("woff2");
  font-display: block;
}
```

---

## 5. 许可红线

- Bender / Novecento Wide / Geometos 是**商业字体**：不得随模板分发，不得用于商业物料。
- 思源黑体（Source Han Sans）与 Oswald 是 OFL：可商用，但需保留版权声明。
- 本项目只使用**系统自带字体**，因此可以直接分发。

---

## 6. 跨平台兜底（macOS / Linux）

Windows 上 `Microsoft YaHei` 一直在，macOS 与 Linux 不一定。两种做法：

**A. 引入 `assets/font-face.css`（推荐）**
用 `@font-face { src: local(...) }` 把字体名 `"AK Sans"` 映射到当前系统最好的中文字体：

```html
<link rel="stylesheet" href="../assets/ak.css">
<link rel="stylesheet" href="../assets/font-face.css">
```

维护顺序：PingFang SC（mac）→ Microsoft YaHei（win）→ Noto Sans CJK SC / Source Han Sans SC（linux）→ WenQuanYi（兜底）。
不需要改模板；不内嵌任何字体文件。

**B. 内嵌子集（仅交付件）**

```bash
pyftsubset NotoSansSC-Regular.otf --text-file=chars.txt \
  --flavor=woff2 --output-file=ak-zh.woff2
```

全量中文子集 2–4MB；只保留实际用到的 300–800 字通常 60–140KB，可直接 base64 内嵌。

**核对**：在目标系统打开 `demo/font-check.html`，逐项看字面大小、回退是否变形、标点位置、数字是否等宽。