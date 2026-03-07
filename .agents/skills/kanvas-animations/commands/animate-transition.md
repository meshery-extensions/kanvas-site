---
name: kanvas-animations:animate-transition
intent: /animate-transition
tags:
  - kanvas-animations
  - command
  - animate-transition
inputs: []
risk: medium
cost: medium
---

# /animate-transition

Section recession, depth choreography, and scroll-based visual transitions for Kanvas.

> **Hugo is a static site generator.** There are no routes, no `<Link>` components, no `AnimatePresence`, no `useRouter`. "Transitions" in Kanvas mean scroll-based section recession and depth choreography — not page-to-page navigation.

## Transition Types

| Type | Technique | Use case |
|------|-----------|----------|
| `hero-recession` | GSAP scrub on `.hero-recession` wrapper | Hero exits as user scrolls down |
| `section-recession` | GSAP scrub opacity + y on section | Section fades into past as next enters |
| `blur-recession` | Add `filter: blur(8px)` to recession | More dramatic exit (max 8px GPU budget) |
| `gradient-divider` | SCSS line + `scaleX` scrub | Visual separator between sections |
| `depth-layers` | Scrub at different start/end per layer | 3-depth parallax within one section |
| `orb-drift` | Ambient orbs drift with full-page scroll | Background depth cue across all sections |
| `cross-handoff` | Section A recedes as Section B enters | Coordinated two-section choreography |

## Patterns

### Hero Recession (canonical)

```javascript
// ⚠️ Always target .hero-recession — NOT #hero
// hero-glass.js owns #hero's transform for 3D tilt.
// Targeting #hero directly causes tilt+recession transform conflicts.

// In initScrollAnimations()
const heroRecession = document.querySelector('.hero-recession');
if (heroRecession) {
  gsap.to(heroRecession, {
    scale: 0.92,
    y: -40,
    scrollTrigger: {
      trigger: heroRecession,
      start: 'bottom 30%',
      end:   'bottom top',
      scrub: 1,
    },
  });
}
```

### Generic Section Recession

```javascript
// In initScrollAnimations()
function addRecession(selector, yDist = -40) {
  const section = document.querySelector(selector);
  if (!section) return;
  gsap.to(section, {
    opacity: 0,
    y: yDist,
    scrollTrigger: {
      trigger: section,
      start: 'bottom 75%',
      end:   'bottom 15%',
      scrub: 1,
    },
  });
}

addRecession('.demo-section');
addRecession('.features-section');
```

### Blur Recession (max 8px — GPU budget)

```javascript
// Full-section blur during exit — scrub-linked, must stay ≤ 8px
gsap.to('.my-section', {
  opacity: 0,
  y: -40,
  filter: 'blur(8px)',
  scrollTrigger: {
    trigger: '.my-section',
    start: 'bottom 75%',
    end:   'bottom 15%',
    scrub: 1,
  },
});
```

### Gradient Divider (between sections)

```html
<!-- Hugo partial — placed between section partials in layouts -->
<div class="section-divider" aria-hidden="true"></div>
```

```scss
// In assets/scss/_dividers.scss
.section-divider {
  height: 1px;
  margin: 0 auto;
  max-width: 800px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba($primary, 0.25) 30%,
    rgba($primary, 0.4)  50%,
    rgba($primary, 0.25) 70%,
    transparent 100%
  );
  transform-origin: center;
}
```

```javascript
// In initScrollAnimations()
document.querySelectorAll('.section-divider').forEach(divider => {
  gsap.from(divider, {
    scaleX: 0.2,
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

### Depth Layering System (4 layers)

```javascript
// In initScrollAnimations() — apply to any section
const trigger = '.my-section';

// Layer 0: badges / labels (shallowest)
const badges = document.querySelectorAll(`${trigger} .badge`);
if (badges.length) scrubEach(badges, { opacity: 0, y: 20 }, trigger, 86, 56, 3);

// Layer 1: headings
const h2 = document.querySelector(`${trigger} h2`);
if (h2) gsap.from(h2, { opacity: 0, y: 40, scrollTrigger: { trigger, start: 'top 82%', end: 'top 52%', scrub: 1 } });

// Layer 2: body text / cards
scrubEach(document.querySelectorAll(`${trigger} .card`), { opacity: 0, y: 60 }, trigger, 80, 40, 5);

// Layer 3: decorative (deepest — slowest entrance)
const bg = document.querySelector(`${trigger} .bg-accent`);
if (bg) gsap.from(bg, { opacity: 0, y: 100, scrollTrigger: { trigger, start: 'top 92%', end: 'top 28%', scrub: 1 } });
```

### Ambient Orb Choreography

```javascript
// In initScrollAnimations() — orbs drift in different directions
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

### Cross-Section Visual Handoff

```javascript
// Section A recedes as Section B enters — coordinated handoff
gsap.to('.section-a', {
  opacity: 0,
  y: -50,
  scrollTrigger: {
    trigger: '.section-b',
    start: 'top 90%',
    end:   'top 50%',
    scrub: 1,
  },
});

gsap.from('.section-b .content', {
  opacity: 0,
  y: 40,
  scrollTrigger: {
    trigger: '.section-b',
    start: 'top 80%',
    end:   'top 40%',
    scrub: 1,
  },
});
```

## Anti-Patterns

| Wrong | Why |
|-------|-----|
| `AnimatePresence` from 'framer-motion' | Framer Motion not in stack — Hugo is static |
| `useRouter`, `usePathname`, `useLocation` | No client-side routing |
| Animate `#hero` directly | hero-glass.js owns that transform; use `.hero-recession` |
| `pin: true` on sections | Breaks Kanvas's continuous scroll feel |
| `filter: blur()` > 8px on scrub-linked recession | GPU budget exceeded on mid-range devices |
| Recession + `scrubEach()` entrance on same element | Competing triggers cause stuck states |
| `stagger` with `scrub` | Use `scrubEach()` instead |

## Blur Budget Reference

| Context | Max blur |
|---------|----------|
| Ambient orbs (`.scroll-orb--*`) | `blur(70px)` |
| Full-section blur recession | `blur(8px)` |
| Glass cards (`backdrop-filter`) | `blur(24px)` |

## Related Commands

- `/animate-scroll` — Full scrubEach reference
- `/animate-sequence` — Above-fold hero entrance timeline
- `/animate-effects` — Shimmer, glow, aurora effects
