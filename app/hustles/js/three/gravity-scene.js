/* ═══════════════════════════════════════════
   GRAVITY SECTION — antigravity floating frames in
   this site's violet/red palette; recolor live on
   theme toggle via theme.js's 'leo-theme-changed'
   event. Section Isolation: render loop starts only
   while #gravity is in the viewport, and only if
   fxEnabled().
   ═══════════════════════════════════════════ */
import * as THREE from 'three';
import { ThreeSceneManager } from './scene-manager.js';
import { onThemeChange } from '../theme.js';
import { fxEnabled } from '../env.js';

const FRAME_COUNT = 14;

function isDarkNow() {
  return document.documentElement.dataset.theme === 'dark';
}

export function initGravityScene() {
  const canvas = document.getElementById('gravityCanvas');
  const section = document.getElementById('gravity');
  if (!canvas || !section || !fxEnabled()) return;

  const scene = new ThreeSceneManager(canvas, { alpha: true, antialias: true, fov: 60 });
  scene.init();
  scene.camera.position.z = 15;

  const frames = [];
  let particles = null;
  let partMat = null;
  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2();
  let mouseSmX = 0;
  let mouseSmY = 0;

  function frameColorFor(isDark) {
    return isDark ? 0x9f7bff : 0x7c3aed;
  }

  function buildFrames() {
    const isDark = isDarkNow();
    const frameColor = frameColorFor(isDark);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const geo = new THREE.PlaneGeometry(4, 2.25);
      const fillMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x1a0f33 : 0xf1e9ff,
        transparent: true,
        opacity: isDark ? 0.18 : 0.14,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geo, fillMat);

      const edgesGeo = new THREE.EdgesGeometry(geo);
      const edgeMat = new THREE.LineBasicMaterial({ color: frameColor, transparent: true, opacity: 0.7 });
      const frame = new THREE.LineSegments(edgesGeo, edgeMat);
      plane.add(frame);

      const phi = Math.acos(-1 + (2 * i) / FRAME_COUNT);
      const theta = Math.sqrt(FRAME_COUNT * Math.PI) * phi;
      const r = 9 + Math.random() * 4;
      plane.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi) * 0.65,
        r * Math.cos(phi) - 6
      );
      plane.lookAt(0, 0, 0);

      plane.userData = {
        originalPos: plane.position.clone(),
        floatOffset: Math.random() * Math.PI * 2,
        fillMat,
        edgeMat,
      };

      frames.push(plane);
      scene.scene.add(plane);
    }
  }

  function buildParticles() {
    const isDark = isDarkNow();
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    partMat = new THREE.PointsMaterial({
      color: isDark ? 0x9f7bff : 0x2a2a33,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.5 : 0.25,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    particles = new THREE.Points(geo, partMat);
    scene.scene.add(particles);
  }

  const onMouse = (e) => {
    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onMouse, { passive: true });

  buildFrames();
  buildParticles();

  scene.onAnimate((delta, elapsed) => {
    mouseSmX += (mouseVec.x - mouseSmX) * 0.05;
    mouseSmY += (mouseVec.y - mouseSmY) * 0.05;

    frames.forEach((mesh) => {
      const d = mesh.userData;
      mesh.position.x = d.originalPos.x + Math.sin(elapsed * 0.5 + d.floatOffset) * 0.5 + mouseSmX * 2;
      mesh.position.y = d.originalPos.y + Math.cos(elapsed * 0.3 + d.floatOffset) * 0.3 + mouseSmY * 1.5;
      mesh.position.z = d.originalPos.z + Math.sin(elapsed * 0.4 + d.floatOffset) * 0.2;
      mesh.rotation.z = Math.sin(elapsed * 0.2 + d.floatOffset) * 0.05;
    });

    if (particles) {
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
    }

    scene.camera.position.x = Math.sin(elapsed * 0.1) * 2 + mouseSmX * 3;
    scene.camera.position.y = Math.cos(elapsed * 0.1) * 1 + mouseSmY * 2;
    scene.camera.lookAt(0, 0, 0);

    raycaster.setFromCamera(mouseVec, scene.camera);
    const hits = raycaster.intersectObjects(frames);
    const isDark = isDarkNow();
    frames.forEach((mesh) => {
      mesh.userData.fillMat.opacity = isDark ? 0.18 : 0.14;
      mesh.scale.setScalar(1);
    });
    if (hits.length > 0) {
      const h = hits[0].object;
      if (h.userData.fillMat) h.userData.fillMat.opacity = isDark ? 0.35 : 0.28;
      h.scale.setScalar(1.08);
    }
  });

  onThemeChange(({ isDark }) => {
    const col = frameColorFor(isDark);
    frames.forEach((mesh) => {
      mesh.userData.edgeMat.color.setHex(col);
      mesh.userData.fillMat.color.setHex(isDark ? 0x1a0f33 : 0xf1e9ff);
    });
    if (partMat) {
      partMat.color.setHex(isDark ? 0x9f7bff : 0x2a2a33);
      partMat.opacity = isDark ? 0.5 : 0.25;
      partMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
  });

  // Section Isolation — only render while #gravity is on screen.
  let running = false;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !running) {
          running = true;
          scene.start();
        } else if (!entry.isIntersecting && running) {
          running = false;
          scene.stop();
        }
      });
    },
    { threshold: 0.05 }
  );
  io.observe(section);
}
