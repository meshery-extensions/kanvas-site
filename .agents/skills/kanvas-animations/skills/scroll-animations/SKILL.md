# Scroll Animations Skill — Kanvas Site

Expert knowledge for scroll-triggered animations as used in this project: GSAP ScrollTrigger with
scrub-based linking (no Framer Motion, no React).

## Architecture: Scrub-Based, Not Fire-Once

All scroll animations in this project are **continuously linked to scroll position** via `scrub`.
Do not use `toggleActions` or fire-once patterns for section animations.

```js
// CORRECT — scrub-based (animation reverses as user scrolls back)
gsap.from('.element', {
    y: 60, opacity: 0,
    scrollTrigger: { trigger: '.section', start: 'top 85%', end: 'top 45%', scrub: 1 }
});

// WRONG — toggleActions fire-once pattern (avoid for section content)
gsap.from('.element', {
    y: 60, opacity: 0, duration: 0.8,
    scrollTrigger: { trigger: '.section', start: 'top 85%', toggleActions: 'play none none reverse' }
});
```

## Scrub Values

```
scrub: 1     standard content entrances (1s lag)
scrub: 2     ambient orb drift, heavier elements
scrub: 2.5   secondary orbs
scrub: 3     slowest background elements
```

## Per-Element Stagger: scrubEach()

```js
// Signature
scrubEach(elements, props, triggerEl, startBase, endBase, offsetPer)
// elements   — NodeList or array of DOM elements
// props      — gsap.from() animation properties (y, opacity, scale, etc.)
// triggerEl  — trigger element (string selector or DOM element)
// startBase  — viewport % where first element's animation starts
// endBase    — viewport % where first element's animation ends
// offsetPer  — % to subtract per subsequent element (creates stagger)
```

```js
// Header trio (badge → title → subtitle)
const headerEls = [
    section.querySelector('.capabilities-badge'),
    section.querySelector('.capabilities-title'),
    section.querySelector('.capabilities-subtitle'),
].filter(Boolean);
scrubEach(headerEls, { y: 40, opacity: 0 }, capSection, 88, 50, 4);
// badge:    top 88% → top 50%
// title:    top 84% → top 46%
// subtitle: top 80% → top 42%

// Card grid (deeper y, slower end)
scrubEach(document.querySelectorAll('.cap-card'), { y: 70, opacity: 0 }, '.capabilities-grid', 90, 40, 3);

// Persona cards (with scale)
scrubEach(document.querySelectorAll('.persona-card'), { y: 60, opacity: 0, scale: 0.94 }, '.demo-personas', 90, 50, 5);
```

## Standard Section Pattern

```js
const mySection = document.querySelector('.my-section');
if (mySection) {
    // 1. Header elements
    scrubEach(
        [mySection.querySelector('.my-badge'), mySection.querySelector('.my-title'), mySection.querySelector('.my-subtitle')].filter(Boolean),
        { y: 40, opacity: 0 },
        mySection, 88, 50, 4
    );

    // 2. Card grid
    const cards = mySection.querySelectorAll('.my-card');
    if (cards.length) {
        scrubEach(cards, { y: 60, opacity: 0 }, '.my-grid', 90, 40, 3);
    }

    // 3. CTA / special element
    const cta = mySection.querySelector('.my-cta');
    if (cta) {
        gsap.from(cta, {
            y: 40, opacity: 0, scale: 0.96,
            scrollTrigger: { trigger: cta, start: 'top 90%', end: 'top 55%', scrub: 1 }
        });
    }

    // 4. Recession (section fades as user scrolls past)
    gsap.to(mySection, {
        opacity: 0.5, y: -20,
        scrollTrigger: { trigger: mySection, start: 'bottom 40%', end: 'bottom top', scrub: 1 }
    });
}
```

## Hero Glass Recession

The hero glass card uses a wrapper div to separate GSAP recession from hero-glass.js tilt:

```js
// main.js — hero recession
const hero = document.querySelector('#hero');
if (hero) {
    const wrapper = document.createElement('div');
    wrapper.className = 'hero-recession';
    hero.parentNode.insertBefore(wrapper, hero);
    wrapper.appendChild(hero);

    gsap.to(wrapper, {
        scale: 0.92, opacity: 1, y: -40,
        scrollTrigger: {
            trigger: wrapper,
            start: 'bottom 30%',
            end:   'bottom top',
            scrub: 1,
        }
    });
}
```

Do not apply recession to `#hero` directly — hero-glass.js also sets transform on it.

## Layered Parallax Depths

Elements in the same section enter at different scroll positions for depth:

```js
// Fast (shallow depth) — enters first
gsap.from('.hero-badge', {
    y: 40, opacity: 0,
    scrollTrigger: { trigger: heroSection, start: 'top 90%', end: 'top 50%', scrub: 1 }
});
// Medium depth
gsap.from('.hero-title', {
    y: 80, opacity: 0,
    scrollTrigger: { trigger: heroSection, start: 'top 88%', end: 'top 40%', scrub: 1 }
});
// Deep (enters last, travels most)
gsap.from('.hero-subtitle', {
    y: 100, opacity: 0,
    scrollTrigger: { trigger: heroSection, start: 'top 85%', end: 'top 35%', scrub: 1 }
});
```

Rule of thumb: deeper elements have larger `y`, earlier `start`, and earlier `end`.

## Ambient Overlay

Three fixed orbs drift at different scrub rates for parallax depth:

```js
// Created by initScrollAnimations() — injected into document.body
const ambient = document.createElement('div');
ambient.className = 'scroll-ambient';
ambient.innerHTML =
    '<div class="scroll-orb scroll-orb--1"></div>' +
    '<div class="scroll-orb scroll-orb--2"></div>' +
    '<div class="scroll-orb scroll-orb--3"></div>';
document.body.prepend(ambient);

gsap.to('.scroll-orb--1', { y: '-60vh', x: '15vw',  scale: 1.4, opacity: 0.5,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 } });
gsap.to('.scroll-orb--2', { y: '-40vh', x: '-20vw', scale: 0.8,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 3 } });
gsap.to('.scroll-orb--3', { y: '-80vh', x: '10vw',  scale: 1.2, opacity: 0.7,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.5 } });
```

## Section Dividers

Dividers are injected between sections and scale in on scrub:

```js
const divider = document.createElement('div');
divider.className = 'section-divider';
section.after(divider);
gsap.from(divider, {
    opacity: 0, scaleX: 0.3,
    scrollTrigger: { trigger: divider, start: 'top 90%', end: 'top 70%', scrub: 1 }
});
```

## Header Scroll State

One-shot class toggle — not a scrub animation:

```js
ScrollTrigger.create({
    start: 'top -2',
    onEnter:     () => header.classList.add('scrolled'),
    onLeaveBack: () => header.classList.remove('scrolled'),
});
```

## Fire-Once Exceptions

Counter animation is the only legitimate one-shot pattern (animation can't run backwards):

```js
ScrollTrigger.create({
    trigger: heroSection,
    start: 'top 70%',
    once: true,
    onEnter: animateCounters,
});
```

## prefers-reduced-motion

Entire initScrollAnimations() returns early if reduced motion is set. No per-animation checks needed.
