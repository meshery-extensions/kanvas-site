---
name: kanvas-animations:animate-3d
intent: /animate-3d Command
tags:
  - kanvas-animations
  - command
  - animate-3d
inputs: []
risk: medium
cost: medium
---

# /animate-3d

CSS + vanilla JS 3D effects for Kanvas. No WebGL, no React, no Framer Motion.

> Uses CSS `perspective`, `transform-style: preserve-3d`, and `hero-glass.js` patterns.

## 3D Techniques

| Type | Implementation |
|------|---------------|
| `tilt` | `hero-glass.js` `[data-tilt]` via CSS custom properties |
| `flip-card` | CSS `perspective` + `rotateY(180deg)` on hover/click |
| `float` | `[data-float]` data attribute + `hero-glass.js` stagger |
| `perspective-scrub` | GSAP `rotateY` + `scrub: 1` (below-fold only) |
| `depth-parallax` | Multiple `scrubEach()` at different y distances |

## Patterns

### Tilt Card (hero-glass.js)

Any element with `[data-tilt]` gets mouse-tracking 3D tilt automatically via `hero-glass.js`.

```html
<!-- In Hugo partial -->
<div class="feature-card" data-tilt>
  <div class="card-content">...</div>
</div>
```

```scss
// In _features.scss
.feature-card[data-tilt] {
  transform-style: preserve-3d;
  // hero-glass.js sets --tilt-x / --tilt-y CSS custom properties
  transform: perspective(800px)
             rotateX(calc(var(--tilt-y, 0) * 1deg))
             rotateY(calc(var(--tilt-x, 0) * 1deg));
  transition: transform 0.15s ease;
}
```

### Float Animation ([data-float])

Elements with `[data-float]` get staggered float delays from `hero-glass.js`.

```html
<div class="accent-shape" data-float></div>
<div class="accent-shape" data-float></div>
<div class="accent-shape" data-float></div>
```

```scss
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(2deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
}

[data-float] {
  animation: float 4s ease-in-out infinite;
  // hero-glass.js adds individual animation-delay via JS
}
```

### CSS Flip Card

```html
<!-- Hugo partial -->
<div class="flip-card" tabindex="0" aria-label="Feature card, press Enter to flip">
  <div class="flip-card__inner">
    <div class="flip-card__front">
      <h3>Feature Name</h3>
    </div>
    <div class="flip-card__back">
      <p>Feature detail</p>
    </div>
  </div>
</div>
```

```scss
.flip-card {
  perspective: 1000px;
  cursor: pointer;

  &__inner {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__inner,
  &:focus &__inner {
    transform: rotateY(180deg);
  }

  &__front,
  &__back {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  &__back {
    position: absolute;
    inset: 0;
    transform: rotateY(180deg);
  }
}
```

### GSAP Perspective Scrub (below-fold only)

```javascript
// In initScrollAnimations() in main.js
const cards3d = document.querySelectorAll('.cards-3d .card');
if (cards3d.length) {
  scrubEach(cards3d,
    { rotateY: 45, opacity: 0 },
    '.cards-3d',
    90, 50, 4
  );
}
```

### Depth Parallax (multi-layer scrub)

```javascript
// Shallow element (heading) — enters faster
gsap.from('.scene h2', {
  y: 40, opacity: 0,
  scrollTrigger: { trigger: '.scene', start: 'top 85%', end: 'top 55%', scrub: 1 },
});

// Deep element (background shape) — enters slower
gsap.from('.scene .bg-shape', {
  y: 120, opacity: 0,
  scrollTrigger: { trigger: '.scene', start: 'top 95%', end: 'top 30%', scrub: 1 },
});
```

## Browser Notes

- `transform-style: preserve-3d` has Safari quirks — test on iOS
- Use `-webkit-backface-visibility: hidden` alongside standard for Safari
- `will-change: transform` only on actively animating elements
- Never use `transform-style: preserve-3d` inside a `filter: blur()` parent (compositing conflict)
- `[data-tilt]` intensity: keep ±10deg max; high values look broken on mobile

## Anti-Patterns

- No `useSpring`, `motion.div`, or Framer Motion imports
- No `rotation: 360` (dramatic spin) — subtle perspective shifts only
- Do not apply both `[data-tilt]` and a GSAP scroll animation to the same element's transform
