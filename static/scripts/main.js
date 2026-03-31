gsap.registerPlugin(ScrollTrigger);

let tl = gsap.timeline({
    defaults: { ease: "power4.out" }
});

tl.from(".main-nav ul li a", { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
tl.from(".btn-secondary", { x: 20, opacity: 0, duration: 0.6 }, "-=0.5");
tl.from(".btn-primary", { x: 20, opacity: 0, duration: 0.6 }, "<");

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

const initScrollPieces = () => {
    document.querySelectorAll('.scroll-piece-anchor').forEach((node) => node.remove());

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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(browserScene, { y: 0, opacity: 1 });
        return;
    }

    const hideY = Math.min(Math.max(browserBody.offsetHeight * 0.55, 220), 480);

    gsap.fromTo(browserScene,
        { y: hideY, opacity: 0 },
        {
            y: 0, opacity: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: browserSection,
                start: 'top 90%',
                end: 'top 5%',
                scrub: 0.8,
            },
        }
    );
};

const initConvergingPieces = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const browser = document.querySelector('.browser');
    if (!browser) return;

    const vw = window.innerWidth;
    const scaleMult = vw < 480 ? 0.48 : vw < 768 ? 0.62 : vw < 1024 ? 0.80 : 1;

    const config = [
        { points: '362.54 42.38 362.54 253.13 545.2 147.38',   fill: '#00d3a9', depth: 'front', maxScale: 4.8, maxOpacity: 0.88, x0: '108vw', y0:  '8vh', yMid:  '2vh', xE: '54vw', yE: '30vh', rotY:  38, rotX: -10, initScale: 1.10, scrub: 1.8, fadeDelay:   0 },
        { points: '362.54 297.22 362.54 508.98 546.87 403.59', fill: '#00d3a9', depth: 'front', maxScale: 4.4, maxOpacity: 0.84, x0: '112vw', y0: '58vh', yMid: '65vh', xE: '56vw', yE: '62vh', rotY: -32, rotX:  14, initScale: 0.85, scrub: 2.3, fadeDelay:  80 },
        { points: '559.39 380.45 559.39 169.55 376.95 275.18', fill: '#00b39f', depth: 'back',  maxScale: 3.0, maxOpacity: 0.55, x0: '110vw', y0: '34vh', yMid: '28vh', xE: '52vw', yE: '46vh', rotY:  42, rotX:  -8, initScale: 1.25, scrub: 1.5, fadeDelay: 160 },
        { points: '336.24 251.68 336.24 44.16 155.82 147.58',  fill: '#00b39f', depth: 'mid',   maxScale: 3.8, maxOpacity: 0.74, x0: '-12vw', y0: '44vh', yMid: '50vh', xE: '44vw', yE: '20vh', rotY: -40, rotX:  10, initScale: 0.90, scrub: 2.0, fadeDelay:  40 },
        { points: '336.24 508 336.24 298.75 155.38 403.45',    fill: '#00b39f', depth: 'mid',   maxScale: 4.0, maxOpacity: 0.76, x0: '-10vw', y0: '16vh', yMid: '10vh', xE: '46vw', yE: '50vh', rotY:  34, rotX: -14, initScale: 1.15, scrub: 1.7, fadeDelay: 120 },
        { points: '140.61 169.16 140.61 381.62 324.4 275.21',  fill: '#00d3a9', depth: 'back',  maxScale: 2.8, maxOpacity: 0.52, x0: '-14vw', y0: '76vh', yMid: '83vh', xE: '45vw', yE: '76vh', rotY: -36, rotX:   9, initScale: 0.80, scrub: 2.4, fadeDelay: 200 },
    ];

    const journeyEnd = Math.max(browser.offsetTop - window.innerHeight * 0.4, window.innerHeight);

    config.forEach((c, i) => {
        if (c.depth === 'back' && vw < 600) return;

        const anchor = document.createElement('div');
        anchor.className = 'scroll-piece-anchor';
        anchor.innerHTML =
            '<div class="scroll-piece-stage">' +
                '<div class="scroll-piece-body scroll-piece-body--depth-' + c.depth + '">' +
                    '<svg viewBox="130 30 440 490" xmlns="http://www.w3.org/2000/svg">' +
                        '<polygon points="' + c.points + '" fill="' + c.fill + '"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="scroll-piece-glow"></div>' +
            '</div>';
        document.body.appendChild(anchor);

        const body = anchor.querySelector('.scroll-piece-body');
        const glow = anchor.querySelector('.scroll-piece-glow');

        gsap.set(anchor, { x: c.x0, y: c.y0, scale: c.initScale * scaleMult, opacity: 0 });
        gsap.set(body,   { rotateY: c.rotY, rotateX: c.rotX });

        gsap.to(anchor, {
            opacity: c.maxOpacity,
            scrollTrigger: { start: 60 + i * 100, end: 230 + i * 100, scrub: 1 },
        });

        const tl = gsap.timeline({
            scrollTrigger: { start: 80, end: journeyEnd, scrub: c.scrub },
        });
        tl.to(anchor, { x: c.xE, ease: 'power1.out', duration: 1 }, 0);
        tl.to(anchor, { y: c.yMid, ease: 'sine.in',  duration: 0.4 }, 0);
        tl.to(anchor, { y: c.yE,   ease: 'sine.out', duration: 0.6 }, 0.4);
        tl.to(anchor, { scale: c.maxScale * scaleMult, ease: 'power1.inOut', duration: 1 }, 0);
        tl.to(body,   { rotateY: 0, rotateX: 0, ease: 'power1.inOut', duration: 1 }, 0);
        if (glow) tl.to(glow, { opacity: 1, ease: 'power1.in', duration: 1 }, 0);

        gsap.fromTo(anchor,
            { opacity: c.maxOpacity },
            {
                opacity: 0,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                    trigger: browser,
                    start: 'top 95%',
                    end: 'top 65%',
                    scrub: 0.6,
                },
            }
        );
    });
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
                start: 'bottom 30%',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }

    const customersSection = document.querySelector('.customers-section');
    if (customersSection) {
        gsap.from('.customers-title', {
            y: 30, opacity: 0,
            scrollTrigger: { trigger: customersSection, start: 'top 90%', end: 'top 55%', scrub: 1 }
        });
    }

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

        gsap.to(heroSection, {
            opacity: 0.4, y: -30,
            scrollTrigger: { trigger: heroSection, start: 'bottom 10%', end: 'bottom top', scrub: 1 }
        });
    }

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
        initConvergingPieces();
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