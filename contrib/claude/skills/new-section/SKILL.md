---
name: new-section
description: Scaffold a new Kanvas homepage section — creates the Hugo partial, SCSS module with glass conventions, registers the import, and adds a scrub-based GSAP ScrollTrigger stub. Usage: /new-section <section-name>
---

Scaffold a new homepage section for the Kanvas site. The section name is: **$ARGUMENTS**

If no name was provided, ask the user for one before proceeding.

## Steps

### 1. Create the Hugo partial
File: `layouts/partials/section/$ARGUMENTS.html`

```html
<section class="$ARGUMENTS-section">
  <div class="$ARGUMENTS-container">
    <h2 class="section-heading"><!-- heading --></h2>
    <p class="section-subheading"><!-- subheading --></p>
    <!-- content -->
  </div>
</section>
```
- External links: `target="_blank" rel="noreferrer"`
- No inline styles

### 2. Create the SCSS module
File: `assets/scss/_$ARGUMENTS.scss`

```scss
.$ARGUMENTS-section {
  padding: 6rem 2rem;

  .$ARGUMENTS-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  // Glass card pattern:
  // backdrop-filter: blur(16px) saturate(160%);
  // background: rgba(255, 255, 255, 0.04);
  // border: 1px solid rgba(255, 255, 255, 0.1);
  // border-radius: 16px;
  // position: relative;
  //
  // Top-edge highlight (::before):
  // content: ''; position: absolute; inset: 0;
  // border-radius: inherit;
  // box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  // pointer-events: none;

  @media (max-width: 960px) { /* tablet */ }
  @media (max-width: 768px) { /* mobile landscape */ }
  @media (max-width: 480px) { /* mobile portrait */ }
}
```
- Always use `$primary` for brand color — never hardcode `#00b39f`
- Hover transitions: `cubic-bezier(0.16, 1, 0.3, 1)` at 250–350ms

### 3. Register the SCSS import
In `assets/scss/_styles_project.scss`, add after the last `@import`:
```scss
@import "$ARGUMENTS";
```

### 4. Add a GSAP ScrollTrigger stub
In `static/scripts/main.js`, inside `initScrollAnimations()`:
```js
// $ARGUMENTS section
scrubEach(".$ARGUMENTS-section .section-heading",    { y: [40, -20], opacity: [0, 1] });
scrubEach(".$ARGUMENTS-section .section-subheading", { y: [30, -15], opacity: [0, 1] });
```
Use `scrubEach()` — animations must be scrub-based (linked to scroll position), never one-shot.
The `prefersReducedMotion` guard at the top of `initScrollAnimations()` covers all animations automatically.

### 5. Show placement
Print the current contents of `layouts/index.html` and indicate where to insert:
```
{{ partial "section/$ARGUMENTS.html" . }}
```

---

After creating all files, invoke the `ux-reviewer` agent to review the new partial and SCSS.
