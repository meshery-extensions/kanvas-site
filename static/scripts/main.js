// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Header Timeline
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top 80%",
    toggleActions: "play none none none",
    invalidateOnRefresh: true
  },
  defaults: {
    ease: "expo.out",
    duration: 1.1
  }
});

tl.set(".all-feature-card", {
  opacity: 0
})

tl.fromTo(".all-feature-card.left-card",
  { opacity: 0, x: 80 },
  { opacity: 1, x: 0, stagger: 0.2 }
)

.fromTo(".all-feature-card.right-card",
  { opacity: 0, x: -80 },
  { opacity: 1, x: 0, stagger: 0.2 },
  "-=0.6"
)

.fromTo(".all-feature-card.middle-card",
  { opacity: 0, y: -60 },
  { opacity: 1, y: 0, stagger: 0.2 },
  "-=0.6"
);

// tl.to(".all-feature-card.left-card", { opacity: 0, x: -50, duration: 1, stagger: 0.2 });
// tl.to(".all-feature-card.middle-card", { opacity: 0, y: 0, duration: 1, stagger: 0.2 });
// tl.to(".all-feature-card.right-card", { opacity: 0, x: 0, duration: 1, stagger: 0.2 });
// tl.from(".main-nav ul li a", { opacity: 0, y: -50, duration: 1, stagger: 0.2 });
// tl.from(".btn-secondary", { x: 100, opacity: 0, rotation: 360, duration: 0.8 }, "-=0.5");
// tl.from(".btn-primary", { x: 100, opacity: 0, duration: 0.8 }, "<");

// 2. Optimized Counter Animation
// const animateCounters = () => {
//     const counters = document.querySelectorAll('.counter');
//     const speed = 2000; 

//     counters.forEach(counter => {
//         const target = +counter.getAttribute('data-target');
//         let startTime = null;

//         const updateCount = (timestamp) => {
//             if (!startTime) startTime = timestamp;
//             const progress = timestamp - startTime;
//             const percentage = Math.min(progress / speed, 1);
//             const currentValue = Math.floor(percentage * target);

//             // Formatting logic
//             if (target === 10) {
//                 counter.innerText = currentValue + "M+";
//             } else {
//                 counter.innerText = currentValue + "+";
//             }

//             if (progress < speed) {
//                 requestAnimationFrame(updateCount);
//             } else {
//                 counter.innerText = target + (target === 10 ? "M+" : "+");
//             }
//         };
//         requestAnimationFrame(updateCount);
//     });
// };

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

// document.addEventListener("visibilitychange", () => {
//     if (document.visibilityState === "visible") {
//         tl.restart(); 
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
  const stats = [
    { number: "380+", label: "Integration" },
    { number: "1000+", label: "Contributors" },
    { number: "10M+", label: "Downloads" }
  ];

  const numberEl = document.getElementById("statNumber");
  const labelEl = document.getElementById("statLabel");

  let current = 0;

  function changeStat() {

    // animate out
    numberEl.classList.add("stat-animate-out");
    labelEl.classList.add("stat-animate-out");

    setTimeout(() => {

      // change content
      current = (current + 1) % stats.length;
      numberEl.textContent = stats[current].number;
      labelEl.textContent = stats[current].label;

      // remove old animation
      numberEl.classList.remove("stat-animate-out");
      labelEl.classList.remove("stat-animate-out");

      // animate in
      numberEl.classList.add("stat-animate-in");
      labelEl.classList.add("stat-animate-in");

      setTimeout(() => {
        numberEl.classList.remove("stat-animate-in");
        labelEl.classList.remove("stat-animate-in");
      }, 600);

    }, 400);
  }

  setInterval(changeStat, 3000);

});