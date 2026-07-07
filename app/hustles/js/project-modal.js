/* ═══════════════════════════════════════════
   PROJECT MODAL — full-screen detail view. The left
   pane replays the "cover opens" animation on a glyph
   panel instead of a book cover; the right pane
   carries the copy. Singleton, backdrop/Esc/button
   close, focus trap + focus restore.
   ═══════════════════════════════════════════ */

import { RARITY_LABEL } from './projects-data.js';
import { icon } from './icons.js';

let overlay = null;
let lastCard = null;

function ensureOverlay() {
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'book-overlay';
  overlay.innerHTML = `
    <div class="bo-backdrop"></div>
    <div class="bo-sheet" role="dialog" aria-modal="true" aria-label="Project detail">
      <button class="bo-close" aria-label="Close">${icon('close')}</button>
      <div class="bo-grid">
        <div class="bm-stage" aria-hidden="true">
          <div class="bm-book">
            <div class="bm-page">
              <p class="bm-page-text"></p>
            </div>
            <div class="bm-cover">
              <div class="bm-cover-art" data-tint="">
                <span class="bm-cover-glyph"></span>
              </div>
              <div class="bm-cover-back"></div>
            </div>
          </div>
        </div>
        <div class="bo-copy">
          <p class="bo-kicker mono"></p>
          <h2 class="bo-title"></h2>
          <p class="bo-author mono"></p>
          <p class="bo-oneliner italic-serif"></p>
          <hr class="hairline">
          <p class="bo-status-line mono"></p>
          <div class="bo-stack"></div>
          <p class="bo-why-label mono">IMPACT</p>
          <p class="bo-why"></p>
          <a class="bo-repo mono" target="_blank" rel="noreferrer" hidden>${icon('branch')}<span></span></a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.querySelector('.bo-backdrop').addEventListener('click', closeProjectModal);
  overlay.querySelector('.bo-close').addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', onKeydown);
  return overlay;
}

function onKeydown(e) {
  if (!overlay || !overlay.classList.contains('is-open')) return;
  if (e.key === 'Escape') {
    closeProjectModal();
    return;
  }
  // minimal focus trap
  if (e.key === 'Tab') {
    const focusables = overlay.querySelectorAll('button, a[href]');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function openProjectModal(project, cardEl) {
  const ov = ensureOverlay();
  lastCard = cardEl || null;

  ov.querySelector('.bo-kicker').textContent =
    `${project.category} · ${RARITY_LABEL[project.rarity] || project.rarity}`;
  ov.querySelector('.bo-title').textContent = project.title;
  ov.querySelector('.bo-author').textContent = project.subtitle;
  ov.querySelector('.bo-oneliner').textContent = project.oneLiner;
  ov.querySelector('.bo-why').textContent = project.impact;
  ov.querySelector('.bm-page-text').textContent = project.oneLiner;

  // status line
  const statusLine = ov.querySelector('.bo-status-line');
  statusLine.textContent = project.status ? `// ${project.status}` : '';
  statusLine.hidden = !project.status;

  // stack chips
  const stack = ov.querySelector('.bo-stack');
  stack.innerHTML = (project.stack || []).map((s) => `<span>${s}</span>`).join('');
  stack.hidden = !(project.stack && project.stack.length);

  // repo link (only where a real repo exists)
  const repo = ov.querySelector('.bo-repo');
  if (project.repoUrl) {
    repo.href = project.repoUrl;
    repo.querySelector('span').textContent = 'open repository';
    repo.hidden = false;
  } else {
    repo.hidden = true;
  }

  const art = ov.querySelector('.bm-cover-art');
  art.dataset.tint = project.tint;
  ov.querySelector('.bm-cover-glyph').innerHTML = icon(project.iconName || 'tag');

  // restart the open-card animation
  const cover = ov.querySelector('.bm-cover');
  cover.classList.remove('is-opening');
  void cover.offsetWidth;
  cover.classList.add('is-opening');

  ov.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  ov.querySelector('.bo-close').focus();

  // the card can rest normally behind the backdrop now
  if (lastCard) {
    window.setTimeout(() => {
      if (lastCard) lastCard.classList.remove('is-opening');
    }, 350);
  }
}

export function closeProjectModal() {
  if (!overlay) return;
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  if (lastCard) {
    lastCard.classList.remove('is-opening');
    lastCard.focus({ preventScroll: true });
    lastCard = null;
  }
}
