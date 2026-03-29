const THREE = window.THREE;

const TECH_LOGOS = window.TECH_LOGOS || [];
const SIMPLE_ICONS = window.SIMPLE_ICONS || [];
const CENTER_ICON_SVG = window.CENTER_ICON_SVG || "";

async function createIconTexture(svgString, isCenter = false) {

  const size = isCenter ? 256 : 128;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(6,12,12,0.9)";
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "#5FCDB8";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, size - 4, size - 4);

  return new Promise((resolve) => {

    if (!svgString) {
      const texture = new THREE.CanvasTexture(canvas);
      resolve(texture);
      return;
    }

    const img = new Image();

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {

      const padding = isCenter ? 40 : 20;
      const drawSize = size - padding * 2;

      ctx.drawImage(img, padding, padding, drawSize, drawSize);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      URL.revokeObjectURL(url);

      resolve(texture);
    };

    img.src = url;

  });
}

async function initCubeScene(containerId) {

  console.log("🚀 Initializing cube scene:", containerId);

  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  const canvas = container.querySelector("canvas");

  const scene = new THREE.Scene();

  const width = container.clientWidth || 800;
  const height = 600;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 2, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  console.log("Logos loaded:", TECH_LOGOS.length);

  // CENTER CUBE

  const centerTex = await createIconTexture(CENTER_ICON_SVG, true);

  const centerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const centerMat = new THREE.MeshBasicMaterial({
    map: centerTex,
    transparent: true
  });

  const centerCube = new THREE.Mesh(centerGeo, centerMat);
  scene.add(centerCube);

  // ORBITING CUBES

  const orbiters = [];

  for (let i = 0; i < 12; i++) {

    const logoIndex = TECH_LOGOS.length ? i % TECH_LOGOS.length : 0;
    const tex = await createIconTexture(TECH_LOGOS[logoIndex]);

    const geo = new THREE.BoxGeometry(0.7, 0.7, 0.7);

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true
    });

    const cube = new THREE.Mesh(geo, mat);

    scene.add(cube);

    orbiters.push({
      cube,
      angle: (i / 12) * Math.PI * 2,
      radius: 3 + (i % 3) * 0.5,
      speed: 0.3
    });
  }

  const clock = new THREE.Clock();

  function animate() {

    const t = clock.getElapsedTime();

    centerCube.rotation.y = t * 0.3;

    orbiters.forEach((o) => {

      const a = o.angle + t * o.speed;

      o.cube.position.x = Math.cos(a) * o.radius;
      o.cube.position.z = Math.sin(a) * o.radius;
      o.cube.position.y = Math.sin(t) * 0.5;

      o.cube.rotation.x += 0.01;
      o.cube.rotation.y += 0.01;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  animate();
}

// expose globally
window.initCubeScene = initCubeScene;