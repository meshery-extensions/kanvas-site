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
- GSAP and ScrollTrigger 3.13.0 load via CDN in `layouts/partials/footer.html`, GSAP core first: ScrollTrigger needs it
- Vanilla JS in `static/scripts/` - no bundler, no imports
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
- No inline `style="..."` in HTML - styling belongs in SCSS
- Never edit `public/` - it is Hugo build output, wiped by `make build`

## Worktrees and landing a change

- **Work in a treehouse worktree, never in the main clone.** Other agent sessions and the
  no-mistakes pipeline share the main clone. Take a worktree with
  `treehouse get --lease -b <branch>` (it prints the path; `--base <branch>` starts it from
  another branch), work there, and release it with `treehouse return <path>` once the change
  has merged. `treehouse status` lists the pool. Never make one with `git worktree add` or a
  second clone.
- **Land every change through no-mistakes, at most three runs per pull request.** Commit in
  the worktree, then run `no-mistakes axi run --intent "<goal>"` (a clone without a
  `no-mistakes` remote needs `no-mistakes init` once). `no-mistakes axi status` shows the step
  and its findings, and `no-mistakes axi respond` answers a review gate. The pipeline reviews,
  tests, pushes and opens the pull request. After the third run, merge the pull request as it
  stands and open an issue for anything still flagged. A run that stopped on a usage limit
  counts; one cancelled before it did anything does not.

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
- `gh-axi` — prefer over raw `gh` for GitHub operations (issues, PRs, workflow runs, releases)
- `chrome-devtools-axi` — browser automation for ad hoc tasks, in place of raw Playwright/chrome-devtools MCP
- `quota-axi` — check local agent-provider quota windows before long-running work
- `lavish` (`lavish-axi` CLI) — turn a plan, comparison, or report into a reviewable HTML artifact

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
