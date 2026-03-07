# SVG Animations Skill — Kanvas Site

Expert knowledge for SVG animations: GSAP tweening of SVG elements, CSS `stroke-dasharray`
path drawing, and Hugo partial SVG patterns. No React, no Framer Motion, no paid GSAP plugins.
GSAP is loaded via CDN (no imports).

## SVG in Hugo Partials

Inline SVGs in Hugo templates are preferred for animatable icons — they can be targeted by
CSS and GSAP directly.

```html
<!-- layouts/partials/icon-arrow.html -->
<svg class="icon-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path class="arrow-shaft"
          d="M5 12h14"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path class="arrow-head"
          d="M13 6l6 6-6 6"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

```scss
// _base.scss — arrow hover
.btn:hover .arrow-shaft  { transform: scaleX(1.2); transform-origin: left; }
.btn:hover .arrow-head   { transform: translateX(3px); }
```

## CSS stroke-dasharray Path Drawing

No JS needed for simple draw-on-scroll — use CSS transitions triggered by JS class:

```scss
.path-draw {
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1);

    &.is-drawn {
        stroke-dashoffset: 0;
    }
}
```

```js
// Trigger draw via IntersectionObserver or ScrollTrigger
ScrollTrigger.create({
    trigger: '.path-svg',
    start: 'top 80%',
    once: true,
    onEnter: (self) => {
        const paths = self && self.trigger
            ? self.trigger.querySelectorAll('.path-draw')
            : null;
        if (!paths || paths.length === 0) return;
        paths.forEach((path) => path.classList.add('is-drawn'));
    },
});
```

### Getting path length

```js
// In the browser console or a one-time script:
const path = document.querySelector('.my-path');
console.log(path.getTotalLength()); // use this value for stroke-dasharray
```

## GSAP SVG Tweening

GSAP can animate any SVG attribute or CSS property on SVG elements:

```js
// Opacity and transform (most common)
gsap.from('.svg-icon', { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.4)' });

// stroke-dashoffset (path drawing with scrub)
const path = document.querySelector('.circuit-path');
const pathLen = path.getTotalLength();
gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: { trigger: '.circuit-section', start: 'top 80%', end: 'top 30%', scrub: 1 }
});

// SVG fill-opacity
gsap.from('.icon-fill', { fillOpacity: 0, duration: 0.4 });

// Rotate SVG around its center
gsap.to('.spinner-svg', { rotation: 360, duration: 2, repeat: -1, ease: 'none',
    transformOrigin: '50% 50%' });
```

## Scrub-Linked SVG Entrance (project pattern)

```js
// section SVG icons entering on scroll
scrubEach(
    document.querySelectorAll('.feature-icon svg'),
    { opacity: 0, scale: 0.7, y: 20 },
    '.features-section',
    88, 55, 4
);
```

## GSAP SVG Nav Icon Animation

From `main.js` — nav anchors with SVG icons brighten on hover/active:

```js
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('mouseenter', () => {
        const svg = anchor.querySelector('svg');
        if (svg) gsap.to(svg, { opacity: 0.85, duration: 0.6, overwrite: true });
    });
    anchor.addEventListener('mouseleave', () => {
        const svg = anchor.querySelector('svg');
        if (svg) gsap.set(svg, { opacity: 1 });
    });
});
```

## CSS @keyframes SVG Effects

```scss
// Spinning loader ring
.spinner-ring {
    stroke-dasharray: 126;   // ~2 * PI * 20
    stroke-dashoffset: 126;
    animation: spinDraw 1.4s ease-in-out infinite;
    transform-origin: center;
}

@keyframes spinDraw {
    0%   { stroke-dashoffset: 126; transform: rotate(0deg); }
    50%  { stroke-dashoffset: 32; }
    100% { stroke-dashoffset: 126; transform: rotate(360deg); }
}

// Pulsing icon fill
@keyframes iconPulse {
    0%, 100% { fill-opacity: 0.7; transform: scale(1); }
    50%       { fill-opacity: 1;   transform: scale(1.05); }
}

.icon-pulse {
    animation: iconPulse 2.5s ease-in-out infinite;
    transform-origin: center;
}
```

## SVG SCSS Conventions

```scss
// SVG inherits text color via currentColor — use this pattern
.icon {
    width: 1.25em;
    height: 1.25em;
    stroke: currentColor;   // or fill: currentColor
    stroke-width: 2;
    overflow: visible;
    flex-shrink: 0;
}

// Hover transition on SVG path
.nav-icon {
    transition: stroke 0.2s ease, opacity 0.2s ease;

    &:hover {
        stroke: $primary;
    }
}
```

## Scroll Cube SVG

The hero scroll cube uses inline SVGs injected by `main.js`. Each face is a `<svg>` with a
`<path>` clipping mask. GSAP animates `rotateY`, `x`, `y`, `opacity` on each piece element
(not the SVG attributes themselves).

```js
// main.js pattern
const piece = document.createElement('div');
piece.className = 'scroll-cube-piece';
piece.innerHTML = '<svg viewBox="130 30 440 490" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="..." fill="rgba(0,179,159,0.15)" .../>' + '</svg>';
wrapper.appendChild(piece);

// GSAP animates the wrapper div, not the SVG internals
gsap.set(piece, { rotateY: Math.random() * 180 - 90, x: (Math.random() - 0.5) * 200, opacity: 0 });
```

## Anti-Patterns

- `MorphSVGPlugin` — paid GSAP plugin, not available on CDN
- Animating `d` attribute directly in GSAP — not supported without MorphSVG
- React `<motion.path>` or `<motion.circle>` — no React in this project
- Inline `style="..."` on SVG elements — use SCSS classes
- `getTotalLength()` in production code — calculate once offline, hardcode the value
