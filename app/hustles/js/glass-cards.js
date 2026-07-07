/* ═══════════════════════════════════════════
   GLASS CARDS — Systems & Tools expand-in-place,
   open/close class toggle per card.
   ═══════════════════════════════════════════ */

export function initGlassCards() {
  const grid = document.getElementById('systemsGrid');
  if (!grid) return;

  grid.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.glass-card__x')) {
        card.classList.remove('open');
        return;
      }
      const wasOpen = card.classList.contains('open');
      grid.querySelectorAll('.glass-card.open').forEach((c) => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });
}
