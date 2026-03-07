# GSAP Skill — Kanvas Site

Expert knowledge for GSAP 3.13 + ScrollTrigger as used in this project (vanilla JS, Hugo static site).

## Stack Context

**This is not a React project.** GSAP is loaded via CDN, not npm:
```html
<!-- layouts/partials/footer.html — order matters -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="/scripts/main.js"></script>
```
GSAP core **must** load before ScrollTrigger. No npm install, no imports.

## Registering ScrollTrigger

```js
// Top of static/scripts/main.js
gsap.registerPlugin(ScrollTrigger);
```

## Core Tween API

```js
// Animate TO values
gsap.to('.element', { x: 100, opacity: 1, duration: 0.8, ease: 'power2.out' });

// Animate FROM values (start state → natural position)
gsap.from('.element', { y: 40, opacity: 0, duration: 0.8 });

// Animate FROM → TO (explicit both ends)
gsap.fromTo('.element', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 });

// Instant set (no animation)
gsap.set('.element', { opacity: 0, y: 40 });
```

## Timelines

```js
// Header entrance timeline (from main.js)
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.from('.main-nav ul li a', { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
tl.from('.btn-secondary', { x: 20, opacity: 0, duration: 0.6 }, '-=0.5');
tl.from('.btn-primary',   { x: 20, opacity: 0, duration: 0.6 }, '<');
```

## ScrollTrigger

```js
// Basic scrub-linked animation
gsap.from('.element', {
    y: 60, opacity: 0,
    scrollTrigger: {
        trigger: '.section',
        start: 'top 85%',   // when section top hits 85% of viewport
        end:   'top 45%',   // when section top hits 45% of viewport
        scrub: 1,           // smooth lag of 1 second — ALWAYS use scrub here
    }
});

// Cross-element trigger (trigger != animated element)
gsap.from('.card', {
    y: 70, opacity: 0,
    scrollTrigger: { trigger: '.card-grid', start: 'top 90%', end: 'top 40%', scrub: 1 }
});
```

## The scrubEach() Helper

Defined in main.js — use this instead of stagger+scrub for NodeLists:

```js
const scrubEach = (elements, props, triggerEl, startBase, endBase, offsetPer) => {
    elements.forEach((el, i) => {
        gsap.from(el, Object.assign({}, props, {
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top ' + (startBase - i * offsetPer) + '%',
                end:   'top ' + (endBase  - i * offsetPer) + '%',
                scrub: 1,
            }
        }));
    });
};

// Usage — stagger entrance of stat items
const statItems = heroSection.querySelectorAll('.stat-item');
scrubEach(statItems, { y: 50, opacity: 0 }, '.hero-stats', 90, 55, 3);
// statItems[0]: start=90% end=55%  statItems[1]: start=87% end=52%  etc.

// Usage — stagger card grid
const capCards = document.querySelectorAll('.cap-card');
scrubEach(capCards, { y: 70, opacity: 0 }, '.capabilities-grid', 90, 40, 3);
```

Never use stagger inside a single gsap.from() with scrub — elements get stuck at end state on
reverse scroll. Use scrubEach() instead.

## Customers Marquee

```js
const initMarquee = () => {
    const marquee = document.getElementById('customersMarquee');
    if (!marquee) return;
    marquee.innerHTML += marquee.innerHTML;  // duplicate for seamless loop
    const animation = gsap.to(marquee, {
        x: '0', startAt: { x: '-50%' },
        duration: 30, ease: 'none', repeat: -1,
    });
    marquee.addEventListener('mouseenter', () => animation.pause());
    marquee.addEventListener('mouseleave', () => animation.play());
};
```

## Section Recession Pattern

Sections fade + shift up after the user scrolls past them:
```js
// gsap.to (not .from) — element starts at full opacity, recedes as user scrolls past
gsap.to(heroSection, {
    opacity: 0.4, y: -30,
    scrollTrigger: {
        trigger: heroSection,
        start: 'bottom 10%',
        end:   'bottom top',
        scrub: 1,
    }
});
```

## Counters (fire-once, not scrub)

```js
ScrollTrigger.create({
    trigger: heroSection,
    start: 'top 70%',
    once: true,
    onEnter: animateCounters,   // one-shot OK for counters
});
```

## Ambient Orb Drift

```js
gsap.to('.scroll-orb--1', {
    y: '-60vh', x: '15vw', scale: 1.4, opacity: 0.5,
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
});
```

## Easing Quick Reference

```
power4.out    header entrance (fast snap)
power2.out    general entrance
power2.inOut  symmetric transitions
sine.inOut    gentle transitions
none          linear (marquee, scrub journeys)
bounce.out    logo assembly finale only
```

## prefers-reduced-motion Guard

All scroll animations live inside initScrollAnimations(). The guard at the top covers everything:

```js
const initScrollAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // ... all scroll animations here
};
```

Do not add per-animation reduced-motion checks.

## File Locations

| File | Purpose |
|------|---------|
| static/scripts/main.js | All GSAP animations |
| static/scripts/hero-glass.js | CSS custom property updates for 3D tilt only |
| layouts/partials/footer.html | CDN script tags (load order matters) |

## Adding Animations to a New Section

Inside initScrollAnimations() in main.js:
```js
const mySection = document.querySelector('.my-section');
if (mySection) {
    scrubEach(
        mySection.querySelectorAll('.section-heading, .section-subheading'),
        { y: 40, opacity: 0 },
        mySection, 88, 50, 4
    );
    scrubEach(mySection.querySelectorAll('.my-card'), { y: 60, opacity: 0 }, '.my-grid', 90, 40, 3);
}
```

Always null-check (if (mySection)) before querying children.
