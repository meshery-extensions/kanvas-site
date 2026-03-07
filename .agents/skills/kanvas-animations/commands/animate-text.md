---
name: kanvas-animations:animate-text
intent: /animate-text Command
tags:
  - kanvas-animations
  - command
  - animate-text
inputs: []
risk: medium
cost: medium
---

# /animate-text Command

Text animation patterns for Kanvas — Hugo static site, GSAP 3.13 + SCSS + vanilla JS. No React, no SplitText plugin, no Framer Motion.

## Text Animation Types

| Type | Technique | When to use |
|------|-----------|-------------|
| `heading-entrance` | `scrubEach()` y+opacity scrub | Below-fold section headings |
| `split-chars` | Vanilla JS `splitChars()` | Hero/above-fold character reveals |
| `typewriter` | Vanilla JS + CSS cursor | Hero subheadings, tag cycling |
| `counter` | ScrollTrigger `once:true` | Stats, metrics |
| `gradient-text` | SCSS `@keyframes gradientShift` | Hero h1 accents |

## Patterns

### Heading Entrance (below-fold, scrub)

```javascript
// In initScrollAnimations()
const trigger = '.my-section';

const badge = document.querySelector(`${trigger} .badge`);
const h2    = document.querySelector(`${trigger} h2`);
const lead  = document.querySelector(`${trigger} .lead-text`);

if (badge) gsap.from(badge, { opacity: 0, y: 20, scrollTrigger: { trigger, start: 'top 86%', end: 'top 56%', scrub: 1 } });
if (h2)    gsap.from(h2,    { opacity: 0, y: 40, scrollTrigger: { trigger, start: 'top 82%', end: 'top 52%', scrub: 1 } });
if (lead)  gsap.from(lead,  { opacity: 0, y: 30, scrollTrigger: { trigger, start: 'top 80%', end: 'top 50%', scrub: 1 } });
```

### Split Characters (vanilla JS — no SplitText plugin)

```javascript
// In static/scripts/main.js (or hero-glass.js for above-fold)
function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text); // accessibility: screen reader reads original
  el.textContent = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    el.appendChild(span);
  });
  return el.querySelectorAll('span');
}

// Above-fold only — in DOMContentLoaded timeline
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const h1 = document.querySelector('#hero h1');
  if (!h1) return;

  const chars = splitChars(h1);
  gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: 'power3.out',
    stagger: 0.025,
    delay: 0.2,
  });
});
```

### Typewriter (vanilla JS + CSS cursor)

```html
<!-- Hugo template -->
<span
  class="typewriter"
  data-texts="visual infrastructure,cloud native canvas,mesh management"
  data-speed="60"
  aria-live="polite"
></span>
```

```javascript
// In static/scripts/main.js
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.querySelectorAll('.typewriter').forEach(el => {
    const texts = el.dataset.texts ? el.dataset.texts.split(',') : [];
    if (texts.length > 0) {
      el.textContent = texts[0];
    }
  });
} else {
  document.querySelectorAll('.typewriter').forEach(el => {
    const texts  = el.dataset.texts.split(',');
    const speed  = parseInt(el.dataset.speed || '60', 10);
    let textIdx  = 0;
    let charIdx  = 0;
    let deleting = false;

    function tick() {
      const current = texts[textIdx];
      el.textContent = deleting
        ? current.slice(0, charIdx--)
        : current.slice(0, charIdx++);

      let delay = deleting ? speed * 0.5 : speed;

      if (!deleting && charIdx > current.length) {
        delay = 1800; // pause at end
        deleting = true;
      } else if (deleting && charIdx < 0) {
        charIdx  = 0;
        deleting = false;
        textIdx  = (textIdx + 1) % texts.length;
        delay    = 400;
      }

      setTimeout(tick, delay);
    }

    tick();
  });
}
```

```scss
// Blinking cursor
.typewriter::after {
  content: '|';
  color: $primary;
  animation: cursorBlink 0.9s step-end infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter::after { animation: none; opacity: 1; }
}
```

### Animated Counter

```html
<!-- Hugo template -->
<span
  class="counter"
  data-count="1200"
  data-decimals="0"
  data-suffix="+"
  aria-label="1200+"
>0</span>
```

```javascript
// In initScrollAnimations()
// Exception to scrub rule: counters use once:true for UX correctness
document.querySelectorAll('.counter').forEach(el => {
  const target   = parseFloat(el.dataset.count   || '0');
  const decimals = parseInt(el.dataset.decimals  || '0', 10);
  const suffix   = el.dataset.suffix || '';
  const obj      = { val: 0 };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = obj.val.toFixed(decimals) + suffix;
        },
        onComplete() {
          el.setAttribute('aria-label', target.toFixed(decimals) + suffix);
        },
      });
    },
  });
});
```

### Gradient Text

```scss
// In assets/scss/_typography.scss (or section SCSS file)
.gradient-text {
  background: linear-gradient(
    135deg,
    $primary 0%,
    lighten($primary, 25%) 50%,
    $primary 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s linear infinite;
}

@keyframes gradientShift {
  from { background-position: 0% center; }
  to   { background-position: 200% center; }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-text { animation: none; background-position: 0% center; }
}
```

```html
<!-- Hugo template usage -->
<h1>Build <span class="gradient-text">cloud native</span> infrastructure</h1>
```

## Accessibility Checklist

- `splitChars()` — set `aria-label` on parent before splitting (screen reader reads original)
- Typewriter — `aria-live="polite"` on container (announces each complete word)
- Counter — `aria-label` updated on complete with final value
- Gradient text — ensure contrast ratio ≥ 4.5:1 on dark background; fallback color is `$primary`

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| `SplitText` GSAP plugin (paid club) | Vanilla `splitChars()` function above |
| `stagger` combined with `scrub` | Use `scrubEach()` for below-fold |
| `TypewriterLoop` React component | Vanilla JS with `data-texts` attribute |
| `Typewriter` JSX | HTML `data-texts` attribute + vanilla JS |
| Fire-once reveal below fold | `scrub: 1` always (counters excepted) |

## Related Commands

- `/animate` — General animation dispatch
- `/animate-sequence` — Hero timeline choreography
- `/animate-effects` — Creative visual effects
