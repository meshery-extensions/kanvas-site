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

            // Formatting logic
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

// 4. Scroll-Triggered Section Reveals (Stripe-inspired, CSS-driven)
const initSectionReveals = () => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Sections fade up via CSS class toggle
    const sections = document.querySelectorAll(
        '.customers-section, .hero-section, .demo-section, .capabilities-section, .community-section, .browser'
    );

    sections.forEach((section) => {
        section.classList.add('section-reveal');
        ScrollTrigger.create({
            trigger: section,
            start: "top 85%",
            once: true,
            onEnter: () => section.classList.add('is-visible'),
        });
    });

    // Stagger card children via CSS class toggle
    const grids = document.querySelectorAll(
        '.capabilities-grid, .community-grid, .demo-personas'
    );

    grids.forEach((grid) => {
        grid.classList.add('section-reveal-children');
        ScrollTrigger.create({
            trigger: grid,
            start: "top 80%",
            once: true,
            onEnter: () => grid.classList.add('is-visible'),
        });
    });

    // Stats counter trigger — only animate counters when hero section scrolls into view
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        ScrollTrigger.create({
            trigger: heroSection,
            start: "top 70%",
            once: true,
            onEnter: animateCounters,
        });
    }

    // Demo container reveal
    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer) {
        demoContainer.classList.add('section-reveal');
        ScrollTrigger.create({
            trigger: demoContainer,
            start: "top 80%",
            once: true,
            onEnter: () => demoContainer.classList.add('is-visible'),
        });
    }

    // Browser section reveal
    const browserShell = document.querySelector('.browser-shell');
    if (browserShell) {
        browserShell.classList.add('section-reveal');
        ScrollTrigger.create({
            trigger: browserShell,
            start: "top 80%",
            once: true,
            onEnter: () => browserShell.classList.add('is-visible'),
        });
    }
};

// 5. Section Dividers — inject gradient lines between sections
const initSectionDividers = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll(
        '.customers-section, .hero-section, .demo-section, .capabilities-section, .community-section'
    );

    sections.forEach((section) => {
        if (section.nextElementSibling && section.nextElementSibling.classList.contains('section-divider')) return;

        const divider = document.createElement('div');
        divider.className = 'section-divider';
        section.after(divider);

        ScrollTrigger.create({
            trigger: divider,
            start: "top 90%",
            once: true,
            onEnter: () => divider.classList.add('is-visible'),
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    initMarquee();
    initSectionDividers();
    initSectionReveals();

    const header = document.querySelector(".site-header");
    if (header) {
        ScrollTrigger.create({
            start: "top -2",
            onEnter: () => header.classList.add("scrolled"),
            onLeaveBack: () => header.classList.remove("scrolled"),
        });
    }
});

