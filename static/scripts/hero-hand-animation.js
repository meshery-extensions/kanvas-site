document.addEventListener("DOMContentLoaded", function () {
  const scrollTrack = document.querySelector(".hero-scroll-track");
  const leftHand = document.getElementById("left-hand");
  const rightHand = document.getElementById("right-hand");
  const dashboard = document.getElementById("dashboard-preview");
  const heroContent = document.querySelector(".hero-content");
  const line = document.querySelector(".hover-line");
  const wrapperHeight = 46; 
  const lineHeight = 5;
  const imageWrapper = document.querySelector(".header-image-wrapper");
  

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function handleScroll() {

    const rect = scrollTrack.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = -rect.top / (rect.height - windowHeight);
    progress = Math.max(0, Math.min(1, progress));

    // -------------------------
    // PHASE 1: HANDS TOGETHER
    // -------------------------
    if (progress <= 0.4) {
      const p = progress / 0.4;

      const leftX = lerp(0, 121, p);
      const leftY = lerp(0, 178, p);
      const leftR = lerp(0, -5, p);

      const rightX = lerp(0, -250, p);
      const rightY = lerp(0, -250, p);
      const rightR = lerp(0, 5, p);

      leftHand.style.transform =
        `translate3d(${leftX}px, ${leftY}px, 0) rotateZ(${leftR}deg)`;

      rightHand.style.transform =
        `translate3d(${rightX}px, ${rightY}px, 0) rotateZ(${rightR}deg)`;
    }

    // -------------------------
    // PHASE 2: HANDS OPEN
    // -------------------------
    else if (progress <= 0.75) {
      const p = (progress - 0.4) / 0.35;

      const leftX = lerp(121, 29, p);
      const leftY = lerp(178, 51, p);
      const leftR = lerp(-5, -10, p);

      const rightX = lerp(-250, -53, p);
      const rightY = lerp(-250, -12, p);
      const rightR = lerp(5, 12, p);

      leftHand.style.transform =
        `translate3d(${leftX}px, ${leftY}px, 0) rotateZ(${leftR}deg)`;

      rightHand.style.transform =
        `translate3d(${rightX}px, ${rightY}px, 0) rotateZ(${rightR}deg)`;
    }

    // -------------------------
    // HERO CONTENT DISAPPEAR
    // -------------------------
    const fadeStart = 0.2;
    const fadeEnd = 0.4;

    let p = (progress - fadeStart) / (fadeEnd - fadeStart);
    p = Math.max(0, Math.min(1, p));

    const moveX = lerp(0, -50, p);
    const moveY = lerp(0, -50, p);
    const scale = lerp(1, 0.2, p);
    const rotate = lerp(0, -32, p);
    const opacity = lerp(1, 0, p);

    heroContent.style.opacity = opacity;
    heroContent.style.transform = `
      translate3d(${moveX}px, ${moveY}px, 0)
      scale3d(${scale}, ${scale}, 1)
      rotateZ(${rotate}deg)
    `;


  // -------------------------
  // CUBE REVEAL
  // -------------------------
  const revealStart = 0.6;
  const revealEnd = 0.88;

  let cubeProgress = (progress - revealStart) / (revealEnd - revealStart);
  cubeProgress = Math.max(0, Math.min(1, cubeProgress));

  const cubeX = lerp(-63.4735, -9, cubeProgress);
  const cubeY = lerp(-36.519, 27, cubeProgress);
  const cubeScale = lerp(0.48695, 1, cubeProgress);
  const cubeOpacity = lerp(0, 1, cubeProgress);

  imageWrapper.style.opacity = cubeOpacity;
  imageWrapper.style.transform = `
    translate3d(${cubeX}px, ${cubeY}px, 0)
    scale3d(${cubeScale}, ${cubeScale}, 1)
    rotateZ(0deg)
  `;
  }

  // -------------------------
  // SCROLL DOWN
  // -------------------------
  let position = -lineHeight;

  function animate() {
    position += 0.5; // speed (increase for faster)

    if (position > wrapperHeight) {
      position = -lineHeight; // reset to top
    }

    line.style.transform = `translate3d(0px, ${position}px, 0px)`;

    requestAnimationFrame(animate);
  }

  animate();
  
  window.addEventListener("scroll", handleScroll);
});
