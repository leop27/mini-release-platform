/* ═══════════════════════════════════════════
   ENV — environment guards shared by the FX layer.
   Coarse pointers (touch) and prefers-reduced-motion
   turn off tilt, foil animation and parallax.
   ═══════════════════════════════════════════ */

export const isCoarsePointer = () =>
  !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

export const prefersReducedMotion = () =>
  !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true when pointer FX should run (mouse present, no reduced motion). */
export const fxEnabled = () => !isCoarsePointer() && !prefersReducedMotion();
