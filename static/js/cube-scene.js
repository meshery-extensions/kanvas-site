  import * as THREE from 'three';
  import { TECH_LOGOS, SIMPLE_ICONS, CENTER_ICON_SVG, KEPPEL_PRIMARY, KEPPEL_LIGHT, KEPPEL_GLOW, BACKGROUND_COLOR } from './tech-logos.js';

  // Create texture from SVG with dark transparent background
  function createIconTexture(svgString, isCenter = false) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const size = isCenter ? 256 : 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Dark semi-transparent background with slight teal tint
      ctx.fillStyle = isCenter ? 'rgba(10, 30, 28, 0.85)' : 'rgba(8, 25, 23, 0.8)';
      ctx.fillRect(0, 0, size, size);

      // Border glow effect in Keppel colors
      const glowColor = isCenter ? 'rgba(58, 176, 158, 0.8)' : 'rgba(95, 205, 184, 0.7)';
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = isCenter ? 3 : 2;
      ctx.strokeRect(2, 2, size - 4, size - 4);

      if (!svgString) {
        resolve(new THREE.CanvasTexture(canvas));
        return;
      }

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      const padding = isCenter ? 48 : 24;
      const iconSize = size - padding * 2;

      img.onload = () => {
        ctx.drawImage(img, padding, padding, iconSize, iconSize);
        URL.revokeObjectURL(url);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        resolve(texture);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        resolve(texture);
      };

      img.src = url;
    });
  }

  // Generate logo distribution ensuring no logo repeats more than 2 times
  function generateLogoDistribution(cubeCount) {
    const logoUsage = new Map();
    const configs = [];

    for (let i = 0; i < cubeCount; i++) {
      const oppositeIcon = i % SIMPLE_ICONS.length;

      const sideLogos = [];
      const availableLogos = Array.from({ length: TECH_LOGOS.length }, (_, idx) => idx)
        .filter(idx => (logoUsage.get(idx) || 0) < 2);

      // Shuffle available logos
      for (let j = availableLogos.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [availableLogos[j], availableLogos[k]] = [availableLogos[k], availableLogos[j]];
      }

      // Pick 4 logos
      for (let j = 0; j < 4 && j < availableLogos.length; j++) {
        const logoIdx = availableLogos[j];
        sideLogos.push(logoIdx);
        logoUsage.set(logoIdx, (logoUsage.get(logoIdx) || 0) + 1);
      }

      // Fallback if not enough logos
      while (sideLogos.length < 4) {
        const fallbackIdx = (i * 4 + sideLogos.length) % TECH_LOGOS.length;
        sideLogos.push(fallbackIdx);
      }

      configs.push({ oppositeIcon, sideLogos });
    }

    return configs;
  }

  // Create edge lines for a cube
  function createEdges(mesh, color, linewidth = 1) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: color, linewidth: linewidth })
    );
    return line;
  }

  // Create central cube with inner cube and glow
  async function createCentralCube(scene) {
    const group = new THREE.Group();

    // Create textures for center cube
    const centerTextures = await Promise.all(
      Array(6).fill(null).map(() => createIconTexture(CENTER_ICON_SVG, true))
    );

    const centerMaterials = centerTextures.map(texture =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      })
    );

    // Outer cube with icons
    const outerGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const outerCube = new THREE.Mesh(outerGeometry, centerMaterials);
    group.add(outerCube);

    // Edges for outer cube
    const outerEdges = createEdges(outerCube, KEPPEL_PRIMARY, 2);
    group.add(outerEdges);

    // Inner cube
    const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.1,
      color: KEPPEL_GLOW
    });
    const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(innerCube);

    // Edges for inner cube
    const innerEdges = createEdges(innerCube, KEPPEL_GLOW, 1.5);
    group.add(innerEdges);

    // Core glow sphere
    const coreGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: KEPPEL_LIGHT,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    // Point light at center
    const pointLight = new THREE.PointLight(KEPPEL_PRIMARY, 2, 10);
    group.add(pointLight);

    scene.add(group);

    return { group, outerCube, innerCube, outerEdges, innerEdges };
  }

  // Create orbiting cube
  async function createOrbitingCube(faceConfig, size) {
    const group = new THREE.Group();

    // Three.js box face order: right(+X), left(-X), top(+Y), bottom(-Y), front(+Z), back(-Z)
    const oppositeIconSvg = SIMPLE_ICONS[faceConfig.oppositeIcon];
    const [rightLogo, leftLogo, topLogo, bottomLogo] = faceConfig.sideLogos.map(
      idx => TECH_LOGOS[idx]
    );

    const textures = await Promise.all([
      createIconTexture(rightLogo),      // Index 0: Right
      createIconTexture(leftLogo),       // Index 1: Left
      createIconTexture(topLogo),        // Index 2: Top
      createIconTexture(bottomLogo),     // Index 3: Bottom
      createIconTexture(oppositeIconSvg), // Index 4: Front
      createIconTexture(oppositeIconSvg), // Index 5: Back (same as front)
    ]);

    const materials = textures.map(texture =>
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      })
    );

    const geometry = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(geometry, materials);
    group.add(cube);

    // Edges
    const edges = createEdges(cube, KEPPEL_PRIMARY, 1);
    group.add(edges);

    // Small glow light
    const light = new THREE.PointLight(KEPPEL_LIGHT, 0.3, 3);
    group.add(light);

    return { group, cube, edges };
  }

  // Create connection lines
  function createConnectionLines(scene, orbitingPositions) {
    const lines = [];

    orbitingPositions.forEach(() => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array([0, 0, 0, 0, 0, 0]);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: KEPPEL_PRIMARY,
        transparent: true,
        opacity: 0.5
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);
      lines.push(line);
    });

    return lines;
  }

  // Create ambient glow sphere
  function createAmbientGlow(scene) {
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: BACKGROUND_COLOR,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(geometry, material);
    scene.add(glow);
    return glow;
  }

  export default async function initCubeScene(id) {
    const root = document.getElementById(id);
    if (!root) {
      console.error('Cube scene container not found:', id);
      return;
    }

    const canvas = root.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas not found in cube scene container');
      return;
    }

    const width = root.clientWidth || root.offsetWidth || 800;
    const height = root.clientHeight || root.offsetHeight || 520;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera - positioned like React version
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060c0c, 0);

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    // Create central cube
    const centralCube = await createCentralCube(scene);

    // Generate logo distribution
    const logoDistribution = generateLogoDistribution(12);

    // Create orbiting positions
    const orbitingPositions = Array.from({ length: 12 }, (_, i) => ({
      radius: 3.5 + (i % 3) * 0.4,
      speed: 0.3 + (i % 4) * 0.1,
      offset: (i / 12) * Math.PI * 2,
      vertical: 0.5 + (i % 2) * 0.5,
      size: 0.6 + Math.random() * 0.15
    }));

    // Create connection lines
    const connectionLines = createConnectionLines(scene, orbitingPositions);

    // Create orbiting cubes
    const orbitingCubes = await Promise.all(
      orbitingPositions.map((pos, i) =>
        createOrbitingCube(logoDistribution[i], pos.size)
      )
    );

    // Add orbiting cubes to scene
    orbitingCubes.forEach(cube => scene.add(cube.group));

    // Create ambient glow
    createAmbientGlow(scene);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      const t = clock.getElapsedTime();

      // Rotate central cube
      centralCube.outerCube.rotation.y += 0.005;
      centralCube.outerCube.rotation.x += 0.002;
      centralCube.outerEdges.rotation.copy(centralCube.outerCube.rotation);

      centralCube.innerCube.rotation.y -= 0.01;
      centralCube.innerCube.rotation.z += 0.008;
      centralCube.innerEdges.rotation.copy(centralCube.innerCube.rotation);

      // Update orbiting cubes
      orbitingCubes.forEach((cube, i) => {
        const pos = orbitingPositions[i];
        const time = t * pos.speed + pos.offset;

        // Update position
        cube.group.position.x = Math.cos(time) * pos.radius;
        cube.group.position.z = Math.sin(time) * pos.radius;
        cube.group.position.y = Math.sin(time * 0.5) * pos.vertical;

        // Rotate cube
        cube.cube.rotation.y += 0.015;
        cube.cube.rotation.x += 0.008;
        cube.edges.rotation.copy(cube.cube.rotation);

        // Update connection line
        const linePositions = connectionLines[i].geometry.attributes.position;
        linePositions.setXYZ(0, 0, 0, 0);
        linePositions.setXYZ(1, cube.group.position.x, cube.group.position.y, cube.group.position.z);
        linePositions.needsUpdate = true;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const newWidth = root.clientWidth || root.offsetWidth;
      const newHeight = root.clientHeight || root.offsetHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  }