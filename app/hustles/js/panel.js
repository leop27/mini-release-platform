/* ═══════════════════════════════════════════
   PANEL — side-drawer with manual spring physics.
   Wired via data attributes ([data-open-panel],
   [data-close-panel]) instead of inline onclick.
   ═══════════════════════════════════════════ */

let vel = 0;
let cur = 0;
let target = 0;
let raf = null;
let active = null;
const K = 0.12;
const D = 0.75;

function springLoop(el) {
  vel += (target - cur) * K;
  vel *= D;
  cur += vel;
  el.style.transform = `translateX(${(1 - cur) * 100}%)`;
  if (Math.abs(vel) > 0.0008 || Math.abs(target - cur) > 0.0008) {
    raf = requestAnimationFrame(() => springLoop(el));
  } else {
    cur = target;
    el.style.transform = `translateX(${(1 - cur) * 100}%)`;
    if (target === 0) el.classList.remove('is-active');
  }
}

export function openPanel(id) {
  const overlay = document.getElementById('panelOverlay');
  const el = document.getElementById('panel-' + id);
  if (!el) return;
  if (active && active !== el) active.classList.remove('is-active');

  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  el.classList.add('is-active');
  active = el;
  cur = 0;
  vel = 0;
  target = 1;
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => springLoop(el));
}

export function closePanel() {
  const overlay = document.getElementById('panelOverlay');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
  if (!active) return;
  const el = active;
  target = 0;
  vel = 0;
  active = null;
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => springLoop(el));
}

export function initPanels() {
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-panel]');
    if (opener) {
      e.preventDefault();
      openPanel(opener.dataset.openPanel);
      return;
    }
    if (e.target.closest('[data-close-panel]') || e.target.id === 'panelOverlay') {
      closePanel();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && active) closePanel();
  });
}
