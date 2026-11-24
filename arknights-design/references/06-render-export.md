# 06 · 渲染与导出

模板是**单文件 HTML**，不依赖构建。导出走无头浏览器，一条命令出图。

---

## 1. 命令行（Windows）

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
# 若装了 Chrome：
# $edge = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$src = "file:///E:/path/to/poster.html"
$out = "E:\path\to\out.png"

& $edge --headless=new --disable-gpu --hide-scrollbars --no-first-run `
        --user-data-dir="$env:TEMP\ak-render" `
        --force-device-scale-factor=2 `
        --window-size=1200,1600 `
        --screenshot=$out $src
```

- `--window-size` 必须**等于页面尺寸**，否则会截出滚动条或留白。
- `--force-device-scale-factor=2` 出 2×（2400×3200），交付用；预览用 1×。
- 连续截多张时，`--user-data-dir` 每张换一个，否则第二个进程会抢锁失败。

## 1.5 自定义尺寸必写 `min-height: 0`

`.ak-page` 基线有 `min-height: 1600px`（竖版海报默认）。自定义尺寸时只写 `height` 会被它压住：
页面仍是 1600 高，底部 dock / footer 直接掉出截图外——本次做 R8 网页头图时就踩过（1920×1080 截出来没有底栏）。

```css
.ak-page { width: 1920px; height: 1080px; min-height: 0; }  /* ← min-height 不能漏 */
```

## 1.6 窄屏截图：Chromium 有最小窗口宽度（≈500px）

`--window-size=375,812` 在 Windows 上实际开出的是 **496px 视口**，页面按 496 排版、截图却裁成 375——
看起来像"移动端横向溢出"，其实是测试方法错了。**先量再怪 CSS**：

```js
document.title = JSON.stringify({ vw: innerWidth, mq: matchMedia('(max-width:1023px)').matches });
// 用 --dump-dom 读 <title>，vw 不是 375 就说明没模拟成功
```

要真 375 视口，用一个 iframe 包一层：

```html
<iframe src="../templates/web-hero-1920.html" style="width:375px;height:812px;border:0"></iframe>
```

## 2. 尺寸对照

| 页面类 | `--window-size` | 2× 产物 |
|---|---|---|
| `.ak-page--poster` | `1200,1600` | 2400 × 3200 |
| `.ak-page--slide` | `1600,900` | 3200 × 1800 |
| `.ak-page--card` | `750,1000` | 1500 × 2000 |
| `.ak-page--square` | `1080,1080` | 2160 × 2160 |
| `.ak-page--a4` | `794,1123` | 1588 × 2246 |

## 3. PDF

```powershell
& $edge --headless=new --disable-gpu --no-pdf-header-footer `
        --print-to-pdf="out.pdf" $src
```

- A4 版请用 `.ak-page--a4`，并在 CSS 里 `@page { size: A4; margin: 0 }`。
- 多页：把多张 `.ak-page` 放进同一个 HTML，每个 `.ak-page` 自动分页（`page-break-after: always`）。
- PDF 里的字体是矢量，适合印刷；PNG 适合社媒。

## 4. 动效

本系统**默认不做视频**。若必须动：

1. 动效只允许显影 / 打字 / 绘制（见 `02-tokens.md` §5）。
2. 录屏方案：起一个本地静态服务 → 用浏览器录屏或 Playwright `video` 录制。
3. 逐帧方案（可控、推荐）：CSS 用 `animation-play-state: paused` + JS 设 `animation-delay: -Ns` 定帧，循环截图后 ffmpeg 合成。帧率 30，时长按 3–6 秒设计。
4. `prefers-reduced-motion` 必须降级为静态，这是硬性可访问性要求。

## 5. 文件命名

```
项目_形态_阵营_编号_尺寸.png
AK07_poster_rhodes_07_2400x3200.png
AK07_slide_rhine_00_3200x1800.png
```

- 编号与画面里的页脚编号一致，方便对版。
- 不要用 `final`、`v2`、`副本`。

## 6. 交付前自检

- [ ] 图片尺寸与 `--window-size × scale` 一致（用系统属性核对，不要凭感觉）
- [ ] 2× 图在 100% 缩放下边缘不发虚（说明是矢量渲染，不是截图拉伸）
- [ ] 字体没有被替换（打开 HTML 对比）；Windows 上没有 Bahnschrift 时，会退化到 Arial Narrow，需要接受或内嵌字体
- [ ] 暗色版在黑底 App 里不糊边（导出 PNG 带透明 vs 不透明要确认）
