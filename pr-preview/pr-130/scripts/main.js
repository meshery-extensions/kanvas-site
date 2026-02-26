// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Header Timeline
let tl = gsap.timeline({
    defaults: { ease: "power4.out" }
});

tl.from(".main-nav ul li a", { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
tl.from(".btn-secondary", { x: 100, opacity: 0, rotation: 360, duration: 0.8 }, "-=0.5");
tl.from(".btn-primary", { x: 100, opacity: 0, duration: 0.8 }, "<");

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

document.addEventListener("DOMContentLoaded", () => {
    animateCounters();
    initMarquee(); 
    const header = document.querySelector(".site-header");
    if (header) {
    ScrollTrigger.create({
        start: "top -2", // when scroll 2px
        onEnter: () => header.classList.add("scrolled"),
        onLeaveBack: () => header.classList.remove("scrolled"),
    });
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        tl.restart(); 
    }
});