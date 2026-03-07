const root = document.documentElement;
const hero = document.querySelector("#hero");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const floaters = document.querySelectorAll("[data-float]");

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

const refreshHeroRect = () => {
  if (!hero || !heroInView) return;
  heroRect = hero.getBoundingClientRect();
  heroRectDirty = false;
};

const updateScene = () => {
  root.style.setProperty("--cursor-x", `${pointer.x}px`);
  root.style.setProperty("--cursor-y", `${pointer.y}px`);

  if (hero && heroInView) {
    if (heroRectDirty || !heroRect) {
      refreshHeroRect();
    }
    const relX = (pointer.x - heroRect.left) / heroRect.width - 0.5;
    const relY = (pointer.y - heroRect.top) / heroRect.height - 0.5;
    hero.style.setProperty("--tilt-x", `${(-relY * 7).toFixed(2)}deg`);
    hero.style.setProperty("--tilt-y", `${(relX * 9).toFixed(2)}deg`);
  }

  tiltTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    const relX = (pointer.x - rect.left) / rect.width - 0.5;
    const relY = (pointer.y - rect.top) / rect.height - 0.5;
    target.style.setProperty("--tilt-x", `${(-relY * 6).toFixed(2)}deg`);
    target.style.setProperty("--tilt-y", `${(relX * 6).toFixed(2)}deg`);
  });

  frame = null;
};

const handlePointer = (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  scheduleUpdateScene();
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
          hero.style.setProperty("--tilt-x", "0deg");
          hero.style.setProperty("--tilt-y", "0deg");
          heroRect = null;
        } else {
          heroRectDirty = true;
          scheduleUpdateScene();
        }
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(hero);
}

floaters.forEach((item, index) => {
  item.style.animationDelay = `${index * -2.5}s`;
});

updateScene();
