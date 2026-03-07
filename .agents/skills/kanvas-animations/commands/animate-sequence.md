---
name: kanvas-animations:animate-sequence
intent: /animate-sequence
tags:
  - kanvas-animations
  - command
  - animate-sequence
inputs: []
risk: medium
cost: medium
---

# /animate-sequence

GSAP `timeline()` for above-fold page-load choreography in Kanvas.

> **Scope:** Sequences are for **above-fold only** (header, hero). Below-fold elements
> must use `scrubEach()` instead. Sequences run in `DOMContentLoaded`, not in
> `initScrollAnimations()`.

## When to Use a Sequence

| Situation | Use |
|-----------|-----|
| Header logo + nav entrance | Timeline (above-fold) |
| Hero headline + CTA reveal | Timeline (above-fold) |
| Cards entering on scroll | `scrubEach()` (below-fold) |
| Section heading on scroll | Individual `gsap.from()` with scrub |
| Looping decoration | CSS `@keyframes` |

## Patterns

### Header Entrance
```javascript
// In DOMContentLoaded — NOT inside initScrollAnimations()
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.site-header .logo',    { opacity: 0, y: -20, duration: 0.5 })
    .from('.site-header nav a',    { opacity: 0, y: -10, duration: 0.3, stagger: 0.06 }, '-=0.2')
    .from('.site-header .cta-btn', { opacity: 0, scale: 0.9, duration: 0.3 }, '-=0.1');
});
```

### Hero Entrance
```javascript
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('#hero .badge',       { opacity: 0, y: 20, duration: 0.4 })
    .from('#hero h1',           { opacity: 0, y: 30, duration: 0.5 }, '-=0.1')
    .from('#hero .subtitle',    { opacity: 0, y: 20, duration: 0.4 }, '-=0.2')
    .from('#hero .cta-group',   { opacity: 0, y: 20, duration: 0.35 }, '-=0.15')
    .from('#hero .hero-visual', { opacity: 0, scale: 0.97, duration: 0.5 }, '-=0.3');
});
```

### Combined Header + Hero
```javascript
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Header first
  tl.from('.site-header', { opacity: 0, y: -10, duration: 0.4 })
  // Then hero staggered
    .from('#hero .badge',     { opacity: 0, y: 20, duration: 0.4 }, '-=0.1')
    .from('#hero h1',         { opacity: 0, y: 30, duration: 0.5 }, '-=0.2')
    .from('#hero .subtitle',  { opacity: 0, y: 20, duration: 0.4 }, '-=0.2')
    .from('#hero .cta-group', { opacity: 0, y: 15, duration: 0.35 }, '-=0.15');
});
```

## Timing Syntax

| Syntax | Meaning |
|--------|---------|
| `'-=0.2'` | Start 0.2s before previous ends (overlap) |
| `'+=0.1'` | Start 0.1s after previous ends (gap) |
| `'<'` | Start at same time as previous |
| `'<0.1'` | Start 0.1s after previous started |

## Stagger Within Timeline

Stagger is fine inside a `timeline()` because it's time-based (no `scrub` conflict):

```javascript
tl.from('nav a', { opacity: 0, y: -10, stagger: 0.06, duration: 0.3 });
```

This is safe because it's above-fold and not scrub-linked.

## Common Eases

| Ease | Feel |
|------|------|
| `power3.out` | Snappy, modern — default for entrances |
| `power2.out` | Slightly softer |
| `back.out(1.4)` | Slight overshoot / bounce |
| `none` | Linear — for counters, progress bars |

## Anti-Patterns

- Never use `timeline()` for below-fold content — use `scrubEach()` instead
- No `visibilitychange` listener to restart entrance timelines
- No `rotation: 360` or dramatic entrance spins
- Sequences should not depend on `ScrollTrigger` — they run immediately on load
