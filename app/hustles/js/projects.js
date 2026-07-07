/* ═══════════════════════════════════════════
   PROJECTS — renders the Work & Projects shelf and
   wires tilt (lazily, via IntersectionObserver),
   keyboard access and the open-card interaction.
   Same engine as the old book shelf (cards.css /
   holo-tilt.js untouched) — art is a glyph panel
   instead of a cover photo.
   ═══════════════════════════════════════════ */

import { PROJECTS, RARITY_LABEL } from './projects-data.js';
import { applyHoloTilt } from './holo-tilt.js';
import { fxEnabled } from './env.js';
import { openProjectModal } from './project-modal.js';
import { icon } from './icons.js';

const STARS = { legendary: '★★★', epic: '★★', rare: '★' };

function cardTemplate(project) {
  return `
    <div class="hc-tilt">
      <div class="hc-art hc-art--glyph" data-tint="${project.tint}">
        <span class="hc-glyph" aria-hidden="true">${icon(project.iconName || 'tag')}</span>
      </div>
      <div class="hc-foil" aria-hidden="true"></div>
      <div class="hc-glare" aria-hidden="true"></div>
      <div class="hc-frame" aria-hidden="true"></div>
      <div class="hc-plate">
        <h3>${project.title}</h3>
        <p>${project.status || project.subtitle}</p>
      </div>
      <div class="hc-seal">${project.category}</div>
      <div class="hc-rarity" aria-hidden="true">${STARS[project.rarity] || ''}</div>
    </div>`;
}

function buildCard(project) {
  const card = document.createElement('article');
  card.className = 'holo-card';
  card.dataset.rarity = project.rarity;
  card.dataset.slug = project.slug;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute(
    'aria-label',
    `${project.title} — ${RARITY_LABEL[project.rarity] || project.rarity}. Open card`
  );
  card.innerHTML = cardTemplate(project);

  card.addEventListener('click', () => open(card, project));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(card, project);
    }
  });
  return card;
}

/** One legendary card floating in the hero as a teaser. */
export function initHeroCard() {
  const slot = document.querySelector('.hero-card-slot');
  if (!slot) return;
  const project = PROJECTS.find((p) => p.slug === 'mini-release-platform') || PROJECTS[0];
  const card = buildCard(project);
  slot.appendChild(card);
  if (fxEnabled()) {
    applyHoloTilt(card, { maxTilt: 12, scale: 1.04, perspective: 900 });
  }
}

export function initProjects() {
  const shelf = document.querySelector('.bookshelf');
  if (!shelf) return;

  const frag = document.createDocumentFragment();
  PROJECTS.forEach((project) => {
    frag.appendChild(buildCard(project));
  });
  shelf.appendChild(frag);

  // tilt only for fine pointers without reduced motion, and only
  // while the card is near the viewport
  if (fxEnabled()) {
    const disposers = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting && !disposers.has(el)) {
            disposers.set(el, applyHoloTilt(el, { maxTilt: 10, scale: 1.03, perspective: 900 }));
          } else if (!entry.isIntersecting && disposers.has(el)) {
            disposers.get(el)();
            disposers.delete(el);
          }
        });
      },
      { rootMargin: '120px' }
    );
    shelf.querySelectorAll('.holo-card').forEach((el) => io.observe(el));
  }
}

function open(card, project) {
  if (card.classList.contains('is-opening')) return;
  card.classList.add('is-opening');
  // brief "cover cracks open" anticipation, then the modal takes over
  window.setTimeout(() => {
    openProjectModal(project, card);
  }, 260);
}
