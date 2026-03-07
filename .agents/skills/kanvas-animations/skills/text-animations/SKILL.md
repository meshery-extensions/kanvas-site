# Text Animations Skill — Kanvas Site

Expert knowledge for text animations: GSAP scrub-based heading entrances, vanilla JS split-char
reveals, CSS gradient text, and counter animations. No React, no Framer Motion, no paid GSAP
SplitText plugin.

## Standard Section Heading Pattern

All heading entrances use `scrubEach()` — layered parallax depths, scrub-based:

```js
// main.js — inside initScrollAnimations()
const mySection = document.querySelector('.my-section');
if (mySection) {
    const headerEls = [
        mySection.querySelector('.my-badge'),
        mySection.querySelector('.my-title'),
        mySection.querySelector('.my-subtitle'),
    ].filter(Boolean);

    // Stagger entrance: badge enters first (shallowest), subtitle last (deepest)
    scrubEach(headerEls, { y: 40, opacity: 0 }, mySection, 88, 50, 4);
    // badge:    top 88% → top 50%
    // title:    top 84% → top 46%
    // subtitle: top 80% → top 42%
}
```

## GSAP Header Entrance Timeline (above-fold only)

One-shot timeline for the page-load header entrance — the only place fire-once GSAP is used
for text:

```js
// main.js
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.from('.main-nav ul li a', { opacity: 0, y: -50, duration: 1, stagger: 0.2 })
  .from('.btn-secondary',    { x: 20, opacity: 0, duration: 0.6 }, '-=0.5')
  .from('.btn-primary',      { x: 20, opacity: 0, duration: 0.6 }, '<');
```

## CSS Gradient Text

```scss
.gradient-heading {
    background: linear-gradient(
        135deg,
        $body-color 0%,
        rgba($primary, 0.9) 50%,
        $body-color 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

// Animated gradient shift on hover
.gradient-heading--animated {
    @extend .gradient-heading;
    transition: background-position 0.5s ease;

    &:hover {
        background-position: right center;
    }
}

// Shimmer sweep (see accent-animations for @keyframes shimmer)
.shimmer-heading {
    @extend .gradient-heading;
    animation: shimmer 3s linear infinite;
}
```

## Vanilla JS Split-Char Reveal

No paid SplitText plugin — split manually with vanilla JS:

```js
// Utility — wrap each char in a span
const splitChars = (el) => {
    const text = el.textContent;

    // Clear existing content before rebuilding safely
    el.textContent = '';

    text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.setAttribute('aria-hidden', 'true');

        // Preserve spaces as non-breaking spaces for layout
        span.textContent = char === ' ' ? '\u00A0' : char;

        el.appendChild(span);
    });
    el.setAttribute('aria-label', text);   // preserve accessibility
};

// Usage
const heading = document.querySelector('.hero-title');
if (heading) {
    splitChars(heading);
    const chars = heading.querySelectorAll('.char');
    scrubEach(chars, { opacity: 0, y: 20 }, heading, 90, 50, 1.5);
}
```

```scss
.char {
    display: inline-block;   // required for transform to work on inline chars
    will-change: transform, opacity;
}
```

## Typewriter Effect (vanilla JS, no library)

```js
// static/scripts/main.js or inline
const typewriter = (el, text, speed = 60) => {
    el.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    el.after(cursor);

    const interval = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) {
            clearInterval(interval);
            cursor.remove();
        }
    }, speed);
};
```

```scss
.typewriter-cursor {
    display: inline-block;
    animation: blink 0.8s step-end infinite;
    color: $primary;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
}
```

## Counter Animation (fire-once)

The only text animation that uses `once: true` — counters can't run in reverse meaningfully:

```js
// main.js — animateCounters()
const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target   = parseInt(el.dataset.count,  10);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix   = el.dataset.suffix  || '';
        const prefix   = el.dataset.prefix  || '';

        gsap.fromTo({ val: 0 }, { val: target }, {
            duration: 2,
            ease: 'power2.out',
            onUpdate() {
                el.textContent = prefix + this.targets()[0].val.toFixed(decimals) + suffix;
            },
            onComplete() {
                el.textContent = prefix + target.toFixed(decimals) + suffix;
            },
        });
    });
};

ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 70%',
    once: true,
    onEnter: animateCounters,
});
```

```html
<span data-count="10000" data-suffix="+" class="stat-number">10000+</span>
<span data-count="99.9"  data-decimals="1" data-suffix="%" class="stat-number">99.9%</span>
```

## Text Scramble (vanilla JS)

```js
const scrambleText = (el, finalText, duration = 800) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    const frames = 20;
    const interval = duration / frames;
    let frame = 0;

    const tick = setInterval(() => {
        const progress = frame / frames;
        const revealed = Math.floor(progress * finalText.length);

        el.textContent = finalText.split('').map((char, i) =>
            i < revealed || char === ' '
                ? char
                : chars[Math.floor(Math.random() * chars.length)]
        ).join('');

        if (++frame > frames) {
            clearInterval(tick);
            el.textContent = finalText;
        }
    }, interval);
};
```

## CSS Text Decorations

```scss
// Highlight underline that grows on hover (no JS)
.link-underline {
    position: relative;
    text-decoration: none;

    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: $primary;
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover::after,
    &[aria-current="page"]::after {
        width: 100%;
    }
}

// Word-level highlight background (no JS)
.highlight-word {
    background: linear-gradient(
        transparent 60%,
        rgba($primary, 0.2) 60%
    );
    padding: 0 2px;
}
```

## Hugo Template Text Patterns

```html
<!-- Hugo: truncate long text with | truncate -->
<p class="card-excerpt">{{ .Summary | truncate 120 }}</p>

<!-- Hugo: safe markdown rendering -->
<div class="rich-text">{{ .Content | safeHTML }}</div>

<!-- Stat with data attribute for counter JS -->
<span class="stat-number" data-count="{{ .Params.users }}">
    {{- .Params.users | lang.FormatNumberCustom 0 -}}+
</span>
```

## Anti-Patterns

- `stagger` inside a single `gsap.from()` with `scrub: true` — elements get stuck on reverse scroll,
  use `scrubEach()` instead
- `SplitText` plugin — paid GSAP club plugin, not available on CDN
- Animating `font-size` or `letter-spacing` — causes layout reflow, animate `transform: scale()` instead
- Per-character `scrub` with too many chars (100+) — limit to words or lines for performance
- Hard-coded `#00b39f` in inline styles — always use `$primary` in SCSS
