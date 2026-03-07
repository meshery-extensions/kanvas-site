---
name: kanvas-animations:animate-background
intent: /animate-background Command
tags:
  - kanvas-animations
  - command
  - animate-background
inputs: []
risk: medium
cost: medium
---

# /animate-background Command

Generate animated backgrounds for the Kanvas site: scroll-linked ambient orbs, CSS gradient keyframes, aurora layers, dot/line grid textures. SCSS + vanilla JS only.

## Usage

```
/animate-background <type> [options]
```

## Background Types

| Type | Implementation |
|------|---------------|
| `ambient-orbs` | `.scroll-ambient` + GSAP scrub drift (existing system) |
| `gradient` | CSS `@keyframes gradientShift` on `background-position` |
| `aurora` | Layered `::before`/`::after` radial gradients + slow drift keyframes |
| `dot-grid` | `background-image: radial-gradient()` repeating dot pattern |
| `line-grid` | `background-image: linear-gradient()` repeating line pattern |
| `hero-static` | Static radial gradient behind hero content |
| `noise` | CSS `opacity` overlay using SVG `feTurbulence` filter |

## Key Rules

- `filter: blur()` max 70px (GPU budget on ambient orbs)
- orbs use `pointer-events: none` and `position: fixed`
- `prefers-reduced-motion` hides `.scroll-ambient` entirely
- No React components — SCSS + vanilla JS only

## Examples

```
/animate-background ambient-orbs
/animate-background gradient --colors "$primary, $secondary"
/animate-background aurora
/animate-background dot-grid --section .features-section
```

## Pattern: Ambient Orb System (existing)

The project already has `.scroll-ambient` in `_section-transitions.scss`. To use it:

```html
<!-- layouts/index.html — inject before </body> via JS or directly in template -->
<div class="scroll-ambient" aria-hidden="true">
    <div class="scroll-orb scroll-orb--1"></div>
    <div class="scroll-orb scroll-orb--2"></div>
    <div class="scroll-orb scroll-orb--3"></div>
</div>
```

```js
// main.js — inside initScrollAnimations()
const orb1 = document.querySelector('.scroll-orb--1');
const orb2 = document.querySelector('.scroll-orb--2');
const orb3 = document.querySelector('.scroll-orb--3');
if (orb1) {
    gsap.to(orb1, { y: -200, scrollTrigger: { scrub: 2, start: 'top top', end: 'bottom top' } });
}
if (orb2) {
    gsap.to(orb2, { y: -120, scrollTrigger: { scrub: 3, start: 'top top', end: 'bottom top' } });
}
if (orb3) {
    gsap.to(orb3, { y: -300, scrollTrigger: { scrub: 2.5, start: 'top top', end: 'bottom top' } });
}
```

## Pattern: CSS Gradient Shift

```scss
@keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.section-gradient-bg {
    background: linear-gradient(135deg, rgba($primary, 0.05), transparent, rgba($primary, 0.08));
    background-size: 300% 300%;
    animation: gradientShift 12s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        background-size: 100% 100%;
    }
}
```

## Pattern: Dot Grid Texture

```scss
.dot-grid-bg {
    background-image: radial-gradient(circle, rgba($primary, 0.15) 1px, transparent 1px);
    background-size: 24px 24px;
}
```

## Pattern: Line Grid

```scss
.line-grid-bg {
    background-image:
        linear-gradient(rgba($primary, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba($primary, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
}
```

## Pattern: Aurora Layers

```scss
.aurora-bg {
    position: relative;
    overflow: hidden;

    &::before,
    &::after {
        content: '';
        position: absolute;
        width: 150%;
        height: 60%;
        opacity: 0.15;
        pointer-events: none;
        filter: blur(60px);
    }

    &::before {
        background: radial-gradient(ellipse, rgba($primary, 0.6), transparent 70%);
        top: -20%;
        left: -25%;
        animation: auroraShift 14s ease-in-out infinite;
    }

    &::after {
        background: radial-gradient(ellipse, rgba(lighten($primary, 20%), 0.4), transparent 70%);
        bottom: -20%;
        right: -25%;
        animation: auroraShift 18s ease-in-out infinite reverse;
    }

    @media (prefers-reduced-motion: reduce) {
        &::before, &::after { animation: none; }
    }
}

@keyframes auroraShift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(5%, -10%) scale(1.1); }
    66%       { transform: translate(-5%, 5%) scale(0.95); }
}
```

## Anti-Patterns

- `filter: blur()` above 70px on animating elements — GPU budget
- Canvas-based particle systems — JS overhead, no React canvas
- Inline `style="background: ..."` on HTML — use SCSS classes
