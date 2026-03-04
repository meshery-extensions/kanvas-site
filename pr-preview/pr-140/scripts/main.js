// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Header Timeline
let tl = gsap.timeline({
    defaults: { ease: "power4.out" }
});

tl.from(".main-nav ul li a", { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
tl.from(".btn-secondary", { x: 20, opacity: 0, duration: 0.6 }, "-=0.5");
tl.from(".btn-primary", { x: 20, opacity: 0, duration: 0.6 }, "<");

// 2. Optimized Counter Animation
const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 2000;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let startTime = null;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / speed, 1);
            const currentValue = Math.floor(percentage * target);

            if (target === 10) {
                counter.innerText = currentValue + "M+";
            } else {
                counter.innerText = currentValue + "+";
            }

            if (progress < speed) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + (target === 10 ? "M+" : "+");
            }
        };
        requestAnimationFrame(updateCount);
    });
};

// 3. Customers Marquee
const initMarquee = () => {
    const marquee = document.getElementById('customersMarquee');
    if (!marquee) return;
    marquee.innerHTML += marquee.innerHTML;
    const animation = gsap.to(marquee, {
        x: "0",
        startAt: { x: "-50%" },
        duration: 30,
        ease: "none",
        repeat: -1,
    });

    marquee.addEventListener('mouseenter', () => animation.pause());
    marquee.addEventListener('mouseleave', () => animation.play());
};

// ────────────────────────────────────────────────
// 4. Scroll-Linked Page Animations
// ────────────────────────────────────────────────

// Helper: per-element scrub entrance
const scrubEach = (elements, props, triggerEl, startBase, endBase, offsetPer) => {
    elements.forEach((el, i) => {
        gsap.from(el, Object.assign({}, props, {
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top ' + (startBase - i * offsetPer) + '%',
                end: 'top ' + (endBase - i * offsetPer) + '%',
                scrub: 1,
            }
        }));
    });
};

// ── 5. Scroll Logo Pieces — 6 independent pieces that reunite in the browser section ──
const initScrollPieces = () => {
    // The 6 polygons of the Kanvas isometric logo
    // Each piece: SVG polygon data, fill color, depth class, intro section
    const pieces = [
        { // 0: top-right triangle (light teal)
            points: '362.54 42.38 362.54 253.13 545.2 147.38',
            fill: '#00d3a9', depth: 'front',
        },
        { // 1: bottom-right triangle (light teal)
            points: '362.54 297.22 362.54 508.98 546.87 403.59',
            fill: '#00d3a9', depth: 'front',
        },
        { // 2: top-left triangle (dark teal)
            points: '336.24 251.68 336.24 44.16 155.82 147.58',
            fill: '#00b39f', depth: 'mid',
        },
        { // 3: bottom-left triangle (dark teal)
            points: '336.24 508 336.24 298.75 155.38 403.45',
            fill: '#00b39f', depth: 'mid',
        },
        { // 4: right side triangle (dark teal)
            points: '559.39 380.45 559.39 169.55 376.95 275.18',
            fill: '#00b39f', depth: 'back',
        },
        { // 5: left side triangle (light teal)
            points: '140.61 169.16 140.61 381.62 324.4 275.21',
            fill: '#00d3a9', depth: 'back',
        },
    ];

    // Piece introduction schedule:
    // Which section introduces each piece, and starting position
    const introSchedule = [
        { pieceIdx: 0, section: '.capabilities-section', startX: '-20vw', startY: '30vh', rotation: -30 },
        { pieceIdx: 2, section: '.customers-section', startX: '80vw', startY: '60vh', rotation: 20 },
        { pieceIdx: 5, section: '.hero-section',      startX: '-15vw', startY: '40vh', rotation: -15 },
        { pieceIdx: 1, section: '.demo-section',       startX: '85vw', startY: '55vh', rotation: 25 },
        { pieceIdx: 3, section: '.capabilities-section', startX: '18vw', startY: '45vh', rotation: -20 },
        { pieceIdx: 4, section: '.community-section',  startX: '82vw', startY: '35vh', rotation: 30 },
    ];

    // Create DOM for each floating piece
    const anchors = [];
    const bodies = [];

    pieces.forEach((p, i) => {
        const anchor = document.createElement('div');
        anchor.className = 'scroll-piece-anchor';
        anchor.setAttribute('data-piece', i);
        anchor.innerHTML =
            '<div class="scroll-piece-stage">' +
                '<div class="scroll-piece-body scroll-piece-body--depth-' + p.depth + '">' +
                    '<svg viewBox="130 30 440 490" xmlns="http://www.w3.org/2000/svg">' +
                        '<polygon points="' + p.points + '" fill="' + p.fill + '"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="scroll-piece-glow"></div>' +
            '</div>';
        document.body.appendChild(anchor);
        anchors.push(anchor);
        bodies.push(anchor.querySelector('.scroll-piece-body'));
    });

    // Also populate the reunited logo in browser-scene
    // Use innerHTML to ensure correct SVG namespace parsing
    const reunitedInner = document.getElementById('reunitedLogoInner');
    if (reunitedInner) {
        reunitedInner.innerHTML = pieces.map((p, i) =>
            '<svg class="reunited-piece reunited-piece--' + i + '" viewBox="130 30 440 490" xmlns="http://www.w3.org/2000/svg">' +
                '<polygon points="' + p.points + '" fill="' + p.fill + '"/>' +
            '</svg>'
        ).join('');
    }

    // Hidden until all pieces have physically assembled in place
    const reunitedFloat = document.querySelector('.reunited-float');
    if (reunitedFloat) {
        gsap.set(reunitedFloat, { opacity: 0 });
    }

    // ── Per-piece scroll journeys ──
    // Store journey triggers so we can kill the scrubs when convergence fires
    const journeyTriggers = [];

    const browserSection = document.querySelector('.browser');
    const sections = [
        '.customers-section',
        '.hero-section',
        '.demo-section',
        '.capabilities-section',
        '.community-section',
        '.browser',
    ];

    introSchedule.forEach((intro) => {
        const { pieceIdx, section, startX, startY, rotation } = intro;
        const anchor = anchors[pieceIdx];
        const body = bodies[pieceIdx];
        const triggerEl = document.querySelector(section);
        if (!triggerEl) return;

        // Start at position, scale 1 (50px stage)
        gsap.set(anchor, { x: startX, y: startY, scale: 1 });
        gsap.set(body, { rotateY: rotation, rotateX: Math.random() * 910 - 5 });

        // Fade-in as intro section enters viewport
        gsap.to(anchor, {
            opacity: .8,
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
            }
        });

        // Journey: drift toward browser section center,
        // growing from scale 1 (50px) to scale 5.6 (280px)
        const sectionIndex = sections.indexOf(section);
        const remainingSections = sections.slice(sectionIndex + 1);
        const steps = remainingSections.length + 1;

        // Each piece drifts to a unique orbit position around the browser area
        // so they remain visibly spread out — ready to swoop in from distinct directions.
        const orbitTargets = [
            { x: 35, y: 30 }, // piece 0: upper-left
            { x: 65, y: 30 }, // piece 1: upper-right
            { x: 70, y: 52 }, // piece 2: right
            { x: 60, y: 70 }, // piece 3: lower-right
            { x: 30, y: 52 }, // piece 4: left
            { x: 48, y: 22 }, // piece 5: top-center
        ];
        const orbit = orbitTargets[pieceIdx];

        const journey = gsap.timeline({
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top 80%',
                endTrigger: '.browser',
                end: 'top 40%',
                scrub: 2,
            }
        });
        journeyTriggers.push(journey.scrollTrigger);

        for (let s = 0; s < steps; s++) {
            const progress = (s + 1) / steps;
            const targetX = parseFloat(startX) + (orbit.x - parseFloat(startX)) * progress;
            const targetY = parseFloat(startY) + (orbit.y - parseFloat(startY)) * progress;
            const wobbleX = Math.sin(pieceIdx * 1.5 + s * 2) * 5;
            const wobbleY = Math.cos(pieceIdx * 1.2 + s * 1.8) * 3;
            const targetScale = 1 + progress * 4.6;

            journey.to(anchor, {
                x: targetX + wobbleX + 'vw',
                y: targetY + wobbleY + 'vh',
                scale: targetScale,
                duration: 1, ease: 'none',
            }, s > 0 ? '>' : 0);
            journey.to(body, {
                rotateY: rotation * (1 - progress),
                rotateX: (Math.random() * 6 - 3) * (1 - progress),
                duration: 1, ease: 'none',
            }, '<');
        }
    });

    // ── Step 1: Reveal — pieces rise from background as browser section approaches ──
    if (browserSection) {
        ScrollTrigger.create({
            trigger: browserSection,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                anchors.forEach(a => {
                    a.style.zIndex = '10';
                    const svg = a.querySelector('svg');
                    if (svg) gsap.to(svg, { opacity: 0.85, duration: 0.6, overwrite: true });
                });
            }
        });
    }

    // ── Step 2: Convergence — pieces swoop from orbit into the browser screen ──
    if (reunitedFloat && browserSection) {
        ScrollTrigger.create({
            trigger: browserSection,
            start: 'top 30%',
            once: true,
            onEnter: () => {
                requestAnimationFrame(() => {
                    // Kill scroll-driven journeys before taking over with time-based tweens
                    journeyTriggers.forEach(t => {
                        if (t) {
                            if (t.animation) t.animation.kill();
                            t.kill();
                        }
                    });
                    anchors.forEach(a => {
                        gsap.killTweensOf(a);
                        a.style.zIndex = '100'; // above everything during swoop
                    });
                    bodies.forEach(b => gsap.killTweensOf(b));

                    const logoEl = document.querySelector('.reunited-logo');
                    if (!logoEl) return;

                    const logoRect = logoEl.getBoundingClientRect();
                    const logoCenterX = logoRect.left + logoRect.width / 2;
                    const logoCenterY = logoRect.top + logoRect.height / 2;

                    let arrived = 0;
                    introSchedule.forEach(({ pieceIdx }, order) => {
                        const anchor = anchors[pieceIdx];
                        const body = bodies[pieceIdx];
                        const svg = anchor.querySelector('svg');
                        const glow = anchor.querySelector('.scroll-piece-glow');

                        if (glow) gsap.to(glow, { opacity: 0, duration: 0.15, overwrite: true });
                        if (svg) gsap.set(svg, { opacity: 1 });

                        gsap.to(anchor, {
                            x: logoCenterX,
                            y: logoCenterY,
                            scale: 5.6,
                            opacity: 1,
                            duration: 0.7,
                            delay: order * 0.07,
                            ease: 'power4.in',
                            overwrite: true,
                            onComplete: () => {
                                arrived++;
                                if (arrived === introSchedule.length) {
                                    gsap.to(anchors, {
                                        scale: 5.85, duration: 0.08, ease: 'power2.out',
                                        overwrite: true,
                                        onComplete: () => {
                                            gsap.to(anchors, {
                                                scale: 5.6, duration: 0.12, ease: 'power2.in',
                                                onComplete: () => {
                                                    gsap.set(reunitedFloat, { opacity: 1 });
                                                    anchors.forEach(a => {
                                                        gsap.set(a, { opacity: 0 });
                                                        a.style.zIndex = '-1';
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });

                        gsap.to(body, {
                            rotateY: 0, rotateX: 0,
                            duration: 0.7, delay: order * 0.07, ease: 'power3.out',
                            overwrite: true,
                        });
                    });
                });
            }
        });
    }
};

const initScrollAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── Background Ambient Overlay ──
    const ambient = document.createElement('div');
    ambient.className = 'scroll-ambient';
    ambient.innerHTML =
        '<div class="scroll-orb scroll-orb--1"></div>' +
        '<div class="scroll-orb scroll-orb--2"></div>' +
        '<div class="scroll-orb scroll-orb--3"></div>';
    document.body.prepend(ambient);

    gsap.to('.scroll-orb--1', {
        y: '-60vh', x: '15vw', scale: 1.4, opacity: 0.5,
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
    gsap.to('.scroll-orb--2', {
        y: '-40vh', x: '-20vw', scale: 0.8,
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 3 }
    });
    gsap.to('.scroll-orb--3', {
        y: '-80vh', x: '10vw', scale: 1.2, opacity: 0.7,
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.5 }
    });

    // ── Scroll Logo Pieces Journey ──
    initScrollPieces();

    // ── Hero Glass — Recession ──
    // Wraps #hero so GSAP recession doesn't conflict with hero-glass.js tilt.
    // Uses gsap.to (NOT gsap.from) — hero starts at full opacity/scale,
    // only recedes AFTER user scrolls past center.
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
                start: 'bottom 60%',  // recession begins when bottom of hero reaches 60% viewport
                end: 'bottom top',
                scrub: 1,
            }
        });
    }

    // ── Customers Section ──
    const customersSection = document.querySelector('.customers-section');
    if (customersSection) {
        gsap.from('.customers-title', {
            y: 30, opacity: 0,
            scrollTrigger: { trigger: customersSection, start: 'top 90%', end: 'top 55%', scrub: 1 }
        });
    }

    // ── Hero Section ("Step aside, YAML") — Layered parallax ──
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.from('.hero-badge', {
            y: 40, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 90%', end: 'top 50%', scrub: 1 }
        });
        gsap.from('.hero-title', {
            y: 80, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 88%', end: 'top 40%', scrub: 1 }
        });
        gsap.from('.hero-subtitle', {
            y: 100, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 85%', end: 'top 35%', scrub: 1 }
        });
        gsap.from('.hero-actions', {
            y: 60, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 80%', end: 'top 35%', scrub: 1 }
        });

        const statItems = heroSection.querySelectorAll('.stat-item');
        if (statItems.length) {
            scrubEach(statItems, { y: 50, opacity: 0 }, '.hero-stats', 90, 55, 3);
        }

        ScrollTrigger.create({
            trigger: heroSection,
            start: 'top 70%',
            once: true,
            onEnter: animateCounters,
        });

        // Recession — only after scrolling well past
        gsap.to(heroSection, {
            opacity: 0.4, y: -30,
            scrollTrigger: { trigger: heroSection, start: 'bottom 10%', end: 'bottom top', scrub: 1 }
        });
    }

    // ── Demo Section ──
    const demoSection = document.querySelector('.demo-section');
    if (demoSection) {
        gsap.from('.demo-header', {
            y: 50, opacity: 0,
            scrollTrigger: { trigger: demoSection, start: 'top 88%', end: 'top 50%', scrub: 1 }
        });

        const demoContainer = document.querySelector('.demo-container');
        if (demoContainer) {
            gsap.from(demoContainer, {
                scale: 0.88, opacity: 0, y: 60,
                scrollTrigger: { trigger: demoContainer, start: 'top 90%', end: 'top 35%', scrub: 1 }
            });
        }

        const personaCards = document.querySelectorAll('.persona-card');
        if (personaCards.length) {
            scrubEach(personaCards, { y: 60, opacity: 0, scale: 0.94 }, '.demo-personas', 90, 50, 5);
        }

        gsap.to(demoSection, {
            opacity: 0.5, y: -20,
            scrollTrigger: { trigger: demoSection, start: 'bottom 40%', end: 'bottom top', scrub: 1 }
        });
    }

    // ── Capabilities Section ──
    const capSection = document.querySelector('.capabilities-section');
    if (capSection) {
        const capHeaderEls = [
            capSection.querySelector('.capabilities-badge'),
            capSection.querySelector('.capabilities-title'),
            capSection.querySelector('.capabilities-subtitle'),
        ].filter(Boolean);
        scrubEach(capHeaderEls, { y: 40, opacity: 0 }, capSection, 88, 50, 4);

        const capCards = document.querySelectorAll('.cap-card');
        if (capCards.length) {
            scrubEach(capCards, { y: 70, opacity: 0 }, '.capabilities-grid', 90, 40, 3);
        }

        const ctaBox = document.querySelector('.cta-box');
        if (ctaBox) {
            gsap.from(ctaBox, {
                y: 40, opacity: 0, scale: 0.96,
                scrollTrigger: { trigger: ctaBox, start: 'top 90%', end: 'top 55%', scrub: 1 }
            });
        }
    }

    // ── Community Section ──
    const communitySection = document.querySelector('.community-section');
    if (communitySection) {
        const comHeaderEls = [
            communitySection.querySelector('.community-badge'),
            communitySection.querySelector('.community-title'),
            communitySection.querySelector('.community-subtitle') ||
              communitySection.querySelector('.capabilities-subtitle'),
        ].filter(Boolean);
        scrubEach(comHeaderEls, { y: 40, opacity: 0 }, communitySection, 88, 50, 4);

        const communityCards = document.querySelectorAll('.community-card');
        if (communityCards.length) {
            scrubEach(communityCards, { y: 60, opacity: 0, scale: 0.92 }, '.community-grid', 90, 40, 4);
        }
    }

    // ── Browser Section ──
    const browserShell = document.querySelector('.browser-shell');
    if (browserShell) {
        gsap.from(browserShell, {
            scale: 0.82, opacity: 0, y: 80,
            scrollTrigger: { trigger: '.browser', start: 'top 90%', end: 'top 30%', scrub: 1 }
        });
    }

    const browserStand = document.querySelector('.browser-stand');
    if (browserStand) {
        gsap.from(browserStand, {
            scaleX: 0.5, opacity: 0,
            scrollTrigger: { trigger: browserStand, start: 'top 95%', end: 'top 65%', scrub: 1 }
        });
    }

    // ── Section Dividers ──
    const dividerSections = document.querySelectorAll(
        '.customers-section, .hero-section, .demo-section, .capabilities-section, .community-section'
    );

    dividerSections.forEach((section) => {
        if (section.nextElementSibling && section.nextElementSibling.classList.contains('section-divider')) return;

        const divider = document.createElement('div');
        divider.className = 'section-divider';
        section.after(divider);

        gsap.from(divider, {
            opacity: 0, scaleX: 0.3,
            scrollTrigger: { trigger: divider, start: 'top 90%', end: 'top 70%', scrub: 1 }
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    initMarquee();
    initScrollAnimations();

    const header = document.querySelector(".site-header");
    if (header) {
        ScrollTrigger.create({
            start: "top -2",
            onEnter: () => header.classList.add("scrolled"),
            onLeaveBack: () => header.classList.remove("scrolled"),
        });
    }
});
