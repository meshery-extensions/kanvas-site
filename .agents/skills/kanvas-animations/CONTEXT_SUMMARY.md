# Kanvas Animation Plugin Context Summary

## Stack

Hugo static site + GSAP 3.13 + ScrollTrigger + vanilla JS + SCSS.
No React, no npm bundler, no Framer Motion, no Tailwind.

## Applicable Skills

| Skill | Path | Use When |
|-------|------|---------|
| **gsap** | skills/gsap/SKILL.md | GSAP API, scrubEach(), timelines, CDN setup |
| **scroll-animations** | skills/scroll-animations/SKILL.md | ScrollTrigger scrub patterns, recession, parallax depth |
| **css-animations** | skills/css-animations/SKILL.md | SCSS transitions, hover states, keyframes, SCSS variables |
| **glass-morphism** | skills/glass-morphism/SKILL.md | Glass card pattern, backdrop-filter, gradient borders |

## Not Applicable to This Project

| Skill | Reason |
|-------|--------|
| framer-motion | Requires React |
| spring-physics | Requires React (react-spring/motion) |
| All other React/TypeScript patterns | No React in this project |

## Agent Index

| Agent | Use When |
|-------|---------|
| **animation-architect** | Planning new section animations, scroll choreography, main.js structure |
| Others (motion-designer, etc.) | Not adapted for this stack — use animation-architect instead |

## When to Open Deeper Docs

| Signal | Open |
|--------|------|
| Need GSAP API or scrubEach patterns | skills/gsap/SKILL.md |
| Adding scroll animations to a new section | skills/scroll-animations/SKILL.md |
| Building or modifying glass card components | skills/glass-morphism/SKILL.md |
| Writing SCSS transitions or hover states | skills/css-animations/SKILL.md |
| Planning animation architecture | agents/animation-architect.md |

## Commands (Claude Code slash skills)

These live in .claude/skills/ and are installed by `make setup-claude`:

| Command | What It Does |
|---------|-------------|
| /new-section <name> | Scaffolds partial + SCSS + import + GSAP stub |
| /gsap-animations | GSAP + ScrollTrigger reference for this project |
| /scroll-animations | Scrub architecture and scrubEach patterns |
| /glass-morphism | Glass card SCSS patterns |
