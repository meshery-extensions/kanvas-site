const root = document.documentElement;
const floaters = document.querySelectorAll("[data-float]");

// ── Cursor tracking for body background gradient ──
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

let bgFrame;
const scheduleBgUpdate = () => {
  if (!bgFrame) {
    bgFrame = requestAnimationFrame(() => {
      root.style.setProperty("--cursor-x", `${pointer.x}px`);
      root.style.setProperty("--cursor-y", `${pointer.y}px`);
      bgFrame = null;
    });
  }
};

window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  scheduleBgUpdate();
}, { passive: true });

window.addEventListener("pointerleave", () => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  scheduleBgUpdate();
});

// ── Kanvas Logo hover-only 3D tilt ──
const logo = document.querySelector(".pop-out-mascot");

if (logo && window.matchMedia("(min-width: 769px)").matches) {
  logo.addEventListener("mousemove", (e) => {
    const rect = logo.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    logo.style.setProperty("--logo-tilt-x", `${(-relY * 20).toFixed(2)}deg`);
    logo.style.setProperty("--logo-tilt-y", `${(relX * 20).toFixed(2)}deg`);
  });

  logo.addEventListener("mouseleave", () => {
    logo.style.setProperty("--logo-tilt-x", "0deg");
    logo.style.setProperty("--logo-tilt-y", "0deg");
  });
}

// ── Stagger float animations ──
floaters.forEach((item, index) => {
  item.style.animationDelay = `${index * -2.5}s`;
});
