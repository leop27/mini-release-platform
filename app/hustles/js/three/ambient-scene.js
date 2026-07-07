/* ═══════════════════════════════════════════
   AMBIENT SCENE — lighter-weight Three.js particle
   drift for sections that just need a premium backdrop
   (Hero, Lab, Machines), not a full set-piece like
   Gravity. Same ThreeSceneManager + theme-reactive +
   Section-Isolation pattern, fewer objects.
   ═══════════════════════════════════════════ */
import * as THREE from 'three';
import { ThreeSceneManager } from './scene-manager.js';
import { onThemeChange } from '../theme.js';
import { fxEnabled } from '../env.js';

function isDarkNow() {
  return document.documentElement.dataset.theme === 'dark';
}

/**
 * @param {string} canvasId
 * @param {string} sectionId section to observe for Section Isolation
 * @param {{count?:number}} [opts]
 */
export function initAmbientScene(canvasId, sectionId, opts = {}) {
  const canvas = document.getElementById(canvasId);
  const section = document.getElementById(sectionId);
  if (!canvas || !section || !fxEnabled()) return;

  const count = opts.count || 260;
  const scene = new ThreeSceneManager(canvas, { alpha: true, antialias: false, fov: 55 });
  scene.init();
  scene.camera.position.z = 12;

  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const isDark = isDarkNow();
  const mat = new THREE.PointsMaterial({
    color: isDark ? 0x9f7bff : 0x7c3aed,
    size: 0.045,
    transparent: true,
    opacity: isDark ? 0.55 : 0.3,
    blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  scene.scene.add(points);

  // optional focal object — a wireframe torus knot that tracks the
  // cursor with a lerp: real 3D hover, not just an ambient backdrop.
  let knot = null;
  let knotMat = null;
  let rotX = 0;
  let rotY = 0;
  if (opts.focus === 'torusKnot') {
    const knotGeo = new THREE.TorusKnotGeometry(2.1, 0.55, 140, 18);
    knotMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x9f7bff : 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    knot = new THREE.Mesh(knotGeo, knotMat);
    scene.scene.add(knot);
  }

  let mouseSmX = 0;
  let mouseSmY = 0;
  const onMouse = (e) => {
    mouseSmX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseSmY = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', onMouse, { passive: true });

  scene.onAnimate((delta, elapsed) => {
    points.rotation.y += delta * 0.02;
    points.rotation.x = mouseSmY * 0.08;
    scene.camera.position.x += (mouseSmX * 1.2 - scene.camera.position.x) * 0.04;
    scene.camera.lookAt(0, 0, 0);

    if (knot) {
      rotY += (mouseSmX * Math.PI * 0.6 - rotY) * 0.05;
      rotX += (mouseSmY * Math.PI * 0.25 - rotX) * 0.05;
      knot.rotation.y = rotY;
      knot.rotation.x = rotX;
      knot.position.y = Math.sin(elapsed * 0.8) * 0.12;
      knot.rotation.z = Math.sin(elapsed * 0.3) * 0.06;
    }
  });

  onThemeChange(({ isDark: nowDark }) => {
    mat.color.setHex(nowDark ? 0x9f7bff : 0x7c3aed);
    mat.opacity = nowDark ? 0.55 : 0.3;
    mat.blending = nowDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (knotMat) knotMat.color.setHex(nowDark ? 0x9f7bff : 0x7c3aed);
  });

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
