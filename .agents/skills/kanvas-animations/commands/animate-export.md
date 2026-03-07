---
name: kanvas-animations:animate-export
intent: /animate-export
tags:
  - kanvas-animations
  - command
  - animate-export
inputs: []
risk: medium
cost: medium
---

# /animate-export

Extract and document a reusable Kanvas animation pattern from existing code.

> **Purpose:** Find a recurring animation pattern in `static/scripts/` or `assets/scss/`
> and produce a clean, documented snippet ready to paste into new sections.
> Not an npm package exporter — Kanvas is a Hugo static site with no bundler.

## Usage

```
/animate-export <description or selector>
```

## Standard Exportable Patterns

These patterns are used throughout Kanvas and can be copied verbatim:

### heading-entrance
```javascript
// scrubEach badge → title → subtitle for a new section
const badge   = document.querySelector('.my-section .badge');
const title   = document.querySelector('.my-section h2');
const sub     = document.querySelector('.my-section .subtitle');
const trigger = '.my-section';

if (badge)  gsap.from(badge,  { opacity: 0, y: 20, scrollTrigger: { trigger, start: 'top 85%', end: 'top 55%', scrub: 1 } });
if (title)  gsap.from(title,  { opacity: 0, y: 40, scrollTrigger: { trigger, start: 'top 80%', end: 'top 50%', scrub: 1 } });
if (sub)    gsap.from(sub,    { opacity: 0, y: 30, scrollTrigger: { trigger, start: 'top 78%', end: 'top 48%', scrub: 1 } });
```

### card-stagger
```javascript
// scrubEach for a grid of cards
const cards = document.querySelectorAll('.my-section .card');
if (cards.length) {
  scrubEach(cards, { opacity: 0, y: 30 }, '.my-section', 80, 40, 5);
}
```

### section-recession
```javascript
// Fade + shift up as user scrolls past the section
const section = document.querySelector('.my-section');
if (section) {
  gsap.to(section, {
    opacity: 0,
    y: -40,
    scrollTrigger: {
      trigger: section,
      start: 'bottom 70%',
      end:   'bottom 20%',
      scrub: 1,
    },
  });
}
```

### hover-lift (CSS only)
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

### float-keyframe (CSS only)
```scss
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
```

### pulse-glow (CSS only)
```scss
@keyframes shadowPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba($primary, 0); }
  50%       { box-shadow: 0 0 20px 4px rgba($primary, 0.25); }
}

.pulse-glow {
  animation: shadowPulse 2.5s ease-in-out infinite;
}
```

### shimmer (CSS only)
```scss
.shimmer {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.12) 50%,
      transparent 60%
    );
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

### glass-card (SCSS only)
```scss
.glass-card {
  backdrop-filter: blur(16px) saturate(160%);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  // Top-edge light reflection
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 40%);
    pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}
```

## Workflow

1. Describe the pattern or provide a CSS selector
2. Locate matching code in `static/scripts/main.js` or `assets/scss/`
3. Return a clean, self-contained snippet with usage comments
4. Output is ready to paste into a new section's JS block or SCSS partial
