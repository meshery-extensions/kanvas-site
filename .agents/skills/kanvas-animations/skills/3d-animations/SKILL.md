# 3D Animations Skill — Kanvas Site

Expert knowledge for 3D visual effects: CSS perspective transforms, GSAP rotateX/Y, and the
`hero-glass.js` pointer-driven tilt system. No WebGL, no Three.js, no React.

## hero-glass.js Tilt System

The primary 3D effect on the site. `hero-glass.js` writes CSS custom properties on `pointermove`
and elements read them via SCSS `transform`.

### HTML — opt-in via attributes

```html
<!-- Hero glass card (auto-tracked, no attribute needed) -->
<div id="hero"> … </div>

<!-- Any other element can opt into tilt via data-tilt -->
<div class="my-card" data-tilt> … </div>

<!-- Floating elements drift with CSS @keyframes — no JS needed -->
<div class="orb" data-float> … </div>
```

### SCSS — consuming the CSS custom properties

```scss
// Hero card tilt (large range)
#hero {
    transform: perspective(1000px)
               rotateX(var(--tilt-x, 0deg))
               rotateY(var(--tilt-y, 0deg));
    transition: transform 0.1s ease-out;   // fast pointer follow
    will-change: transform;
}

// [data-tilt] elements (slightly smaller range — set in hero-glass.js)
[data-tilt] {
    transform: perspective(900px)
               rotateX(var(--tilt-x, 0deg))
               rotateY(var(--tilt-y, 0deg));
    transition: transform 0.12s ease-out;
    will-change: transform;
}
```

### Tilt ranges (set in hero-glass.js)

| Target | rotateX range | rotateY range |
|--------|--------------|--------------|
| `#hero` | ±7 deg | ±9 deg |
| `[data-tilt]` | ±6 deg | ±6 deg |

**Never** apply GSAP transforms on `#hero` directly — hero-glass.js owns that element's transform.
Wrap `#hero` in `.hero-recession` instead (done automatically by main.js).

## CSS 3D Transforms (SCSS)

### Perspective container

```scss
.scene {
    perspective: 1000px;
    perspective-origin: 50% 50%;
}

.card-3d {
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
}
```

### Flip card pattern

```scss
.flip-card {
    perspective: 1000px;
    cursor: pointer;

    &-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover &-inner,
    &.is-flipped &-inner {
        transform: rotateY(180deg);
    }

    &-front,
    &-back {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: 16px;
    }

    &-back {
        transform: rotateY(180deg);
    }
}
```

## GSAP 3D Tweens

GSAP shorthand properties map directly to CSS 3D transforms (degrees, not radians):

```js
// rotateX / rotateY / rotateZ
gsap.to('.card', { rotateY: 180, duration: 0.6, ease: 'power2.inOut' });
gsap.from('.panel', { rotateX: -90, opacity: 0, duration: 0.8, ease: 'power3.out' });

// Set perspective on the element itself
gsap.set('.card', { transformPerspective: 1000 });

// Gentle continuous tilt (decorative badge)
gsap.fromTo('.floating-badge',
    { rotateY: -8, rotateX: 3, y: 20 },
    { rotateY: 8, rotateX: -3, y: -20,
      duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' }
);
```

### Scrub-linked 3D rotation (project standard)

```js
// Card tilts as user scrolls into view
gsap.fromTo('.feature-card',
    { rotateY: -8, opacity: 0 },
    { rotateY: 0, opacity: 1,
      scrollTrigger: { trigger: '.feature-card', start: 'top 85%', end: 'top 50%', scrub: 1 }
    }
);
```

## Scroll Cube

The `.scroll-cube` in the hero section breaks into SVG pieces on load and reassembles on scroll
via a scrub timeline in `main.js`. Key classes: `.scroll-cube-wrapper`, `.scroll-cube-piece`,
`.reunited-float`.

```scss
// Reassembled floating state (CSS @keyframes, not GSAP)
.reunited-float {
    animation: reunitedFloat 6s ease-in-out infinite;
}

@keyframes reunitedFloat {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    25%       { transform: translateY(-12px) rotateY(5deg); }
    75%       { transform: translateY(6px) rotateY(-3deg); }
}
```

## CSS @keyframes 3D Effects

```scss
// Slow decorative rotation (background elements — keep very slow)
@keyframes slowSpin {
    from { transform: rotateY(0deg); }
    to   { transform: rotateY(360deg); }
}

.decorative-cube {
    animation: slowSpin 20s linear infinite;
    will-change: transform;
}

// Float with subtle tilt
@keyframes floatTilt {
    0%, 100% { transform: translateY(0)    rotateX(0deg)   rotateY(0deg); }
    33%       { transform: translateY(-16px) rotateX(4deg)  rotateY(-3deg); }
    66%       { transform: translateY(8px)  rotateX(-2deg)  rotateY(5deg); }
}
```

## data-float Pattern

Elements with `data-float` get staggered animation delays set automatically by `hero-glass.js`:

```js
// hero-glass.js
floaters.forEach((item, index) => {
    item.style.animationDelay = `${index * -2.5}s`;
});
```

```scss
[data-float] {
    animation: float 12s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-20px); }
}
```

## Anti-Patterns

- GSAP transforms on `#hero` directly — use `.hero-recession` wrapper
- `rotation: 360` for decorative spinning — use `slowSpin` at 15–25s duration instead
- `perspective` on individual elements instead of a parent container
- Missing `backface-visibility: hidden` on flip card faces
- Hard-coded `#00b39f` — always use `$primary`
- `bounce.out` or `elastic.out` for scroll-linked animations — those eases require duration, not scrub
