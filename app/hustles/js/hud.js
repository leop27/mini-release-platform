/* ═══════════════════════════════════════════
   HUD — console readout that follows the reader
   through the immersive/inverted chapters, and the
   Journey dots local nav (click-to-travel, synced
   to scroll position).
   ═══════════════════════════════════════════ */

import { getSectionProgress } from './scroll-parallax.js';

const HUD_SECTIONS = ['lab', 'pipeline', 'work', 'repo', 'gravity', 'machines'];

export function initHud() {
  const sections = [...document.querySelectorAll('[data-section]')];
  if (!sections.length) return;

  const el = document.createElement('div');
  el.className = 'hud';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <span class="hud__prompt">&gt;</span>
    <span>release-console</span>
    <span class="hud__sec" data-hud-sec>--</span>
    <span class="hud__meter"><i data-hud-fill></i></span>
    <span class="hud__pct" data-hud-pct>0%</span>`;
  document.body.appendChild(el);

  const secLabel = el.querySelector('[data-hud-sec]');
  const fill = el.querySelector('[data-hud-fill]');
  const pct = el.querySelector('[data-hud-pct]');
  let active = null;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) {
          if (active === en.target) { active = null; el.classList.remove('is-on'); }
          return;
        }
        active = en.target;
        const idx = sections.indexOf(en.target) + 1;
        const n = String(idx).padStart(2, '0');
        const total = String(sections.length).padStart(2, '0');
        secLabel.textContent = `SEC ${n}/${total} — ${en.target.id.toUpperCase()}`;
        el.classList.toggle('is-on', HUD_SECTIONS.includes(en.target.id));
      });
    },
    { rootMargin: '-40% 0px -45% 0px' }
  );
  sections.forEach((s) => io.observe(s));

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    if (!active) return;
    const p = Math.round(getSectionProgress(active) * 100);
    fill.style.insetInlineEnd = 100 - p + '%';
    pct.textContent = p + '%';
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
}

/* Journey dots — click to travel, sync while scrolling */
export function initStoryDots() {
  const track = document.getElementById('storyScroll');
  if (!track) return;
  const items = [...track.querySelectorAll('.story-scroll__item')];
  if (items.length < 2) return;

  const wrap = document.createElement('div');
  wrap.className = 'story-dots';
  wrap.setAttribute('aria-label', 'Journey stops');
  items.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Stop ${i + 1}`);
    if (i === 0) b.classList.add('is-active');
    b.addEventListener('click', () => {
      track.scrollTo({ left: items[i].offsetLeft - 24, behavior: 'smooth' });
    });
    wrap.appendChild(b);
  });
  track.after(wrap);

  const dots = [...wrap.children];
  track.addEventListener('scroll', () => {
    const step = track.scrollWidth / items.length;
    const idx = Math.min(items.length - 1, Math.round(track.scrollLeft / step));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }, { passive: true });
}
