---
name: kanvas-animations:animate
intent: /animate
tags:
  - kanvas-animations
  - command
  - animate
inputs: []
risk: medium
cost: medium
---

# /animate

Generate animation code for the Kanvas stack: GSAP 3.13 + ScrollTrigger + SCSS + vanilla JS.

> **Stack reminder:** Hugo static site — no React, no Framer Motion, no npm bundler.
> All code runs in `static/scripts/` (vanilla JS, no imports).
> GSAP and ScrollTrigger load from CDN in `footer.html`.

## Usage

```
/animate <description>
```

## Dispatch Table

Route to the most relevant skill or pattern based on keywords:

| Keywords | Route to |
|----------|---------|
| scroll, reveal, viewport, below-fold | `scrubEach()` in `main.js` |
| hover, click, interactive, mouse | CSS `transition` / `@keyframes` in SCSS |
| text, typewriter, counter, split | `/animate-text` patterns |
| background, gradient, aurora, ambient | `/animate-background` patterns |
| 3D, tilt, flip, perspective | `/animate-3d` patterns |
| page load, header, hero, above-fold | GSAP `timeline()` — `/animate-sequence` |
| section fade, recession, depth | `/animate-transition` patterns |
| glitch, shimmer, magnetic, glow | `/animate-effects` patterns |

## Quick Patterns

### Below-fold element entrance (most common)
```javascript
// In main.js — add to initScrollAnimations()
const cards = document.querySelectorAll('.my-section .card');
if (cards.length) {
  scrubEach(cards,
    { opacity: 0, y: 30 },
    '.my-section',
    80, 40, 5
  );
}
```

### CSS hover effect (no JS needed)
```scss
// In assets/scss/_my-section.scss
.btn {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}
```

### CSS looping keyframe
```scss
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}
```

## Anti-Patterns (never do these)

| Wrong | Right |
|-------|-------|
| `gsap.from(el, { opacity: 0 })` fire-once below fold | `scrubEach(...)` with scrub: 1 |
| `import { motion } from 'framer-motion'` | Vanilla JS + GSAP via CDN |
| `stagger` prop with `scrub` | `scrubEach()` helper |
| Animate `width` / `height` | Animate `transform: scaleX()` |
| `backdrop-filter: blur(100px)` | Max `blur(24px)` on glass, `blur(70px)` on ambient |
| `#00b39f` hardcoded | `$primary` SCSS variable |
| `rotation: 360` on entrance | Subtle y/opacity only |

## Reduced-Motion Guard

All scroll animation blocks must have this guard at the top of `initScrollAnimations()`:

```javascript
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // ... animations
}
```

## Related Commands

- `/animate-scroll` — scrubEach() patterns
- `/animate-text` — text animation patterns
- `/animate-3d` — CSS 3D effects
- `/animate-sequence` — page-load timelines
- `/animate-preset` — named Kanvas presets
