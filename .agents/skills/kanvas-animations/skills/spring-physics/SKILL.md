> **Not applicable to this project.** Spring physics libraries (react-spring, Framer Motion)
> require React. Kanvas site uses vanilla GSAP.
>
> **Equivalent patterns for this project:**
> - Hover spring feel → `cubic-bezier(0.16, 1, 0.3, 1)` in SCSS transitions (see **css-animations**)
> - One-shot spring entrance → `gsap.from('.el', { ..., ease: 'back.out(1.4)' })`
> - Overshoot on return → `gsap.to('.el', { x: 0, ease: 'elastic.out(1, 0.5)' })`
> - Scrub-based movement → always use `scrub: 1` (see **scroll-animations**)
