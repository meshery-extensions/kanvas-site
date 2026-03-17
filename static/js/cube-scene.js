import * as THREE from 'three';
import { TECH_LOGOS, SIMPLE_ICONS, CENTER_ICON_SVG, KEPPEL_PRIMARY, KEPPEL_LIGHT, KEPPEL_GLOW } from './tech-logos.js';

async function createIconTexture(svgString, isCenter = false) {
    const size = isCenter ? 256 : 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 1. Background: Darker & more opaque for better icon contrast
    ctx.fillStyle = isCenter ? 'rgba(5, 15, 14, 0.95)' : 'rgba(6, 12, 12, 0.9)';
    ctx.fillRect(0, 0, size, size);

    // 2. Neon Border
    ctx.strokeStyle = isCenter ? KEPPEL_PRIMARY : KEPPEL_LIGHT;
    ctx.lineWidth = isCenter ? 6 : 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);

    return new Promise((resolve) => {
        // Ensure the SVG string has width/height for the canvas renderer
        const fixedSvg = svgString.replace('<svg', `<svg width="${size}" height="${size}"`);
        const img = new Image();
        const blob = new Blob([fixedSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const padding = isCenter ? 40 : 20;
            const drawSize = size - padding * 2;
            ctx.drawImage(img, padding, padding, drawSize, drawSize);

            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true; // Force Three.js to see the new pixels
            
            URL.revokeObjectURL(url);
            resolve(texture);
        };
        img.src = url;
    });
}

export default async function initCubeScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const canvas = container.querySelector('canvas');
    
    // Scene Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Central Cube
    const centerTex = await createIconTexture(CENTER_ICON_SVG, true);
    const centerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const centerMat = new THREE.MeshBasicMaterial({ map: centerTex, transparent: true });
    const centerCube = new THREE.Mesh(centerGeo, centerMat);
    const centerEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(centerGeo),
        new THREE.LineBasicMaterial({ color: KEPPEL_PRIMARY, transparent: true, opacity: 0.6 })
    );
    const centerGroup = new THREE.Group();
    centerGroup.add(centerCube, centerEdges);
    scene.add(centerGroup);

    // Create 12 Orbiting Cubes
    const orbits = [];
    for (let i = 0; i < 12; i++) {
        const sideTex = await createIconTexture(TECH_LOGOS[i % TECH_LOGOS.length]);
        const topBotTex = await createIconTexture(SIMPLE_ICONS[i % SIMPLE_ICONS.length]);

        const materials = [
            new THREE.MeshBasicMaterial({ map: sideTex, transparent: true }), // +X
            new THREE.MeshBasicMaterial({ map: sideTex, transparent: true }), // -X
            new THREE.MeshBasicMaterial({ map: topBotTex, transparent: true }), // +Y
            new THREE.MeshBasicMaterial({ map: topBotTex, transparent: true }), // -Y
            new THREE.MeshBasicMaterial({ map: sideTex, transparent: true }), // +Z
            new THREE.MeshBasicMaterial({ map: sideTex, transparent: true })  // -Z
        ];

        const size = 0.7;
        const geo = new THREE.BoxGeometry(size, size, size);
        const mesh = new THREE.Mesh(geo, materials);
        const edge = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: KEPPEL_LIGHT, transparent: true, opacity: 0.4 })
        );

        const group = new THREE.Group();
        group.add(mesh, edge);
        scene.add(group);

        orbits.push({
            group,
            angle: (i / 12) * Math.PI * 2,
            radius: 3.5 + (i % 3) * 0.4,
            speed: 0.2 + (i % 5) * 0.05
        });
    }

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
        const t = clock.getElapsedTime();
        centerGroup.rotation.y = t * 0.2;

        orbits.forEach((orbit, i) => {
            const currentAngle = orbit.angle + t * orbit.speed;
            orbit.group.position.x = Math.cos(currentAngle) * orbit.radius;
            orbit.group.position.z = Math.sin(currentAngle) * orbit.radius;
            orbit.group.position.y = Math.sin(t + i) * 0.8;
            
            orbit.group.rotation.x += 0.01;
            orbit.group.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}