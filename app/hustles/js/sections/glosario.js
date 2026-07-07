/* ═══════════════════════════════════════════
   GLOSSARY VIEW · term → definition flashcards.
   ═══════════════════════════════════════════ */

import { GLOSARIO } from '../data/glosario.js';

function renderCard({ term, def }, i) {
  return `
    <article class="glosario-card" data-term="${term.toLowerCase()}" data-def="${def.toLowerCase()}" data-fade data-delay="${(i % 6) * 50}">
      <div class="glosario-card__inner">
        <div class="glosario-face glosario-face--front">
          <p class="glosario-term">${term} <span class="glosario-arrow">→</span></p>
          <p class="glosario-hint">flip</p>
        </div>
        <div class="glosario-face glosario-face--back">
          <p class="glosario-def">${def}</p>
        </div>
      </div>
    </article>
  `;
}

export function initGlosarioSection() {
  const root = document.getElementById('view-glosario');
  if (!root) return;

  root.innerHTML = `
    <header class="glosario-header">
      <p class="glosario-kicker">// GLOSSARY</p>
      <h2 class="glosario-headline">The vocabulary, <em>no filler</em>.</h2>
      <div class="glosario-tools">
        <input id="glosario-filter" class="glosario-filter" type="text" placeholder="filter — e.g. ALB, terraform, rollback…" />
        <span class="glosario-count" id="glosario-count">${GLOSARIO.length} terms</span>
      </div>
    </header>
    <div class="glosario-grid" id="glosario-grid">
      ${GLOSARIO.map(renderCard).join('')}
    </div>
    <p class="glosario-hint-strip">drag the strip →</p>
  `;

  const input = root.querySelector('#glosario-filter');
  const count = root.querySelector('#glosario-count');
  const cards = [...root.querySelectorAll('.glosario-card')];

  // flip on click/tap (hover flip is handled by CSS)
  cards.forEach((c) => c.addEventListener('click', () => c.classList.toggle('is-flipped')));

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((c) => {
      const hit = !q || c.dataset.term.includes(q) || c.dataset.def.includes(q);
      c.classList.toggle('is-hidden', !hit);
      if (hit) shown++;
    });
    count.textContent = shown === GLOSARIO.length ? `${GLOSARIO.length} terms` : `${shown} / ${GLOSARIO.length}`;
  });
}
