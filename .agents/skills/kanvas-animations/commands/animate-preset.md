---
name: kanvas-animations:animate-preset
intent: /animate-preset
tags:
  - kanvas-animations
  - command
  - animate-preset
inputs: []
risk: medium
cost: medium
---

# /animate-preset

Apply a named Kanvas animation preset — production-tested GSAP + SCSS patterns tuned for the Kanvas design vision.

> **Stack:** GSAP 3.13 + ScrollTrigger (CDN) + SCSS + vanilla JS. No React, no Framer Motion.

## Usage

```
/animate-preset <preset-name> [section-selector]
```

## Available Presets

| Preset | Type | Description |
|--------|------|-------------|
| `heading-entrance` | scroll scrub | Badge → title → subtitle staggered reveal |
| `card-stagger` | scroll scrub | Grid of cards enter from below |
| `hover-lift` | CSS | Lift + shadow on hover |
| `hover-glow` | CSS | Primary color glow on hover |
| `section-recession` | scroll scrub | Section fades + shifts up as user scrolls past |
| `float` | CSS keyframe | Gentle vertical float loop |
| `pulse-glow` | CSS keyframe | Pulsing primary-color shadow |
| `shimmer` | CSS keyframe | Diagonal light sweep |
| `gradient-text` | SCSS | Animated gradient text |
| `counter` | JS + scroll | Number count-up on scroll |
| `header-entrance` | GSAP timeline | Logo + nav items drop in (above-fold only) |
| `hero-entrance` | GSAP timeline | Hero badge, h1, subtitle, CTA stagger (above-fold only) |

## Preset Details

### heading-entrance
```javascript
// Paste inside initScrollAnimations() in main.js
const badge   = document.querySelector('.SECTION .badge');
const title   = document.querySelector('.SECTION h2');
const sub     = document.querySelector('.SECTION .subtitle');
if (badge)  gsap.from(badge,  { opacity: 0, y: 20, scrollTrigger: { trigger: '.SECTION', start: 'top 85%', end: 'top 55%', scrub: 1 } });
if (title)  gsap.from(title,  { opacity: 0, y: 40, scrollTrigger: { trigger: '.SECTION', start: 'top 80%', end: 'top 50%', scrub: 1 } });
if (sub)    gsap.from(sub,    { opacity: 0, y: 30, scrollTrigger: { trigger: '.SECTION', start: 'top 78%', end: 'top 48%', scrub: 1 } });
```

### card-stagger
```javascript
const cards = document.querySelectorAll('.SECTION .card');
if (cards.length) {
  scrubEach(cards, { opacity: 0, y: 30 }, '.SECTION', 80, 40, 5);
}
```

### hover-lift
```scss
.card {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}
```

### hover-glow
```scss
.btn {
  transition: box-shadow 0.25s ease;
  &:hover {
    box-shadow: 0 0 0 3px rgba($primary, 0.35),
                0 4px 20px rgba($primary, 0.2);
  }
}
```

### section-recession
```javascript
const section = document.querySelector('.SECTION');
if (section) {
  gsap.to(section, {
    opacity: 0, y: -40,
    scrollTrigger: { trigger: section, start: 'bottom 70%', end: 'bottom 20%', scrub: 1 },
  });
}
```

### float
```scss
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.ELEMENT { animation: float 3s ease-in-out infinite; }
```

### pulse-glow
```scss
@keyframes shadowPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba($primary, 0); }
  50%       { box-shadow: 0 0 20px 4px rgba($primary, 0.25); }
}
.ELEMENT { animation: shadowPulse 2.5s ease-in-out infinite; }
```

### shimmer
```scss
.ELEMENT {
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%);
    background-size: 200% 100%;
    animation: shimmerMove 2s linear infinite;
    pointer-events: none;
  }
}
@keyframes shimmerMove {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
```

### gradient-text
```scss
.ELEMENT {
  background: linear-gradient(135deg, $primary 0%, lighten($primary, 20%) 50%, $primary 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite;
}
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

### counter
```html
<span class="counter" data-count="1000" data-suffix="+" aria-label="Over 1000 users"></span>
```
```javascript
// Fires once when element enters viewport (counters are exempt from scrub rule)
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

### header-entrance
```javascript
// In DOMContentLoaded — NOT inside initScrollAnimations()
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
tl.from('.site-header .logo',    { opacity: 0, y: -20, duration: 0.5 })
  .from('.site-header nav a',    { opacity: 0, y: -10, duration: 0.3, stagger: 0.06 }, '-=0.2')
  .from('.site-header .cta-btn', { opacity: 0, scale: 0.9, duration: 0.3 }, '-=0.1');
```

### hero-entrance
```javascript
// In DOMContentLoaded — NOT inside initScrollAnimations()
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .from('#hero .badge',     { opacity: 0, y: 20, duration: 0.4 })
  .from('#hero h1',         { opacity: 0, y: 30, duration: 0.5 }, '-=0.1')
  .from('#hero .subtitle',  { opacity: 0, y: 20, duration: 0.4 }, '-=0.2')
  .from('#hero .cta-group', { opacity: 0, y: 20, duration: 0.35 }, '-=0.15');
```
