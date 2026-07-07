/* ═══════════════════════════════════════════
   DRAG SCROLL — shared grab-to-scroll engine for
   every horizontal track (Journey, Work shelf,
   Glossary strip). Pointer-based drag with a 1.4×
   travel factor, wheel→horizontal mapping, and
   click suppression after a real drag so grabbing
   a card never accidentally opens it.
   ═══════════════════════════════════════════ */

const CLICK_SLOP = 6; // px of movement that separates a tap from a drag

export function initDragScroll(selector, opts = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  const factor = opts.factor ?? 1.4;
  let isDown = false;
  let moved = 0;
  let startX = 0;
  let startScroll = 0;

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDown = true;
    moved = 0;
    startX = e.clientX;
    startScroll = el.scrollLeft;
    el.classList.add('is-grabbing');
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    // capture only once it's clearly a drag, so plain taps still click through
    if (moved > CLICK_SLOP && !el.hasPointerCapture(e.pointerId)) {
      try { el.setPointerCapture(e.pointerId); } catch { /* detached */ }
    }
    if (moved > CLICK_SLOP) el.scrollLeft = startScroll - dx * factor;
  });

  const end = () => { isDown = false; el.classList.remove('is-grabbing'); };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('pointerleave', end);

  // a drag is not a click — swallow the click that follows one
  el.addEventListener('click', (e) => {
    if (moved > CLICK_SLOP) {
      e.stopPropagation();
      e.preventDefault();
      moved = 0;
    }
  }, true);

  // vertical wheel travels the track while it still has room,
  // then hands the scroll back to the page (no scroll traps)
  if (opts.wheel !== false) {
    el.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  el.style.cursor = 'grab';
}
