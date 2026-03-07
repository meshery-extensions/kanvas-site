---
name: kanvas-animations:animate-component
intent: /animate-component
tags:
  - kanvas-animations
  - command
  - animate-component
inputs: []
risk: medium
cost: medium
---

# /animate-component

Add GSAP/CSS animations to an existing Hugo partial or static JS component. Analyzes the current HTML structure and inserts correct `scrubEach()` calls, CSS transitions, or keyframe animations.

## Usage

```
/animate-component <partial-path> [animation-description]
```

## Workflow

1. **Read the partial** — identify animatable elements (badge, title, subtitle, cards, icons)
2. **Classify trigger** — scroll entrance, hover state, page-load, or ambient loop
3. **Generate SCSS** — transitions and keyframes in the section's SCSS file
4. **Generate JS** — `scrubEach()` block inside `initScrollAnimations()` in `main.js`
5. **Check conventions** — scrub-based for below-fold, `$primary` not `#00b39f`

## Examples

```bash
# Add scroll entrance to a features section partial
/animate-component layouts/partials/section/features.html scroll entrance for cards

# Add hover lift to a pricing card
/animate-component layouts/partials/section/pricing.html hover lift on .pricing-card

# Add ambient float to hero icons
/animate-component layouts/partials/section/hero.html floating icons
```

## What the Command Produces

### For a scroll entrance on cards

Given a partial like:
```html
<!-- layouts/partials/section/features.html -->
<section class="features-section">
    <div class="features-header">
        <span class="features-badge">Features</span>
        <h2 class="features-title">...</h2>
    </div>
    <div class="features-grid">
        <div class="feature-card">...</div>
        <div class="feature-card">...</div>
        <div class="feature-card">...</div>
    </div>
</section>
```

Adds to `main.js` inside `initScrollAnimations()`:
```js
const featuresSection = document.querySelector('.features-section');
if (featuresSection) {
    const headerEls = [
        featuresSection.querySelector('.features-badge'),
        featuresSection.querySelector('.features-title'),
    ].filter(Boolean);
    scrubEach(headerEls, { y: 40, opacity: 0 }, featuresSection, 88, 50, 4);

    const cards = featuresSection.querySelectorAll('.feature-card');
    scrubEach(cards, { y: 60, opacity: 0 }, '.features-grid', 90, 45, 3);
}
```

### For hover lift on a card

Adds to `_features.scss`:
```scss
.feature-card {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
}
```

## Animation Opportunity Detection

| Pattern in HTML | Suggested animation |
|----------------|---------------------|
| `.badge` or `.pill` | `scrubEach` entrance (first to enter, shallowest y) |
| `h1`, `h2`, `.title` | `scrubEach` entrance (medium y) |
| `.subtitle`, `p.lead` | `scrubEach` entrance (deepest y) |
| `.card`, `.grid-item` | `scrubEach` per-card stagger |
| `svg`, `.icon` | `scrubEach` with `scale: 0.7` + `opacity: 0` |
| `.btn-primary`, `.cta` | Hover scale + `cubic-bezier(0.16, 1, 0.3, 1)` |
| Section bottom | Recession: `gsap.to(section, { opacity: 0.5, y: -20 })` |

## Rules

- Never animate `#hero` transform from `main.js` — use `.hero-recession` wrapper
- Below-fold content always `scrub: 1` — no `once: true`
- Hover states belong in SCSS, not GSAP event listeners (unless magnetic/elastic)
- Cards get `scrubEach` stagger; never `stagger` prop inside `gsap.from()`
