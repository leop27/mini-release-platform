/* ═══════════════════════════════════════════
   PIPELINE VIEW — repo → production as a pinned
   horizontal timeline: tall wrapper + sticky pin +
   scroll→translateX, travelling packet, progress
   fill, active node. Fallback to a plain horizontal
   drag track under reduced-motion / coarse pointers.
   Each node opens a self-contained detail sheet.
   ═══════════════════════════════════════════ */

import { PIPELINE } from '../data/pipeline.js';
import { mountIcons } from '../icons.js';
import { prefersReducedMotion, isCoarsePointer } from '../env.js';

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const KIND_LABEL = { source: 'repo / git', ci: 'ci · github actions', future: 'roadmap' };

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderNode(n) {
  return `
    <button class="pipe-node pipe-node--${n.kind}" data-node="${esc(n.id)}" type="button">
      ${n.flag ? '<span class="pipe-node__flag">real incident</span>' : ''}
      <span class="pipe-node__icon" data-icon="${n.iconName}"></span>
      <span class="pipe-node__kind">${esc(KIND_LABEL[n.kind] || n.kind)}</span>
      <span class="pipe-node__label">${esc(n.label)}</span>
      <span class="pipe-node__short">${esc(n.short)}</span>
      <span class="pipe-node__more">open stage &rarr;</span>
    </button>`;
}

function openSheet(n) {
  const d = n.detail;
  const wrap = document.createElement('div');
  wrap.className = 'pipe-sheet-overlay';
  wrap.innerHTML = `
    <div class="pipe-sheet pipe-sheet--${d.tone}" role="dialog" aria-modal="true" aria-label="${esc(n.label)}">
      <button class="pipe-sheet__close" type="button" aria-label="Close" data-icon="close"></button>
      <span class="pipe-sheet__badge">${esc(d.badge)}</span>
      <h3 class="pipe-sheet__title">${esc(n.label)}</h3>
      <p class="pipe-sheet__lead">${d.lead}</p>
      <div class="pipe-sheet__rows">
        ${d.rows.map((r) => `<div class="pipe-sheet__row"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}
      </div>
      ${d.note ? `<p class="pipe-sheet__note">${esc(d.note)}</p>` : ''}
    </div>`;
  document.body.appendChild(wrap);
  mountIcons(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-open'));

  const close = () => {
    wrap.classList.remove('is-open');
    setTimeout(() => wrap.remove(), 320);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap || e.target.closest('.pipe-sheet__close')) close();
  });
  document.addEventListener('keydown', onKey);
}

export function initPipelineSection() {
  const root = document.getElementById('view-pipeline');
  if (!root) return;

  const staticMode = prefersReducedMotion() || isCoarsePointer();

  root.innerHTML = `
    <div class="pipe-scroll${staticMode ? ' is-static' : ''}" id="pipe-scroll">
      <div class="pipe-pin">
        <header class="section-head pipe-head">
          <p class="eyebrow">// Release Velocity</p>
          <h2>From <em>repo</em> to production, engineering the flow.</h2>
          <p class="lede">The real path a change travels through mini-release-platform. Scroll to advance — every stage is real; the greyed one is declared roadmap.</p>
          <div class="pipe-progress"><span class="pipe-progress__fill" id="pipe-fill"></span></div>
        </header>
        <div class="pipe-viewport" id="pipe-viewport">
          <div class="pipe-rail"></div>
          <div class="pipe-track" id="pipe-track">
            ${PIPELINE.map(renderNode).join('')}
          </div>
          <div class="pipe-packet" id="pipe-packet"></div>
        </div>
        <p class="pipe-hint">${staticMode ? 'drag to travel the pipeline →' : 'scroll to advance the pipeline'}</p>
      </div>
    </div>`;

  mountIcons(root);

  root.querySelectorAll('.pipe-node').forEach((el) => {
    el.addEventListener('click', () => {
      const n = PIPELINE.find((p) => p.id === el.dataset.node);
      if (n) openSheet(n);
    });
  });

  if (staticMode) return;

  const wrap = root.querySelector('#pipe-scroll');
  const viewport = root.querySelector('#pipe-viewport');
  const track = root.querySelector('#pipe-track');
  const packet = root.querySelector('#pipe-packet');
  const fill = root.querySelector('#pipe-fill');
  const nodes = [...track.querySelectorAll('.pipe-node')];

  let dist = 0;

  function measure() {
    dist = Math.max(0, track.scrollWidth - viewport.clientWidth);
    wrap.style.height = window.innerHeight + dist + 'px';
    onScroll();
  }

  let ticking = false;
  function onScroll() {
    ticking = false;
    if (dist <= 0) return;
    const rect = wrap.getBoundingClientRect();
    const progress = clamp(-rect.top / dist, 0, 1);
    track.style.transform = `translateX(${-progress * dist}px)`;
    packet.style.left = progress * viewport.clientWidth + 'px';
    fill.style.width = progress * 100 + '%';
    const active = Math.round(progress * (nodes.length - 1));
    nodes.forEach((nd, i) => nd.classList.toggle('is-active', i === active));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); }, { passive: true });

  measure();
  window.addEventListener('load', measure);
  setTimeout(measure, 400);
}
