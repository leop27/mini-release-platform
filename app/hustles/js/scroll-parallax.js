/* ═══════════════════════════════════════════
   SCROLL PARALLAX — one rAF-throttled listener drives
   (a) the Machines sticky road scene and (b) any
   [data-plx] layer (ghost bg-words, drifting titles),
   each with its own speed, so scrolling gains depth.
   data-plx-speed = px of travel across the section's
   viewport transit (negative drifts up).
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

/** 0..1 progress of `el` through the viewport (0 = just entered, 1 = about to leave). */
export function getSectionProgress(el) {
  const rect = el.getBoundingClientRect();
  const total = rect.height + window.innerHeight;
  const seen = window.innerHeight - rect.top;
  return Math.min(1, Math.max(0, seen / total));
}

export function initMachinesParallax() {
  if (prefersReducedMotion()) return;
  const scene = document.querySelector('.road-scene');
  const img = scene?.querySelector('img');
  const scrim = scene?.querySelector('.road-scrim');
  if (!scene || !img) return;

  let ticking = false;
  const update = () => {
    const p = getSectionProgress(scene);
    img.style.transform = `translateY(${(p - 0.5) * 60}px) scale(1.08)`;
    if (scrim) scrim.style.opacity = String(0.75 + p * 0.2);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

export function initParallaxLayers() {
  if (prefersReducedMotion()) return;
  const layers = [...document.querySelectorAll('[data-plx]')];
  if (!layers.length) return;

  const items = layers.map((el) => ({
    el,
    speed: parseFloat(el.dataset.plxSpeed || '-60'),
    section: el.closest('section') || el.parentElement,
    isBgWord: el.classList.contains('bg-word'),
  }));

  let ticking = false;
  const update = () => {
    ticking = false;
    for (const it of items) {
      const p = getSectionProgress(it.section);
      if (p <= 0 || p >= 1) continue;
      const y = (p - 0.5) * it.speed;
      // bg-words carry a CSS centering translate — compose with it
      it.el.style.translate = it.isBgWord ? `-50% calc(-50% + ${y}px)` : `0 ${y}px`;
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}
