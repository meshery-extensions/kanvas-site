# Kanvas Site — Claude Code Instructions

See [AGENTS.md](AGENTS.md) for the full architecture reference, build commands, and conventions.
Key points for Claude Code:

## Stack
- **Hugo** static site — no React/Vue/JS framework
- **SCSS** via Hugo Pipes + PostCSS — no Tailwind
- **GSAP 3.13 + ScrollTrigger** loaded via CDN in `layouts/partials/footer.html`
- **Vanilla JS** in `static/scripts/` — no bundler, no imports

## Most Important Conventions
- Use `$primary` SCSS variable — never hardcode `#00b39f`
- Scroll animations must be **scrub-based** (`scrub: 1`) via `scrubEach()` — never one-shot `gsap.from()` without a scrub
- GSAP core must load **before** ScrollTrigger in `footer.html` (both pinned to 3.13.0)
- Never edit `public/` — it is Hugo build output, wiped by `make build`
- External links: `target="_blank" rel="noreferrer"` — always both attributes
- No inline `style="..."` in HTML — styling belongs in SCSS

## Local Skills & Agents
Run `make setup-claude` once after cloning to install local `.claude/` config:
- **`/new-section <name>`** — scaffolds partial + SCSS + import + GSAP stub
- **`ux-reviewer`** agent — validates CSS/GSAP/HTML against Kanvas design vision
- **`hugo-template-reviewer`** agent — catches Go template syntax errors

## MCP Servers (configured in `.mcp.json`)
- `github` — issues, PRs, CI. Needs `GITHUB_PERSONAL_ACCESS_TOKEN` env var.
- `context7` — live Hugo and GSAP documentation lookup
