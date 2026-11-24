# Visual Style Skills

[简体中文](README.md) | **English**

> Two **parallel** visual-style skills that turn "looks like Arknights / Endfield" into rules you can execute and lint.
> Output is **single-file HTML** — screenshot-able, printable, no build step, no web fonts.

[![License: MIT](https://img.shields.io/badge/license-MIT-black)](LICENSE)
![no dependencies](https://img.shields.io/badge/dependencies-0-black)
![node](https://img.shields.io/badge/node-%E2%89%A518-black)

## What it is

Not a prompt pack — a **design system**: tokens + a motif library + layout recipes + a copy system + deterministic lint + an export chain.
Each package loads directly as an AI-agent skill (`SKILL.md`) and is also usable by hand: copy a template, edit the copy, ship.

## Two registers, deliberately opposite

| | `arknights-design` | `endfield-design` |
|---|---|---|
| Colour | one accent + one status (≤2 chromatic) | three accents, each with a fixed role |
| Shape | radius 0, 45° chamfers | 42 / 54px pills + 50% circles |
| Light | no shadows, no glow | fluorescent halos, ≤2 per page |
| Type | condensed industrial (Oswald family) | wide grotesque, very tight tracking |
| Motion | `.3s` / `.6s`, calm | `.2s`, one step faster |
| Mood | archive, military, restrained | industrial, neon, product page |

**How to choose**: archive numbers + crop marks + monochrome + square corners → Arknights pack.
Pills + fluorescence + three hues → Endfield pack. Both in one layout → redo it; don't blend.

## Preview

| Dossier cover | Operator file card | Data dossier |
|---|---|---|
| <img src="arknights-design/demo/poster.png" width="240"> | <img src="arknights-design/demo/card.png" width="240"> | <img src="arknights-design/demo/infographic.png" width="240"> |

| Paper archive page | Anniversary KV | Endfield panel |
|---|---|---|
| <img src="arknights-design/demo/lore.png" width="240"> | <img src="arknights-design/demo/kv-anniversary.png" width="240"> | <img src="endfield-design/demo/panel-ui.png" width="240"> |

## Quick start

```bash
# package integrity + self-tests for both packs
npm run check

# lint one page (colour count / radius / fonts / tracking / structure / copy)
node arknights-design/scripts/verify.mjs arknights-design/templates/poster-3x4.html

# lint every template / export at 1× and 2× and verify pixel dimensions
npm run verify
npm run export
```

## Layout

```
arknights-design/          11 templates · 9 references · 4 scripts
├── SKILL.md               workflow, 10 hard rules, routing table
├── references/            evidence tiers … real-asset integration
├── templates/             R1–R8 + anniversary KV + paper archive + scrolling longform
├── scripts/               verify / validate-package / export / verify-all
├── tests/                 7 fixtures (negative ones must be rejected)
└── demo/                  rendered samples + motion demo + font check

endfield-design/           3 templates · 1 copy guide · 3 scripts
├── SKILL.md               tri-colour roles, radius policy, glow budget
├── references/04-copy-system.md
├── templates/             KV / system panel / vertical social
└── tests/                 5 fixtures
```

## Quality gates

| Mechanism | What it does |
|---|---|
| **Evidence tiers** | every token is graded A (measured) / B (inferred) / C (stylistic); four official sites were diffed value by value |
| **Deterministic lint** | chromatic count, radius policy, font allowlist, tracking, structural parts, banned copy — no pass, no delivery |
| **Negative fixtures** | pages that *must* fail, so the linter can't silently rot |
| **Export check** | PNG headers are parsed and compared to expected pixels; 22 exports verified |

## Install as an agent skill

```bash
cp -r arknights-design ~/.dsh/skills/      # DeepSeek Harness
cp -r arknights-design ~/.claude/skills/   # Claude Code
# Codex / Cursor / Qwen Code: read the root AGENTS.md
```

## License & boundaries

MIT (see `LICENSE`, including NOTICE). This is an **unofficial fan study**, not affiliated with or endorsed by Hypergryph.
No official trademarks, logos, character art, UI screenshots or commercial font files are included.
Third-party projects are cited as facts only; their licenses apply separately.
