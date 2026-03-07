---
name: kanvas-animations:animate-audit
intent: /animate-audit
tags:
  - kanvas-animations
  - command
  - animate-audit
inputs: []
risk: medium
cost: medium
---

# /animate-audit

Audit Kanvas site animations for convention compliance, performance, and accessibility. Checks `main.js`, SCSS files, and Hugo partials.

## Usage

```
/animate-audit [path|section]
```

## What Gets Checked

### Convention Checks

| Check | Rule |
|-------|------|
| Fire-once below fold | All below-fold GSAP must use `scrub: 1`, not `once: true` |
| `stagger` + `scrub` | Must use `scrubEach()` — stagger with scrub causes stuck states |
| Hardcoded color | No `#00b39f` or `#00b399` in JS/SCSS — must use `$primary` |
| Hero direct target | `#hero` must not receive GSAP position/transform from `main.js` |
| Load order | GSAP core CDN link must appear before ScrollTrigger CDN link in `footer.html` |
| Inline styles | No `style="..."` on HTML elements — styling belongs in SCSS |
| Blur cap | `filter: blur()` must not exceed 70px (GPU budget) |

### Performance Checks

| Check | Severity |
|-------|----------|
| Animating `width`/`height`/`top`/`left` | High — use `transform` instead |
| Missing `scrub` on scroll animations | High — fire-once below fold causes jank on back-scroll |
| `backdrop-filter` blur > 24px on glass cards | Medium — mobile GPU limit |
| Too many elements in one `scrubEach` call | Medium — split large lists |
| `rotation: 360` continuous spin | Low — use subtle directional drift |

### Accessibility Checks

| Check | Severity |
|-------|----------|
| Missing reduced-motion guard in `initScrollAnimations()` | High |
| Looping CSS animations without `prefers-reduced-motion` override | Medium |
| Auto-playing animations without user control | Medium |

## Examples

```bash
# Audit entire main.js
/animate-audit static/scripts/main.js

# Audit a specific section's SCSS
/animate-audit assets/scss/_hero.scss

# Audit a Hugo partial for inline styles
/animate-audit layouts/partials/section/features.html

# Full audit
/animate-audit
```

## Audit Report Format

```
Kanvas Animation Audit
======================
Files scanned: main.js, _*.scss, layouts/**/*.html
Issues: 4

HIGH
----
[FIRE-ONCE-BELOW-FOLD] main.js:142
  gsap.from('.features-card', { once: true }) — use scrubEach() instead

[LAYOUT-THRASH] main.js:89
  Animating 'height' — use 'scaleY' instead

MEDIUM
------
[HARDCODED-COLOR] _hero.scss:34
  color: #00b39f — use $primary

[BLUR-EXCESS] main.js:201
  filter: blur(100px) on .scroll-orb — cap at 70px

Recommendations
---------------
1. Replace fire-once with scrubEach() in features section (see scroll-animations skill)
2. Swap #00b39f → $primary in _hero.scss
3. Add prefers-reduced-motion override in _section-transitions.scss for looping orbs
```

## Auto-Fix Targets

When `--fix` is passed, attempt to fix:
- Replace `#00b39f` / `#00b399` with `$primary` in SCSS
- Add `scrub: 1` to ScrollTrigger configs missing it
- Add the `prefers-reduced-motion` guard to `initScrollAnimations()`
- Cap `blur()` values above 70px

## Related Skills

- **scroll-animations** — correct scrub-based patterns
- **performance-optimizer** agent — deep performance analysis
