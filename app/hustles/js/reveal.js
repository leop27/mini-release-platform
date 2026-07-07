/* ═══════════════════════════════════════════
   REVEAL — scroll reveal + nav highlight + counters
   + scroll progress bar.
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

export function initReveal() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.1 });
  sections.forEach((s) => io.observe(s));

  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach((l) =>
        l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`)
      );
    });
  }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navIo.observe(s));

  initFadeItems();
  initCounters();
  initProgressBar();
}

/**
 * [data-fade] with optional stagger via [data-delay] and
 * optional direction via [data-fade-dir="left"|"right"]
 * (translateX instead of the default translateY — used for
 * About/Journey scroll beats, see base.css).
 */
function initFadeItems() {
  const items = document.querySelectorAll('[data-fade]');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || '0', 10);
      setTimeout(() => e.target.classList.add('is-in'), d);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => obs.observe(el));
}

/** [data-count] animates 0 → target with ease-out-cubic. */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const reduce = prefersReducedMotion();
  const fmt = (n) => n.toLocaleString('en-US');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = fmt(target) + suffix; obs.unobserve(el); return; }
      const dur = parseInt(el.dataset.dur || '1600', 10);
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.floor(ease * target)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target) + suffix;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => obs.observe(el));
}

/** Thin fixed bar at the top, fills with scroll progress. */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}
