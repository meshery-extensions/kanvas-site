# Background Animations Skill — Kanvas Site

Expert knowledge for animated backgrounds: gradient overlays, ambient orbs, noise textures, grid
patterns, and the scroll-ambient system. All implemented with SCSS + GSAP (vanilla JS) — no
React, no canvas, no Framer Motion.

## The Scroll-Ambient System

Three fixed background orbs that drift as the user scrolls, creating color continuity between
sections. Defined in `_section-transitions.scss`, driven by `main.js`.

### SCSS structure

```scss
.scroll-ambient {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
}

.scroll-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);       // not 100px — GPU performance limit
    will-change: transform, opacity;
}

.scroll-orb--1 {
    width: 600px; height: 600px; top: 10%; left: -5%;
    background: radial-gradient(circle, rgba($primary, 0.1), transparent 70%);
    opacity: 0.8;
}

.scroll-orb--2 {
    width: 500px; height: 500px; top: 40%; right: -10%;
    background: radial-gradient(circle, rgba($secondary, 0.08), transparent 70%);
    opacity: 0.6;
}

.scroll-orb--3 {
    width: 450px; height: 450px; bottom: 10%; left: 20%;
    background: radial-gradient(circle, rgba($primary, 0.07), transparent 70%);
    opacity: 0.5;
}
```

### JS: injection + GSAP scrub drift

```js
// main.js — initScrollAnimations()
const ambient = document.createElement('div');
ambient.className = 'scroll-ambient';
ambient.innerHTML =
    '<div class="scroll-orb scroll-orb--1"></div>' +
    '<div class="scroll-orb scroll-orb--2"></div>' +
    '<div class="scroll-orb scroll-orb--3"></div>';
document.body.prepend(ambient);

gsap.to('.scroll-orb--1', {
    y: '-60vh', x: '15vw', scale: 1.4, opacity: 0.5,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
});
gsap.to('.scroll-orb--2', {
    y: '-40vh', x: '-20vw', scale: 0.8,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 3 }
});
gsap.to('.scroll-orb--3', {
    y: '-80vh', x: '10vw', scale: 1.2, opacity: 0.7,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.5 }
});
```

## Static Gradient Backgrounds (SCSS)

### Radial gradient hero backdrop

```scss
.hero-backdrop {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 80% 60% at 50% -20%, rgba($primary, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 80% 80%,  rgba($secondary, 0.08), transparent);
    pointer-events: none;
    z-index: 0;
}
```

### Dot grid texture

```scss
.dot-grid {
    background-image: radial-gradient(
        circle at 1px 1px,
        rgba(255, 255, 255, 0.06) 1px,
        transparent 1.6px
    );
    background-size: 24px 24px;
}
```

### Line grid texture

```scss
.line-grid {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
}
```

## CSS @keyframes Background Animations

### Animated gradient shift

```scss
@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
}

.gradient-bg {
    background: linear-gradient(
        -45deg,
        rgba($primary, 0.12),
        rgba($secondary, 0.08),
        rgba(255, 255, 255, 0.04),
        rgba($primary, 0.06)
    );
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}
```

### Aurora-style layers

```scss
.aurora {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.aurora-layer {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    opacity: 0.3;
    filter: blur(60px);
    will-change: transform;
}

.aurora-layer--1 {
    background: linear-gradient(
        180deg,
        transparent 0%,
        rgba($primary, 0.2) 30%,
        rgba($secondary, 0.1) 60%,
        transparent 80%
    );
    animation: auroraShift 20s ease-in-out infinite;
}

.aurora-layer--2 {
    background: linear-gradient(
        180deg,
        transparent 0%,
        rgba($secondary, 0.15) 40%,
        rgba($primary, 0.08) 70%,
        transparent 90%
    );
    animation: auroraShift 25s ease-in-out infinite reverse;
}

@keyframes auroraShift {
    0%, 100% { transform: translateX(-5%) skewX(-3deg); }
    50%       { transform: translateX(5%)  skewX(3deg); }
}
```

## Hero Section Ambient Orbs (hero-glass.scss)

Small in-section orbs for the hero area specifically:

```scss
.ambient { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: float 18s ease-in-out infinite;
    will-change: transform, opacity;
}

.orb--one {
    width: 500px; height: 500px;
    top: -10%; left: -10%;
    background: radial-gradient(circle, rgba($primary, 0.12), transparent 70%);
    animation-duration: 22s;
}

.orb--two {
    width: 400px; height: 400px;
    top: 20%; right: -5%;
    background: radial-gradient(circle, rgba($secondary, 0.08), transparent 70%);
    animation-duration: 18s;
    animation-delay: -8s;
}

.orb--three {
    width: 350px; height: 350px;
    bottom: 0; left: 30%;
    background: radial-gradient(circle, rgba($primary, 0.07), transparent 70%);
    animation-duration: 26s;
    animation-delay: -14s;
}
```

## No-JS / Reduced-Motion Fallback

The `.scroll-ambient` div is hidden for reduced-motion users:

```scss
@media (prefers-reduced-motion: reduce) {
    .scroll-ambient { display: none; }
    .gradient-bg    { animation: none; }
    .aurora-layer   { animation: none; }
}
```

## Performance Rules

- `filter: blur()` — max 70px on scroll-ambient orbs (higher values cause GPU stalls)
- Always use `will-change: transform, opacity` on animated background elements
- Fixed-position elements (`.scroll-ambient`) are composited separately — no repaints
- Do not animate `background-color` or `background-image` directly in GSAP — only `opacity` and `transform`
- CSS `@keyframes` background shifts are fine as they use `background-position` (cheap)

## Anti-Patterns

- `filter: blur(100px)` — use 70px max
- Canvas-based particle systems — not used in this project
- Animating `background` shorthand in GSAP (animates color, not GPU-friendly)
- Multiple simultaneous `gradientShift` animations — pick one ambient approach per section
- Hard-coded `#00b39f` — always use `$primary`
