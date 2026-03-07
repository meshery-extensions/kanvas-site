# AGENTS.md

Instructions for AI coding assistants working in this repository.

## Build & Development Commands

```bash
make setup          # Install npm dependencies (postcss, autoprefixer)
make site           # Dev server with drafts: hugo server -D -F --disableFastRender --ignoreCache
make build          # Production build: hugo
make clean          # Clean build cache and restart
make setup-claude   # Bootstrap local Claude Code config (see below)
```

Hugo dev server runs at `http://localhost:1313` by default.

## Architecture

**Static site built with Hugo** — no React/Vue/JS framework. Pages are Hugo templates (Go HTML), styled with SCSS, animated with GSAP + vanilla JS.

### Key Structure
- `layouts/index.html` — Homepage definition, assembles sections via `{{ partial }}` calls
- `layouts/partials/section/` — Each homepage section is a separate partial (hero-glass, customers, hero, demo, capabilities, community, browser)
- `layouts/_default/baseof.html` — Base HTML wrapper (head → navbar → main → footer)
- `assets/scss/` — All styles; `_styles_project.scss` is the import manifest
- `static/scripts/` — Vanilla JS: `main.js` (GSAP animations), `hero-glass.js` (3D tilt), `multi-player-cursors.js` (cursor sim)
- `hugo.toml` — Hugo config (baseURL: https://www.kanvas.new)

### Homepage Sections (in order)
1. **hero-glass** — 3D tilting glass card with canvas preview + multi-player cursors
2. **customers** — Infinite GSAP marquee of company logos
3. **hero** — Large "Step aside, YAML" heading with counters
4. **demo** — YouTube embed + feature card + persona cards
5. **capabilities** — 9-card feature grid
6. **community** — 5-card community links grid
7. **browser** — Mock macOS browser with rotating 3D logo

### Styling
- Pure SCSS (no Tailwind) — `_variables_project.scss` defines color palette, fonts, spacing
- Primary: `#00b39f`, Secondary: `#00d3a9`, Dark BG: `#121212`
- Font: Qanelas Soft (custom OTF, 15 weights in `static/fonts/`)
- Glass effects use `backdrop-filter: blur()` + gradient borders with mask-composite
- CSS custom properties for cursor-tracking tilt: `--tilt-x`, `--tilt-y`, `--cursor-x`, `--cursor-y`

### JavaScript
- GSAP 3.13 + ScrollTrigger 3.12.5 loaded via CDN in `footer.html`
- `hero-glass.js` updates CSS custom properties on pointermove for 3D perspective tilt
- `multi-player-cursors.js` creates animated cursor elements with social proof indicators
- `main.js` handles GSAP timeline for header, counter animations, marquee, scroll detection

### Conventions
- All external links use `target="_blank" rel="noreferrer"`
- `prefers-reduced-motion` media query disables all animations
- Responsive breakpoints: 960px, 768px/720px, 480px
- Hugo pipes handle SCSS compilation and PostCSS processing
- Always use `$primary` SCSS variable — never hardcode `#00b39f`
- Scroll animations are scrub-based (`scrub: 1`) via `scrubEach()` — never one-shot `gsap.from()`

## Claude Code Setup

If you use [Claude Code](https://claude.ai/code), run once after cloning:

```bash
make setup-claude
```

This copies agent definitions, skill templates, and hook configuration from `contrib/claude/` into your local `.claude/` directory.

### What you get

**Agents** (auto-invoked by Claude during relevant tasks):
- `ux-reviewer` — reviews CSS/GSAP/HTML changes against the Kanvas design vision
- `hugo-template-reviewer` — catches Go template syntax bugs before `make build`

**Skills** (invoke with `/skill-name` in Claude Code):
- `/new-section <name>` — scaffolds a complete homepage section (partial + SCSS + import + GSAP stub)

**Hooks** (run automatically on every edit):
- Blocks edits to `public/` (Hugo build output, wiped on next build)
- Validates SCSS by running `hugo --renderToMemory` after `.scss` edits

**MCP Servers** (configured in `.mcp.json` at repo root):
- `github` — manage issues, PRs, CI status. Requires `GITHUB_PERSONAL_ACCESS_TOKEN` env var.
- `context7` — live Hugo and GSAP documentation lookup

### Hook scripts (non-Claude contributors)

The scripts in `scripts/hooks/` work independently of Claude Code and can be wired as git hooks:

```bash
ln -s ../../scripts/hooks/block-public-edits.sh .git/hooks/pre-commit
```
