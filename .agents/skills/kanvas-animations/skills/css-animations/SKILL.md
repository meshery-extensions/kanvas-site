# CSS Animations Skill — Kanvas Site

Expert knowledge for CSS/SCSS animations and transitions in this project. No Tailwind — all styling
is pure SCSS compiled by Hugo Pipes.

## SCSS Variables (always use these)

```scss
// _variables_project.scss
$primary:   #00b39f;    // brand teal — NEVER hardcode this color
$secondary: #00d3a9;    // lighter teal
$dark:      #121212;    // dark background
$body-bg:   #010101;    // page background
$body-color: #cccccc;   // default text
```

**Anti-pattern:** `color: #00b39f` or `background: #00b399` — always use `$primary`.

## Hover Transitions

Standard hover convention for interactive elements:
```scss
.my-card {
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }
}
```

The easing `cubic-bezier(0.16, 1, 0.3, 1)` is the project standard — spring-like snap.
Duration: 250–350ms for hover, 150–250ms for focus states.

## Glass Card Pattern

```scss
.my-card {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    position: relative;           // required for ::before

    // Top-edge light reflection
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        pointer-events: none;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.18);
        transform: translateY(-4px) scale(1.01);
        transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                    background 0.28s ease,
                    border-color 0.28s ease,
                    box-shadow 0.28s ease;
    }
}
```

## Gradient Borders (mask-composite technique)

Used for special borders like the hero glass card:
```scss
.glass-card {
    border: 1px solid transparent;
    background-clip: padding-box;

    // Gradient border via pseudo-element
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(135deg, rgba($primary, 0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        pointer-events: none;
    }
}
```

## Header Scroll State

Border transitions from invisible to glass on scroll:
```scss
.site-header {
    border: 1px solid transparent;
    transition: border-color 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;

    &.scrolled {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(18, 18, 18, 0.85);
        backdrop-filter: blur(12px);
    }
}
```

## prefers-reduced-motion

```scss
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

Place this in `_base.scss` or `_styles_project.scss`, not in individual component files.

## GPU-Accelerated Properties

Always animate these — they don't trigger layout or paint:
```scss
transform: translateY(-4px);
transform: scale(1.02);
transform: rotate(45deg);
opacity: 0.8;
```

Never animate `width`, `height`, `top`, `left`, `margin`, `padding` on hover.

## Keyframe Animations

```scss
// Subtle ambient pulse (for glowing elements)
@keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba($primary, 0.3); }
    50%       { box-shadow: 0 0 40px rgba($primary, 0.6); }
}

.glow-element {
    animation: glow-pulse 3s ease-in-out infinite;
}

// Stagger delay via CSS custom property
.stagger-item {
    opacity: 0;
    animation: fade-up 0.5s ease-out forwards;
    animation-delay: calc(var(--stagger-index) * 0.07s);
}

@keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

Note: for scroll-triggered stagger, use `scrubEach()` in main.js instead of CSS animation-delay.

## Responsive Breakpoints

```scss
.my-section {
    padding: 6rem 2rem;

    @media (max-width: 960px) { /* tablet — major layout change */ }
    @media (max-width: 768px) { /* mobile landscape */ }
    @media (max-width: 480px) { /* mobile portrait — small adjustments */ }
}
```

## Infinite Marquee (CSS alternative to GSAP)

GSAP is preferred for the customers marquee (see gsap skill). CSS-only alternative:
```scss
@keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
}

.marquee-track {
    animation: marquee 30s linear infinite;

    &:hover { animation-play-state: paused; }
}
```

## SCSS File Structure

```
assets/scss/
├── _variables_project.scss   ← color/font/spacing tokens
├── _base.scss                ← resets, body, reduced-motion
├── _header.scss
├── _hero.scss
├── _hero-glass.scss          ← glass card component
├── _section-transitions.scss ← ambient orbs, section dividers
├── _[section].scss           ← one file per section
└── _styles_project.scss      ← @import manifest (edit this to add new files)
```

Always add new SCSS files as `@import "filename"` (without underscore/extension) in `_styles_project.scss`.
