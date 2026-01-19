// 1. Setup the GSAP Timeline
let tl = gsap.timeline({
    defaults: { ease: "power4.out" }
});

// Header animation
tl.from(".main-nav ul li a", { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
tl.from(".btn-secondary", { x: 100, opacity: 0, rotation: 360, duration: 0.8 }, "-=0.5");
tl.from(".btn-primary", { x: 100, opacity: 0, duration: 0.8 }, "<");

gsap.registerPlugin(ScrollTrigger);

// gsap.from(".mode-card", {
//   scrollTrigger: {
//     trigger: ".modes-grid",
//     start: "top 80%", // Starts when the grid is 80% down the screen
//   },
//   y: 100,
//   opacity: 0,
//   duration: 1,
//   stagger: 0.2,
//   ease: "power4.out"
// });

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

            // Logic to match your 380+, 1000+, 10M+ requirements
            if (target === 10) {
                counter.innerText = currentValue + "M+";
            } else {
                counter.innerText = currentValue + "+";
            }

            if (progress < speed) {
                requestAnimationFrame(updateCount);
            } else {
                // Ensure it ends on the exact target
                counter.innerText = target + (target === 10 ? "M+" : "+");
            }
        };
        requestAnimationFrame(updateCount);
    });
};

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        tl.restart(); 
        animateCounters(); 
    }
});

document.addEventListener("DOMContentLoaded", () => {
    animateCounters();
});