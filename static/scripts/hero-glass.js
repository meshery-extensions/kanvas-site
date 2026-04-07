(() => {
  "use strict";

  const root = document.documentElement;
  const hero = document.querySelector("#hero");
  const tiltTargets = document.querySelectorAll("[data-tilt]");
  const floaters = document.querySelectorAll("[data-float]");

  const state = {
    pointer: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    },
    visibleTargets: new Set(),
    rectCache: new Map(),
    frame: null,
    isDirty: true
  };

  /**
   * Intersection Observer
   * Tracks elements that are visible.
   */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        state.visibleTargets.add(entry.target);
        state.isDirty = true;
      } else {
        state.visibleTargets.delete(entry.target);
        state.rectCache.delete(entry.target);

        entry.target.style.setProperty("--tilt-x", "0deg");
        entry.target.style.setProperty("--tilt-y", "0deg");
      }

    });
  }, { threshold: 0.1 });

  if (hero) observer.observe(hero);
  tiltTargets.forEach(el => observer.observe(el));

  /**
   * Resize Observer
   * Marks layout as dirty only when elements actually resize.
   */
  const resizeObserver = new ResizeObserver(() => {
    state.isDirty = true;
  });

  if (hero) resizeObserver.observe(hero);
  tiltTargets.forEach(el => resizeObserver.observe(el));

  /**
   * GPU hint for smoother animations
   */
  tiltTargets.forEach(el => {
    el.style.willChange = "transform";
  });

  /**
   * Measurement Phase (Read)
   */
  const refreshRects = () => {
    state.visibleTargets.forEach(el => {
      state.rectCache.set(el, el.getBoundingClientRect());
    });

    state.isDirty = false;
  };

  /**
   * Render Phase (Write)
   */
  const updateScene = () => {
    root.style.setProperty("--cursor-x", `${state.pointer.x}px`);
    root.style.setProperty("--cursor-y", `${state.pointer.y}px`);

    if (state.visibleTargets.size === 0) {
      state.frame = null;
      return;
    }
    
    if (state.isDirty) refreshRects();

    state.visibleTargets.forEach((el) => {

      const rect = state.rectCache.get(el);
      if (!rect) return;

      const relX = (state.pointer.x - rect.left) / rect.width - 0.5;
      const relY = (state.pointer.y - rect.top) / rect.height - 0.5;

      const intensity = el === hero ? 10 : 6;

      const tiltX = Math.round(-relY * intensity * 100) / 100;
      const tiltY = Math.round(relX * intensity * 100) / 100;

      el.style.setProperty("--tilt-x", `${tiltX}deg`);
      el.style.setProperty("--tilt-y", `${tiltY}deg`);
    });

    state.frame = null;
  };

  const scheduleUpdate = () => {
    if (!state.frame) {
      state.frame = requestAnimationFrame(updateScene);
    }
  };

  /**
   * Pointer Movement
   */
  window.addEventListener("pointermove", (e) => {

    if (
      e.clientX === state.pointer.x &&
      e.clientY === state.pointer.y
    ) return;

    state.pointer.x = e.clientX;
    state.pointer.y = e.clientY;

    scheduleUpdate();

  }, { passive: true });

  /**
   * Touch / pointer down responsiveness
   */
  window.addEventListener("pointerdown", (e) => {
    state.pointer.x = e.clientX;
    state.pointer.y = e.clientY;
    scheduleUpdate();
  }, { passive: true });

  /**
   * Reset pointer when leaving window
   */
  window.addEventListener("pointerleave", () => {
    state.pointer.x = window.innerWidth / 2;
    state.pointer.y = window.innerHeight / 2;
    scheduleUpdate();
  });

  /**
   * Scroll Throttling
   */
  let scrollTick = false;

  window.addEventListener("scroll", () => {

    if (!scrollTick) {
      scrollTick = true;

      requestAnimationFrame(() => {
        state.isDirty = true;
        scrollTick = false;
      });
    }

  }, { passive: true });

  /**
   * Floater Animation Delays
   */
  floaters.forEach((item, index) => {
    item.style.animationDelay = `${index * -0.5}s`;
  });

  /**
   * Initial Run
   */
  updateScene();

})();