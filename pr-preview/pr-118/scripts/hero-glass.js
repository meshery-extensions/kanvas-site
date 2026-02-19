const root = document.documentElement;
const hero = document.querySelector(".hero");
const tiltTargets = document.querySelectorAll("[data-tilt]");
const floaters = document.querySelectorAll("[data-float]");

let frame;
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const updateScene = () => {
  root.style.setProperty("--cursor-x", `${pointer.x}px`);
  root.style.setProperty("--cursor-y", `${pointer.y}px`);

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const relX = (pointer.x - rect.left) / rect.width - 0.5;
    const relY = (pointer.y - rect.top) / rect.height - 0.5;
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
  if (!frame) {
    frame = requestAnimationFrame(updateScene);
  }
};

window.addEventListener("pointermove", handlePointer);
window.addEventListener("pointerdown", handlePointer);
window.addEventListener("pointerleave", () => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  updateScene();
});
window.addEventListener("resize", () => {
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  updateScene();
});

floaters.forEach((item, index) => {
  item.style.animationDelay = `${index * -2.5}s`;
});

updateScene();
