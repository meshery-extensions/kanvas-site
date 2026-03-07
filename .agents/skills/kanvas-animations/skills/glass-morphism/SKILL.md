# Glass Morphism Skill — Kanvas Site

Complete reference for the glass card visual language used throughout the Kanvas site.

## Core Glass Card (SCSS)

```scss
.my-card {
    // Glass surface
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);

    // Frosted edge
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;

    // Required for ::before positioning
    position: relative;

    // Top-edge light reflection
    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
        pointer-events: none;
    }
}
```

## Hover State

```scss
.my-card {
    // Declare transitions here, not on :hover
    transition:
        transform    0.28s cubic-bezier(0.16, 1, 0.3, 1),
        background   0.28s ease,
        border-color 0.28s ease,
        box-shadow   0.28s ease;

    &:hover {
        background:   rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.18);
        transform:    translateY(-4px) scale(1.01);
        box-shadow:   0 20px 60px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.08);
    }
}
```

## Easing

`cubic-bezier(0.16, 1, 0.3, 1)` is the project's spring easing. Use for all hover transforms.
Do not use `bounce`, `elastic`, or dramatic springs anywhere.

## Gradient Border Variant

For cards with a teal-to-transparent border (hero glass card style):
```scss
.hero-card {
    position: relative;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(20px) saturate(180%);

    // Gradient border via mask-composite
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
            135deg,
            rgba($primary, 0.6) 0%,
            rgba(255, 255, 255, 0.15) 40%,
            transparent 80%
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
                mask-composite: exclude;
        pointer-events: none;
    }
}
```

## Elevation Scale

| Level | Use Case | blur | bg opacity | border opacity |
|-------|----------|------|-----------|----------------|
| Low   | Subtle background cards | blur(8px) | 0.03 | 0.06 |
| Mid   | Standard content cards | blur(16px) saturate(160%) | 0.04–0.06 | 0.10 |
| High  | Focused / modal-like | blur(24px) saturate(180%) | 0.08–0.12 | 0.15 |

## Glass on Dark Backgrounds

The site background is near-black (`#010101`). Glass surfaces should feel slightly lighter:
- Use `rgba(255, 255, 255, ...)` for white-tinted glass
- Use `rgba($primary, 0.06)` for teal-tinted glass variants
- Avoid pure `rgba(0,0,0,...)` backgrounds — they disappear against the dark page

## Inner Glow via box-shadow

```scss
// Ambient teal glow (use sparingly — CTAs, hero elements)
box-shadow:
    0 0 0 1px rgba($primary, 0.2),         // subtle teal ring
    0 0 40px rgba($primary, 0.08),         // ambient teal haze
    inset 0 1px 0 rgba(255, 255, 255, 0.1); // top highlight
```

## CSS Custom Properties for 3D Tilt (hero-glass.js)

The hero glass card reads CSS custom properties updated by pointermove:
```scss
// Properties written by hero-glass.js:
// --tilt-x     rotateX degrees
// --tilt-y     rotateY degrees
// --cursor-x   cursor x as 0–1
// --cursor-y   cursor y as 0–1

.hero-glass-card {
    transform: perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
    transition: transform 0.1s ease-out;   // fast follow
}
```

Do not add JS-driven tilt to other elements — keep it isolated to the hero glass card.

## Animation Anti-Patterns

- Hard shadows (`box-shadow: 5px 5px 0 #000`) instead of soft diffuse ones
- Fully opaque backgrounds on elements that should be glass (`background: #1a1a1a`)
- Missing `::before` top-edge highlight
- Hardcoded `#00b39f` instead of `$primary`
- backdrop-filter without `-webkit-` prefix (Safari requires it)
- Border-radius inconsistency — pick 12px, 16px, or 20px and use it consistently per component type

## Reduced Motion

Glass CSS effects (backdrop-filter, border-radius, box-shadow) are not animated and don't need
reduced-motion treatment. Only transitions (transform, opacity) need it — covered globally in _base.scss.
