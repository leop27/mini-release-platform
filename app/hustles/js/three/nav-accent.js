/* ═══════════════════════════════════════════
   NAV ACCENT — tiny orbital-ring canvas next to the
   brand. Cheap enough to run continuously (nav is
   always on screen); still gated by fxEnabled().
   ═══════════════════════════════════════════ */
import * as THREE from 'three';
import { ThreeSceneManager } from './scene-manager.js';
import { onThemeChange } from '../theme.js';
import { fxEnabled } from '../env.js';

function isDarkNow() {
  return document.documentElement.dataset.theme === 'dark';
}

export function initNavAccent() {
  const canvas = document.getElementById('navAccentCanvas');
  if (!canvas || !fxEnabled()) return;

  const scene = new ThreeSceneManager(canvas, { alpha: true, antialias: true, fov: 45 });
  scene.init();
  scene.camera.position.z = 4;

  const ringGeo = new THREE.TorusGeometry(1, 0.06, 8, 40);
  const isDark = isDarkNow();
  const mat = new THREE.MeshBasicMaterial({ color: isDark ? 0x9f7bff : 0x7c3aed, wireframe: true });
  const ring = new THREE.Mesh(ringGeo, mat);
  ring.rotation.x = Math.PI / 3;
  scene.scene.add(ring);

  scene.onAnimate((delta) => {
    ring.rotation.z += delta * 0.6;
  });

  onThemeChange(({ isDark: nowDark }) => {
    mat.color.setHex(nowDark ? 0x9f7bff : 0x7c3aed);
  });

  scene.start();
}
