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
    const formatCounterValue = (value) => value.toLocaleString('en-US');
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const formattedTarget = formatCounterValue(target);
        const suffix = target === 10 ? "M+" : "+";

        if (isReduced) {
            counter.innerText = formattedTarget + suffix;
            return;
        }

        let startTime = null;
        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / speed, 1);
            const currentValue = Math.floor(percentage * target);
            
            counter.innerText = formatCounterValue(currentValue) + suffix;

            if (progress < speed) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = formattedTarget + suffix;
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
                scrub: true,
            }
        }));
    });
};

// ── 5. Scroll Logo Pieces — 6 independent pieces that reunite in the browser section ──
const initScrollPieces = () => {
    // Read the pieces from the DOM to avoid duplication with HTML fallback
    const pieceElements = document.querySelectorAll('#reunitedLogoInner .reunited-piece');
    if (!pieceElements.length) return;

    const pieces = Array.from(pieceElements).map(svg => {
        const poly = svg.querySelector('polygon');
        return {
            points: poly.getAttribute('points'),
            fill: poly.getAttribute('fill'),
            depth: svg.getAttribute('data-depth')
        };
    });

    // Piece introduction schedule:
    // Which section introduces each piece, and starting position
    const introSchedule = [
        { pieceIdx: 0, section: '.capabilities-section', startX: '-20vw', startY: '30vh', rotation: -30 },
        { pieceIdx: 2, section: '.customers-section', startX: '80vw', startY: '60vh', rotation: 20 },
        { pieceIdx: 5, section: '.hero-section', startX: '-15vw', startY: '40vh', rotation: -15 },
        { pieceIdx: 1, section: '.demo-section', startX: '85vw', startY: '55vh', rotation: 25 },
        { pieceIdx: 3, section: '.capabilities-section', startX: '18vw', startY: '45vh', rotation: -20 },
        { pieceIdx: 4, section: '.community-section', startX: '82vw', startY: '35vh', rotation: 30 },
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



    // Hidden until all pieces have physically assembled in place
    const reunitedFloat = document.querySelector('.reunited-float');
    if (reunitedFloat) {
        gsap.set(reunitedFloat, { opacity: 0 });
    }

    // ── Per-piece scroll journeys ──
    // Store journey triggers so we can kill the scrubs when convergence fires
    const journeyTriggers = [];
    const initialLogoEl = document.querySelector('.reunited-logo');
    const getTargetScale = () => {
        const floatEl = document.querySelector('.reunited-float');
        if (!floatEl) return 5.6;
        const oldAnim = floatEl.style.animation;
        floatEl.style.animation = 'none';
        const w = floatEl.getBoundingClientRect().width;
        floatEl.style.animation = oldAnim;
        return w / 50 || 5.6;
    };

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
                scrub: true,
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
                scrub: true,
                invalidateOnRefresh: true,
            }
        });
        journeyTriggers.push(journey.scrollTrigger);

        for (let s = 0; s < steps; s++) {
            const progress = (s + 1) / steps;
            const targetX = parseFloat(startX) + (orbit.x - parseFloat(startX)) * progress;
            const targetY = parseFloat(startY) + (orbit.y - parseFloat(startY)) * progress;
            const wobbleX = Math.sin(pieceIdx * 1.5 + s * 2) * 5;
            const wobbleY = Math.cos(pieceIdx * 1.2 + s * 1.8) * 3;
            journey.to(anchor, {
                x: targetX + wobbleX + 'vw',
                y: targetY + wobbleY + 'vh',
                scale: () => {
                    const currentScaleFactor = getTargetScale() - 1;
                    return 1 + progress * currentScaleFactor;
                },
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
            onEnter: () => {
                anchors.forEach(a => {
                    a.style.zIndex = '10';
                    const svg = a.querySelector('svg');
                    if (svg) gsap.to(svg, { opacity: 0.85, duration: 0.6, overwrite: true });
                });
            },
            onLeaveBack: () => {
                anchors.forEach(a => {
                    a.style.zIndex = '-1';
                    const svg = a.querySelector('svg');
                    if (svg) gsap.to(svg, { clearProps: 'opacity', duration: 0.6, overwrite: true });
                });
            }
        });
    }

    // ── Step 2: Convergence — fully scrubbed, high performance ──
    if (reunitedFloat && browserSection) {
        const sections = [
            '.customers-section', '.hero-section', '.demo-section',
            '.capabilities-section', '.community-section', '.browser'
        ];
        
        const orbitTargets = [
            { x: 35, y: 30 }, { x: 65, y: 30 }, { x: 70, y: 52 },
            { x: 60, y: 70 }, { x: 30, y: 52 }, { x: 48, y: 22 }
        ];
        
        const startPositions = [];
        introSchedule.forEach((intro) => {
            const { pieceIdx, section } = intro;
            const steps = sections.slice(sections.indexOf(section) + 1).length + 1;
            const s = steps - 1;
            startPositions[pieceIdx] = {
                x: orbitTargets[pieceIdx].x + Math.sin(pieceIdx * 1.5 + s * 2) * 5,
                y: orbitTargets[pieceIdx].y + Math.cos(pieceIdx * 1.2 + s * 1.8) * 3,
            };
        });

        const logoEl = document.querySelector('.reunited-logo');
        const easeFn = gsap.parseEase('power2.inOut');
        const bounceFn = gsap.parseEase('bounce.out');

        let docLogoCenterX = 0;
        let docLogoCenterY = 0;
        let cachedDynamicScale = 5.6;

        ScrollTrigger.create({
            trigger: browserSection,
            start: 'top 40%',
            end: 'top 10%',
            scrub: true,
            onRefresh: () => {
                if (!logoEl) return;
                
                // Temporarily disable the float animation to get the true untransformed center
                const oldAnim = reunitedFloat.style.animation;
                reunitedFloat.style.animation = 'none';
                
                const floatRect = reunitedFloat.getBoundingClientRect();
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const scrollX = window.scrollX || document.documentElement.scrollLeft;
                
                docLogoCenterX = floatRect.left + scrollX + floatRect.width / 2;
                docLogoCenterY = floatRect.top + scrollY + floatRect.height / 2 - 24;
                cachedDynamicScale = floatRect.width / 50 || 5.6;
                
                // Restore the float animation
                reunitedFloat.style.animation = oldAnim;
            },
            onUpdate: (self) => {
                if (!logoEl) return;
                const progress = self.progress;
                const eased = easeFn(progress);

                const vw = window.innerWidth / 100;
                const vh = window.innerHeight / 100;
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const scrollX = window.scrollX || document.documentElement.scrollLeft;

                // Dynamically find viewport-relative position using fast O(1) math
                const logoCenterX = docLogoCenterX - scrollX;
                const logoCenterY = docLogoCenterY - scrollY;

                introSchedule.forEach(({ pieceIdx }) => {
                    const anchor = anchors[pieceIdx];
                    const body = bodies[pieceIdx];
                    const svg = anchor.querySelector('svg');
                    const glow = anchor.querySelector('.scroll-piece-glow');

                    const startX = startPositions[pieceIdx].x * vw;
                    const startY = startPositions[pieceIdx].y * vh;

                    const currentX = startX + (logoCenterX - startX) * eased;
                    const currentY = startY + (logoCenterY - startY) * eased;

                    let anchorOpacity = 1;
                    if (progress > 0.8) {
                        anchorOpacity = 1 - ((progress - 0.8) / 0.2);
                    }

                    anchor.style.position = 'fixed';
                    anchor.style.top = '0px';

                    gsap.set(anchor, {
                        x: currentX + 'px',
                        y: currentY + 'px',
                        scale: cachedDynamicScale,
                        opacity: anchorOpacity,
                        zIndex: progress > 0.8 ? -1 : 100
                    });

                    gsap.set(body, { rotateY: 0, rotateX: 0 });

                    if (glow) gsap.set(glow, { opacity: 0.5 * (1 - progress) });
                    if (svg) gsap.set(svg, { opacity: 0.85 + 0.15 * progress });
                });

                let logoOpacity = progress > 0.8 ? (progress - 0.8) / 0.2 : 0;
                gsap.set(reunitedFloat, { opacity: logoOpacity });

                const bounced = bounceFn(progress);
                gsap.set(logoEl, {
                    scale: 0.94 + 0.06 * bounced,
                    y: -64 + 40 * bounced
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
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.to('.scroll-orb--2', {
        y: '-40vh', x: '-20vw', scale: 0.8,
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.to('.scroll-orb--3', {
        y: '-80vh', x: '10vw', scale: 1.2, opacity: 0.7,
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
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
                start: 'bottom 30%',  // recession begins when bottom of hero reaches 60% viewport
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // ── Customers Section ──
    const customersSection = document.querySelector('.customers-section');
    if (customersSection) {
        gsap.from('.customers-title', {
            y: 30, opacity: 0,
            scrollTrigger: { trigger: customersSection, start: 'top 90%', end: 'top 55%', scrub: true }
        });
    }

    // ── Hero Section ("Step aside, YAML") — Layered parallax ──
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.from('.hero-badge', {
            y: 40, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 90%', end: 'top 50%', scrub: true }
        });
        gsap.from('.hero-title', {
            y: 80, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 88%', end: 'top 40%', scrub: true }
        });
        gsap.from('.hero-subtitle', {
            y: 100, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 85%', end: 'top 35%', scrub: true }
        });
        gsap.from('.hero-actions', {
            y: 60, opacity: 0,
            scrollTrigger: { trigger: heroSection, start: 'top 80%', end: 'top 35%', scrub: true }
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
            scrollTrigger: { trigger: heroSection, start: 'bottom 10%', end: 'bottom top', scrub: true }
        });
    }

    // ── Demo Section ──
    const demoSection = document.querySelector('.demo-section');
    if (demoSection) {
        gsap.from('.demo-header', {
            y: 50, opacity: 0,
            scrollTrigger: { trigger: demoSection, start: 'top 88%', end: 'top 50%', scrub: true }
        });

        const demoContainer = document.querySelector('.demo-container');
        if (demoContainer) {
            gsap.from(demoContainer, {
                scale: 0.88, opacity: 0, y: 60,
                scrollTrigger: { trigger: demoContainer, start: 'top 90%', end: 'top 35%', scrub: true }
            });
        }

        const personaCards = document.querySelectorAll('.persona-card');
        if (personaCards.length) {
            scrubEach(personaCards, { y: 60, opacity: 0, scale: 0.94 }, '.demo-personas', 90, 50, 5);
        }

        gsap.to(demoSection, {
            opacity: 0.5, y: -20,
            scrollTrigger: { trigger: demoSection, start: 'bottom 40%', end: 'bottom top', scrub: true }
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
                scrollTrigger: { trigger: ctaBox, start: 'top 90%', end: 'top 55%', scrub: true }
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
            scrollTrigger: { trigger: '.browser', start: 'top 90%', end: 'top 30%', scrub: true }
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
            scrollTrigger: { trigger: divider, start: 'top 90%', end: 'top 70%', scrub: true }
        });
    });
};

const initVideoHandler = () => {
    const wrapper = document.getElementById('video-wrapper');
    const btn = document.getElementById('play-button-trigger');

    if (btn && wrapper) {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video-id');
            wrapper.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
          allow="autoplay; encrypted-media" 
          allowfullscreen>
        </iframe>`;
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initMarquee();
    initVideoHandler();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animateCounters();
    }

    const header = document.querySelector(".site-header");
    if (header) {
        ScrollTrigger.create({
            start: "top -2",
            onEnter: () => header.classList.add("scrolled"),
            onLeaveBack: () => header.classList.remove("scrolled"),
        });
    }
});

window.addEventListener("load", () => {
    initScrollAnimations();
});

document.addEventListener("scroll", function () {
    const btn = document.getElementById("button-scroll-to-up");

    if (window.scrollY > 100) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
});

document.getElementById("button-scroll-to-up").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});