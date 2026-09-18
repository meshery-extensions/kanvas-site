const root = document.documentElement;
const hero = document.querySelector("#hero");
const floaters = document.querySelectorAll("[data-float]");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let frame;
let heroInView = true;
let heroRect = null;
let heroRectDirty = true;
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const scheduleUpdateScene = () => {
  if (!frame) {
    frame = requestAnimationFrame(updateScene);
  }
};

const updateTilt = (target, tiltX, tiltY) => {
  target.style.setProperty("--tilt-x", `${tiltX}deg`);
  target.style.setProperty("--tilt-y", `${tiltY}deg`);
};

const refreshHeroRect = () => {
  if (!hero || !heroInView) return;
  heroRect = hero.getBoundingClientRect();
  heroRectDirty = false;
};

const updateScene = () => {
  if (reducedMotionQuery.matches) {
    if (hero) updateTilt(hero, 0, 0);
    frame = null;
    return;
  }

  if (!hero || !heroInView) {
    frame = null;
    return;
  }
  
  if (heroRectDirty || !heroRect) {
    refreshHeroRect();
  }
  const relX = (pointer.x - heroRect.left) / heroRect.width - 0.5;
  const relY = (pointer.y - heroRect.top) / heroRect.height - 0.5;
  const clampedX = Math.max(-0.5, Math.min(0.5, relX));
  const clampedY = Math.max(-0.5, Math.min(0.5, relY));
  updateTilt(hero, -clampedY * 7, clampedX * 9);

  frame = null;
};

const handlePointer = (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  heroInView && scheduleUpdateScene();
};

window.addEventListener("pointermove", handlePointer, { passive: true });
window.addEventListener("pointerdown", handlePointer, { passive: true });
window.addEventListener("pointerleave", () => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  scheduleUpdateScene();
});
window.addEventListener("resize", () => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  heroRectDirty = true;
  scheduleUpdateScene();
}, { passive: true });
window.addEventListener("scroll", () => {
  heroRectDirty = true;
}, { passive: true });

if (hero) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroInView = entry.isIntersecting;
        if (!heroInView) {
          updateTilt(hero, 0, 0);
          heroRect = null;
        } else {
          heroRectDirty = true;
        }
        scheduleUpdateScene();
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(hero);
}
floaters.forEach((item, index) => {
  item.style.animationDelay = `${index * -2.5}s`;
});

