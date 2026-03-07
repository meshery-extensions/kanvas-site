---
name: kanvas-animations:animate-effects
intent: /animate-effects Command
tags:
  - kanvas-animations
  - command
  - animate-effects
inputs: []
risk: medium
cost: medium
---

# /animate-effects Command

Create creative visual effects for the Kanvas site: glitch text, clip-path reveals, shimmer overlays, magnetic hover, animated borders. SCSS + vanilla JS + GSAP — no React.

## Usage

```
/animate-effects <type> [target]
```

## Effect Types

| Type | Implementation |
|------|---------------|
| `glitch` | CSS `::before`/`::after` + `clip-path` + `data-text` attribute |
| `shimmer` | CSS `::after` pseudo-element with `@keyframes shimmer` |
| `clip-reveal` | CSS `clip-path: inset()` transition or GSAP scrub |
| `curtain` | Two-panel GSAP `scaleY` scrub reveal |
| `magnetic` | Vanilla JS `mousemove` + GSAP `elastic.out` |
| `glow-pulse` | CSS `@keyframes` `filter: drop-shadow()` |
| `animated-border` | CSS `@keyframes borderShift` on `border-color`/`box-shadow` |
| `scroll-cube` | `initScrollCube()` pattern — SVG piece scatter + GSAP scrub reassembly |

## Examples

```
/animate-effects glitch .hero-title
/animate-effects shimmer .feature-card
/animate-effects magnetic .btn-primary
/animate-effects clip-reveal .reveal-card
/animate-effects glow-pulse .cta-badge
```

## Pattern: Glitch Text (CSS only)

```html
<span class="glitch" data-text="{{ .Title }}">{{ .Title }}</span>
```

```scss
.glitch {
    position: relative;

    &::before,
    &::after {
        content: attr(data-text);
        position: absolute;
        inset: 0;
    }

    &::before {
        color: rgba($primary, 0.8);
        clip-path: inset(40% 0 61% 0);
        animation: glitchTop 2s infinite linear;
    }

    &::after {
        color: rgba(255, 255, 255, 0.8);
        clip-path: inset(85% 0 7% 0);
        animation: glitchBottom 2s infinite linear;
    }
}

@keyframes glitchTop {
    0%,  90%  { transform: translateX(0); }
    91%        { transform: translateX(-2px); clip-path: inset(40% 0 61% 0); }
    93%        { transform: translateX(2px);  clip-path: inset(15% 0 80% 0); }
    95%        { transform: translateX(-1px); clip-path: inset(70% 0 25% 0); }
    100%       { transform: translateX(0);   clip-path: inset(40% 0 61% 0); }
}
```

## Pattern: Shimmer Overlay (CSS only)

```scss
.shimmer-card {
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.06) 50%,
            transparent 60%
        );
        background-size: 200% 100%;
        animation: shimmer 2.5s linear infinite;
        pointer-events: none;
    }
}

@keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
}
```

## Pattern: Magnetic Hover (vanilla JS)

```js
// main.js or inline
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width  - 0.5;
        const relY = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(el, { x: relX * 12, y: relY * 8, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
});
```

```html
<button class="btn-primary" data-magnetic>Get Started</button>
```

## Pattern: GSAP Clip-Path Reveal (scrub)

```js
gsap.fromTo('.reveal-card',
    { clipPath: 'inset(0 100% 0 0)' },
    {
        clipPath: 'inset(0 0% 0 0)',
        scrollTrigger: { trigger: '.reveal-card', start: 'top 85%', end: 'top 50%', scrub: 1 },
    }
);
```

## Pattern: Glow Pulse (CSS only)

```scss
.glow-badge {
    animation: shadowPulse 3s ease-in-out infinite;
}

@keyframes shadowPulse {
    0%, 100% { box-shadow: 0 0 10px rgba($primary, 0.2); }
    50%       { box-shadow: 0 0 30px rgba($primary, 0.5); }
}
```

## Anti-Patterns

- `rotation: 360` continuous spin — too dramatic
- `filter: blur()` animated every frame — expensive
- Inline `style="..."` on HTML elements — all effects belong in SCSS
- Canvas-based particle systems — no bundler to load canvas libs
