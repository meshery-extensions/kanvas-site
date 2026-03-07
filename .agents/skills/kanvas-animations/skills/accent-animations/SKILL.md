# Accent Animations Skill — Kanvas Site

Expert knowledge for decorative accent animations: floating orbs, glowing borders, shimmer
effects, animated section dividers, and ambient embellishments. All implemented in SCSS
@keyframes or GSAP (vanilla JS) — no React, no Framer Motion.

## Floating Elements (CSS @keyframes)

### float / drift / pulse keyframes

Defined in `_hero-glass.scss` and reused across the site:

```scss
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-20px); }
}

@keyframes drift {
    0%   { transform: translate(0, 0) rotate(0deg); }
    25%  { transform: translate(6px, -8px) rotate(2deg); }
    75%  { transform: translate(-4px, 4px) rotate(-1deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.08); }
}

@keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
}
```

### data-float stagger

Any element with `data-float` gets an auto-staggered delay from `hero-glass.js`:

```html
<div class="orb orb--one"   data-float></div>
<div class="orb orb--two"   data-float></div>
<div class="orb orb--three" data-float></div>
```

```scss
[data-float] {
    animation: float 12s ease-in-out infinite;
}
// hero-glass.js sets animationDelay = index * -2.5s on each item
```

## Ambient Background Orbs

Defined in `_section-transitions.scss`. Three fixed orbs that GSAP drifts with scroll:

```scss
.scroll-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);          // not 100px — GPU limit
    will-change: transform, opacity;
}

.scroll-orb--1 {
    width: 600px; height: 600px;
    top: 10%; left: -5%;
    background: radial-gradient(circle, rgba($primary, 0.1), transparent 70%);
}

.scroll-orb--2 {
    width: 500px; height: 500px;
    top: 40%; right: -10%;
    background: radial-gradient(circle, rgba($secondary, 0.08), transparent 70%);
}

.scroll-orb--3 {
    width: 450px; height: 450px;
    bottom: 10%; left: 20%;
    background: radial-gradient(circle, rgba($primary, 0.07), transparent 70%);
}
```

GSAP drives them from `initScrollAnimations()` in main.js — see `scroll-animations` skill.

## Inline Section Orbs (Hero)

Small hero-specific orbs in `_hero-glass.scss`:

```scss
.ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: float 18s ease-in-out infinite;
    will-change: transform, opacity;
}
```

## Animated Section Dividers

Dividers injected between sections by JS, scaled in on scrub:

```scss
.section-divider {
    height: 1px;
    max-width: 800px;
    margin: 0 auto;
    background: linear-gradient(
        90deg,
        transparent,
        rgba($primary, 0.3)  20%,
        rgba($secondary, 0.5) 50%,
        rgba($primary, 0.3)  80%,
        transparent
    );
    will-change: transform, opacity;
    transform-origin: center;
}
```

```js
// main.js — injected divider with scrub entrance
const divider = document.createElement('div');
divider.className = 'section-divider';
section.after(divider);
gsap.from(divider, {
    opacity: 0, scaleX: 0.3,
    scrollTrigger: { trigger: divider, start: 'top 90%', end: 'top 70%', scrub: 1 }
});
```

## Shimmer Highlight (SCSS only)

```scss
.shimmer-text {
    background: linear-gradient(
        90deg,
        $body-color 0%,
        rgba($primary, 0.9) 45%,
        rgba(255, 255, 255, 0.95) 50%,
        rgba($primary, 0.9) 55%,
        $body-color 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
    animation-play-state: paused;

    &:hover {
        animation-play-state: running;
    }
}
```

## Pulsing Teal Glow (CTA elements)

```scss
.cta-glow {
    box-shadow:
        0 0 0 1px rgba($primary, 0.2),
        0 0 40px rgba($primary, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: shadowPulse 3s ease-in-out infinite;
}

@keyframes shadowPulse {
    0%, 100% {
        box-shadow:
            0 0 0 1px rgba($primary, 0.2),
            0 0 20px rgba($primary, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    50% {
        box-shadow:
            0 0 0 1px rgba($primary, 0.35),
            0 0 60px rgba($primary, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
}
```

## Animated Border (borderShift)

From `_hero-glass.scss` — spinning gradient border for hero card:

```scss
@keyframes borderShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animated-border-card {
    position: relative;
    border-radius: 20px;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
            135deg,
            rgba($primary, 0.6),
            rgba(255, 255, 255, 0.15) 40%,
            transparent 80%
        );
        background-size: 200% 200%;
        animation: borderShift 4s ease infinite;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
                mask-composite: exclude;
        pointer-events: none;
    }
}
```

## GSAP Accent: Scroll-Triggered Badge Bounce

Counters and decorative badges can use `once: true` (the only fire-once exception):

```js
// One-shot OK for entrance sequence that can't reverse meaningfully
gsap.from('.hero-badge', {
    scale: 0.8, opacity: 0,
    duration: 0.6, ease: 'back.out(1.7)',
    scrollTrigger: {
        trigger: '.hero-badge',
        start: 'top 80%',
        once: true,        // fire-once is acceptable for small entry accents
    }
});
```

For repeatable accents on cards, use scrub:

```js
scrubEach(document.querySelectorAll('.feature-icon'), { scale: 0.85, opacity: 0 }, '.features-grid', 88, 55, 4);
```

## Anti-Patterns

- `filter: blur(100px)` — use 70px max for GPU performance
- Multiple simultaneous pulsing glows — use sparingly (hero CTA only)
- `rotation: 360` continuous spin — use `slowSpin` at 20s+ instead
- Hard-coded `#00b39f` — always use `$primary`
- Inline `style="animation: ..."` — all animations belong in SCSS
