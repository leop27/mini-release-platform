/* ═══════════════════════════════════════════
   MARQUEE — pause the type bands while they're off
   screen so the compositor never works for nothing.
   ═══════════════════════════════════════════ */

export function initMarquees() {
  const bands = document.querySelectorAll('.marquee');
  if (!bands.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.target.classList.toggle('is-paused', !en.isIntersecting)),
    { rootMargin: '80px 0px' }
  );
  bands.forEach((b) => io.observe(b));
}
