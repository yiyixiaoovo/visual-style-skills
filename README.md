# Visual Style Skills

两套平行的视觉风格技能包，**语域相反，不要混用**。

| 包 | 触发场景 | 一句话 |
|---|---|---|
| `arknights-design/` | 明日方舟那种档案 / 军事 / 编辑设计 | 单色纪律 + 直角 + 实测令牌 + 10 项质检 |
| `endfield-design/` | 终末地那种近未来工业 / 荧光霓虹 | 三色职责 + 42–54px 胶囊 + 发光 |

## 怎么选

- 出现「档案编号 + 裁切标记 + 单色 + 直角」→ 方舟包
- 出现「胶囊 + 荧光 + 三色」→ 终末地包
- 一张图里两种都有 → 返工，不是融合

## 快速开始

```bash
node arknights-design/scripts/validate-package.mjs   # 包完整性
node arknights-design/scripts/verify.mjs <页面.html> # 单页质检
node arknights-design/tests/run.mjs                  # 质检脚本自测
node endfield-design/scripts/verify.mjs <页面.html>  # 终末地质检
node endfield-design/scripts/validate-package.mjs   # 终末地包完整性
node endfield-design/tests/run.mjs                   # 终末地质检自测
node arknights-design/scripts/export.mjs             # 1× / 2× 批量导出 + 尺寸校验
```

## 许可

各包 LICENSE（MIT + NOTICE）。同人向风格研究，与鹰角网络无隶属关系；不含官方素材与商业字体。