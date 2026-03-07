---
name: kanvas-animations:animate-scroll
intent: /animate-scroll
tags:
  - kanvas-animations
  - command
  - animate-scroll
inputs: []
risk: medium
cost: medium
---

# /animate-scroll

Scroll-triggered animations for Kanvas. All below-fold animations use `scrubEach()` with `scrub: 1`.

> **Rule:** Never use fire-once `.from()` for below-fold elements. Counters are the only exception.
> Scroll animations live in `initScrollAnimations()` in `static/scripts/main.js`.

## scrubEach() Reference

`scrubEach()` is a Kanvas helper that creates per-element ScrollTriggers. Do NOT use `stagger` with `scrub` — it causes stuck-state bugs on reverse scroll.

```javascript
/**
 * @param {NodeList|Element[]} elements  - Elements to animate
 * @param {object}             fromProps - gsap.from() properties (initial state)
 * @param {string}             triggerEl - CSS selector for the scroll trigger container
 * @param {number}             startBase - viewport % where first element starts (e.g. 80)
 * @param {number}             endBase   - viewport % where first element ends (e.g. 40)
 * @param {number}             offsetPer - % offset per subsequent element (e.g. 5)
 */
const scrubEach = (elements, fromProps, triggerEl, startBase, endBase, offsetPer) => {
  [...elements].forEach((el, i) => {
    gsap.from(el, {
      ...fromProps,
      scrollTrigger: {
        trigger: triggerEl,
        start: `top ${startBase - i * offsetPer}%`,
        end:   `top ${endBase  - i * offsetPer}%`,
        scrub: 1,
      },
    });
  });
};
```

## Patterns

### Standard Heading Entrance
```javascript
const badge = document.querySelector('.features .badge');
const title = document.querySelector('.features h2');
const sub   = document.querySelector('.features .subtitle');

if (badge) gsap.from(badge, { opacity: 0, y: 20, scrollTrigger: { trigger: '.features', start: 'top 85%', end: 'top 55%', scrub: 1 } });
if (title) gsap.from(title, { opacity: 0, y: 40, scrollTrigger: { trigger: '.features', start: 'top 80%', end: 'top 50%', scrub: 1 } });
if (sub)   gsap.from(sub,   { opacity: 0, y: 30, scrollTrigger: { trigger: '.features', start: 'top 78%', end: 'top 48%', scrub: 1 } });
```

### Card Grid Stagger
```javascript
const cards = document.querySelectorAll('.features .feature-card');
if (cards.length) {
  scrubEach(cards, { opacity: 0, y: 30 }, '.features', 80, 40, 5);
}
```

### Section Recession
```javascript
// Fade section out as user scrolls past it
const hero = document.querySelector('.hero-recession');
if (hero) {
  gsap.to(hero, {
    opacity: 0,
    y: -60,
    scrollTrigger: {
      trigger: hero,
      start: 'bottom 80%',
      end:   'bottom 10%',
      scrub: 1,
    },
  });
}
```

### Layered Parallax (depth)

Different sections enter at different depths for a layered scroll feel:

| Depth | y from | y end | Description |
|-------|--------|-------|-------------|
| Shallow (headings) | y: 40 | y: 0 | Faster entrance |
| Mid (cards) | y: 60–80 | y: 0 | Standard |
| Deep (bg accents) | y: 100–120 | y: 0 | Slower entrance |

```javascript
// Shallow layer (section heading)
gsap.from('.demo h2', { y: 40, opacity: 0, scrollTrigger: { trigger: '.demo', start: 'top 85%', end: 'top 55%', scrub: 1 } });

// Mid layer (cards)
scrubEach(document.querySelectorAll('.demo .card'), { y: 70, opacity: 0 }, '.demo', 82, 42, 6);

// Deep layer (decorative orb)
gsap.from('.demo .bg-orb', { y: 120, opacity: 0, scrollTrigger: { trigger: '.demo', start: 'top 95%', end: 'top 40%', scrub: 1 } });
```

### SVG Path Draw (scrub)
```javascript
const path = document.querySelector('.section-divider path');
if (path) {
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: { trigger: path, start: 'top 90%', end: 'top 40%', scrub: 1 },
  });
}
```

### Gradient Divider Scale (between sections)
```javascript
document.querySelectorAll('.section-divider').forEach(divider => {
  gsap.from(divider, {
    scaleX: 0.3,
    opacity: 0,
    scrollTrigger: {
      trigger: divider,
      start: 'top 90%',
      end:   'top 60%',
      scrub: 1,
    },
  });
});
```

### Ambient Orb Drift
```javascript
const orbConfig = [
  { sel: '.scroll-orb--1', y:  120, x:  40 },
  { sel: '.scroll-orb--2', y: -100, x: -30 },
  { sel: '.scroll-orb--3', y:   80, x:  60 },
];

orbConfig.forEach(({ sel, y, x }) => {
  const orb = document.querySelector(sel);
  if (!orb) return;
  gsap.to(orb, {
    y, x,
    scrollTrigger: {
      trigger: document.body,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   1,
    },
  });
});
```

### Counter (fire-once exception)
```javascript
// Counters fire once — this is the only exception to the scrub rule
document.querySelectorAll('.counter[data-count]').forEach(el => {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val) + suffix; },
      });
    },
  });
});
```

## ScrollTrigger Reference

| Property | Values | Use |
|----------|--------|-----|
| `trigger` | CSS selector | Element that drives the animation |
| `start` | `'top 80%'` | When trigger top hits 80% of viewport |
| `end` | `'top 40%'` | When trigger top hits 40% of viewport |
| `scrub` | `1` | Smooth lag; links to scroll position |
| `once` | `true` | Fire once (counters only) |
| `markers` | `true` | Debug — remove before commit |
