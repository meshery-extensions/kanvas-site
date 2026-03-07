# Creative Effects Skill — Kanvas Site

Expert knowledge for creative visual effects: CSS clip-path reveals, GSAP logo assembly, shimmer
overlays, magnetic hover, glitch text, and the scroll-cube breakup/reassembly sequence. All
implemented with SCSS + vanilla JS — no React, no Framer Motion.

## Scroll Cube: Logo Assembly Effect

The most complex creative effect on the site. The Kanvas cube SVG breaks apart on load and
reassembles as the user scrolls. Implemented entirely in `main.js`.

### Architecture

```js
// main.js — initScrollCube()
const initScrollCube = () => {
    const wrapper = document.querySelector('.scroll-cube-wrapper');
    if (!wrapper) return;

    // 1. Inject SVG pieces (each piece is a <svg> with a <path> clip)
    // 2. GSAP.set() scatters pieces with random rotateY + translate
    // 3. ScrollTrigger scrub timeline reassembles them to origin position
    // 4. On complete: add .reunited-float class for CSS float animation
};
```

### SCSS

```scss
.scroll-cube-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
}

.scroll-cube-piece {
    position: absolute;
    inset: 0;
    will-change: transform, opacity;
}

.reunited-float {
    animation: reunitedFloat 6s ease-in-out infinite;
}

@keyframes reunitedFloat {
    0%, 100% { transform: translateY(0) rotateY(0deg); }
    25%       { transform: translateY(-12px) rotateY(5deg); }
    75%       { transform: translateY(6px)   rotateY(-3deg); }
}

@keyframes glowPulse {
    0%, 100% { filter: drop-shadow(0 0 8px  rgba($primary, 0.3)); }
    50%       { filter: drop-shadow(0 0 20px rgba($primary, 0.6)); }
}

.reunited-glow {
    animation: glowPulse 3s ease-in-out infinite;
}
```

## CSS clip-path Reveals

### Wipe reveal (entrance)

```scss
// Clip from bottom — element appears to rise into view
.clip-reveal {
    clip-path: inset(100% 0 0 0);
    transition: clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1);

    &.is-visible {
        clip-path: inset(0% 0 0 0);
    }
}
```

### GSAP clip-path scrub

```js
gsap.fromTo('.reveal-card',
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)',
      scrollTrigger: { trigger: '.reveal-card', start: 'top 85%', end: 'top 50%', scrub: 1 }
    }
);
```

### Split curtain (top + bottom)

```js
// Two panels that retract in opposite directions on scroll
gsap.to('.curtain-top', {
    scaleY: 0, transformOrigin: 'top',
    scrollTrigger: { trigger: '.curtain-wrapper', start: 'top 80%', end: 'top 30%', scrub: 1 }
});
gsap.to('.curtain-bottom', {
    scaleY: 0, transformOrigin: 'bottom',
    scrollTrigger: { trigger: '.curtain-wrapper', start: 'top 80%', end: 'top 30%', scrub: 1 }
});
```

## Shimmer Overlay (CSS only)

```scss
@keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
}

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
```

## Glitch Text Effect (CSS only)

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
        clip-path: inset(85% 0 7%  0);
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

@keyframes glitchBottom {
    0%,  92%  { transform: translateX(0); }
    93%        { transform: translateX(2px);  clip-path: inset(85% 0 7% 0); }
    95%        { transform: translateX(-2px); clip-path: inset(50% 0 45% 0); }
    97%        { transform: translateX(1px);  clip-path: inset(20% 0 75% 0); }
    100%       { transform: translateX(0);   clip-path: inset(85% 0 7% 0); }
}
```

Hugo template usage:

```html
<span class="glitch" data-text="{{ .Title }}">{{ .Title }}</span>
```

## Magnetic Hover (vanilla JS)

```js
// static/scripts/main.js or a small inline script
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

## Counter Scramble (fire-once)

Number counters are the only place where `once: true` is appropriate:

```js
// main.js — animateCounters()
const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        gsap.fromTo(el,
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                onUpdate() { el.textContent = Math.round(this.targets()[0]._gsap.innerText) + suffix; }
            }
        );
    });
};

ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 70%',
    once: true,
    onEnter: animateCounters,
});
```

## GSAP Creative Sequence (Timeline)

For complex multi-step entrance sequences (not scroll-scrub):

```js
// One-shot entrance (acceptable for above-the-fold, page load only)
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.from('.hero-badge',    { opacity: 0, y: 20, scale: 0.9, duration: 0.5 })
  .from('.hero-title',    { opacity: 0, y: 30, duration: 0.7 }, '-=0.2')
  .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
  .from('.hero-cta',      { opacity: 0, y: 20, scale: 0.96, duration: 0.5 }, '-=0.3');
```

This pattern is used in `main.js` for the initial header entrance only. All below-fold content
uses scrub-based animations.

## Anti-Patterns

- `rotation: 360` for continuous spin — too dramatic, use slow directional drift
- `bounce.out` or `elastic.out` in scroll-scrub contexts — these eases need `duration`, not scrub
- `filter: blur()` animated on every frame — use CSS `opacity` instead where possible
- Inline `style="..."` — all creative effects belong in SCSS
- Hard-coded `#00b39f` — always use `$primary`
