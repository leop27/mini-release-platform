/* ═══════════════════════════════════════════
   INTRO — cinematic loader removal, fused with a
   hero typewriter effect.
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

const PHRASES = [
  'Building Systems.',
  'Building Machines.',
  'Building Myself.',
];

export function initLoader() {
  initLoaderCount();
  window.setTimeout(() => {
    document.getElementById('loader')?.remove();
  }, 2300);
}

/* mono percentage readout — 0% → 100% in ~1.9s, eased via rAF.
   Reduced motion: jumps straight to 100%. */
function initLoaderCount() {
  const el = document.querySelector('[data-loader-count]');
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = '100%';
    return;
  }

  const DURATION = 1900;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  let start = null;

  const step = (now) => {
    if (start === null) start = now;
    const t = Math.min((now - start) / DURATION, 1);
    el.textContent = `${Math.round(easeOutCubic(t) * 100)}%`;
    if (t < 1 && document.getElementById('loader')) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

export function initHeroTypewriter() {
  const el = document.querySelector('.hero-typewriter');
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = PHRASES[PHRASES.length - 1];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = PHRASES[phraseIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? 32 : 58;
    if (!deleting && charIndex === phrase.length) {
      delay = phraseIndex === PHRASES.length - 1 ? 100000 : 1400;
      if (phraseIndex < PHRASES.length - 1) deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex += 1;
      delay = 300;
    }
    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 2400);
}
