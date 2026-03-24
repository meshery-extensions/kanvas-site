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

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let startTime = null;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / speed, 1);
            const currentValue = Math.floor(percentage * target);
            const formattedCurrent = formatCounterValue(currentValue);
            const formattedTarget = formatCounterValue(target);

            if (target === 10) {
                counter.innerText = formattedCurrent + "M+";
            } else {
                counter.innerText = formattedCurrent + "+";
            }

            if (progress < speed) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = formattedTarget + (target === 10 ? "M+" : "+");
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

// ── 5. Browser scene — assembled logo + CTA rise from below (CodeWiki-style) ──
const initScrollPieces = () => {
    document.querySelectorAll('.scroll-piece-anchor').forEach((node) => node.remove());

    // Populate the reunited logo SVGs in the browser scene
    const pieces = [
        { points: '362.54 42.38 362.54 253.13 545.2 147.38',   fill: '#00d3a9' },
        { points: '362.54 297.22 362.54 508.98 546.87 403.59', fill: '#00d3a9' },
        { points: '336.24 251.68 336.24 44.16 155.82 147.58',  fill: '#00b39f' },
        { points: '336.24 508 336.24 298.75 155.38 403.45',    fill: '#00b39f' },
        { points: '559.39 380.45 559.39 169.55 376.95 275.18', fill: '#00b39f' },
        { points: '140.61 169.16 140.61 381.62 324.4 275.21',  fill: '#00d3a9' },
    ];

    const reunitedInner = document.getElementById('reunitedLogoInner');
    if (!reunitedInner) return;

    if (!reunitedInner.querySelector('img')) {
        reunitedInner.innerHTML = '<img src="/brand/kanvas/icon-only/kanvas-icon-color.svg" alt="Kanvas Logo">';
    }
};

const initBrowserReveal = () => {
    const browserSection = document.querySelector('.browser');
    if (!browserSection) return;

    const browserBody = browserSection.querySelector('.browser-body');
    const browserScene = browserSection.querySelector('.browser-scene-wrap') || browserSection.querySelector('.browser-scene');
    if (!browserBody || !browserScene) return;

    gsap.set(browserScene, { xPercent: -50, yPercent: -50, visibility: 'visible' });
    const getHideY = () => Math.min(Math.max(browserBody.offsetHeight * 0.55, 220), 480);

    const setVisible = () => gsap.set(browserScene, { y: 0, opacity: 1, visibility: 'visible' });
    const setHidden = () => gsap.set(browserScene, { y: getHideY(), opacity: 0, visibility: 'visible' });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setVisible();
        return;
    }

    if (typeof ScrollTrigger === 'undefined' || !ScrollTrigger || !gsap || !gsap.to) {
        setVisible();
        return;
    }

    if (window.__browserRevealST) {
        window.__browserRevealST.kill();
        window.__browserRevealST = null;
    }

    const isAboveTrigger = () => browserBody.getBoundingClientRect().top > window.innerHeight * 0.78;
    let isVisibleState = !isAboveTrigger();
    if (isVisibleState) setVisible();
    else setHidden();

    const revealTween = gsap.to(browserScene, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        paused: true
    });

    const revealST = ScrollTrigger.create({
        trigger: browserBody,
        start: 'top 78%',
        end: 'top 38%',
        onEnter: () => {
            if (isVisibleState) return;
            setHidden();
            revealTween.restart();
            isVisibleState = true;
        },
        onEnterBack: () => {
            if (isVisibleState) return;
            setHidden();
            revealTween.restart();
            isVisibleState = true;
        },
        onLeaveBack: () => {
            revealTween.pause(0);
            setHidden();
            isVisibleState = false;
        },
        onRefresh: () => {
            if (isAboveTrigger()) {
                revealTween.pause(0);
                setHidden();
                isVisibleState = false;
            } else {
                revealTween.pause(1);
                setVisible();
                isVisibleState = true;
            }
        }
    });

    window.__browserRevealST = revealST;

    const syncVisibilityState = () => {
        if (isAboveTrigger()) {
            revealTween.pause(0);
            setHidden();
            isVisibleState = false;
        } else {
            revealTween.pause(1);
            setVisible();
            isVisibleState = true;
        }
    };

    syncVisibilityState();
};

const initScrollAnimations = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!document.querySelector('.browser, #browserScene')) return;

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
    // Keep stand static: no scroll animation on browser base.

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
    if (document.querySelector('.browser, #browserScene')) {
        initScrollPieces();
        initBrowserReveal();
        initScrollAnimations();
    }
    initVideoHandler();

    const header = document.querySelector(".site-header");
    if (header) {
        ScrollTrigger.create({
            start: "top -2",
            onEnter: () => header.classList.add("scrolled"),
            onLeaveBack: () => header.classList.remove("scrolled"),
        });
    }
});
