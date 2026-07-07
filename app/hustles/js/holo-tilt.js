/* ═══════════════════════════════════════════
   HOLO TILT — spring-interpolated 3D tilt for the
   trading cards.
   1. transform goes to a child (.hc-tilt) so the root
      keeps its static scatter rotate/translate, focus
      ring and floor shadow;
   2. the pointer vars are sprung too (--hx/--hy/--mx/
      --my/--hyp) so foil, glare and layer parallax all
      ride the same spring;
   3. will-change only while hovered;
   4. .is-opening guard so the open animation never
      fights the tilt transform.
   ═══════════════════════════════════════════ */

export function applyHoloTilt(el, opts = {}) {
  const {
    maxTilt = 10,
    scale = 1.03,
    perspective = 900,
    stiffness = 0.14,
  } = opts;

  const target = el.querySelector('.hc-tilt') || el;
  target.style.transformStyle = 'preserve-3d';

  let raf = null;
  let rect = null;
  let leaving = false;
  let targetRX = 0, targetRY = 0, targetScale = 1;
  let targetHX = 0, targetHY = 0;
  let curRX = 0, curRY = 0, curScale = 1;
  let curHX = 0, curHY = 0;

  function tick() {
    curRX += (targetRX - curRX) * stiffness;
    curRY += (targetRY - curRY) * stiffness;
    curScale += (targetScale - curScale) * stiffness;
    curHX += (targetHX - curHX) * stiffness;
    curHY += (targetHY - curHY) * stiffness;

    target.style.transform =
      `perspective(${perspective}px) rotateX(${curRX}deg) rotateY(${curRY}deg) scale(${curScale})`;

    el.style.setProperty('--hx', curHX.toFixed(4));
    el.style.setProperty('--hy', curHY.toFixed(4));
    el.style.setProperty('--mx', `${((curHX / 2 + 0.5) * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${((curHY / 2 + 0.5) * 100).toFixed(2)}%`);
    el.style.setProperty(
      '--hyp',
      (Math.hypot(curHX, curHY) / Math.SQRT2).toFixed(4)
    );

    const settled =
      Math.abs(targetRX - curRX) < 0.02 &&
      Math.abs(targetRY - curRY) < 0.02 &&
      Math.abs(targetScale - curScale) < 0.002 &&
      Math.abs(targetHX - curHX) < 0.005 &&
      Math.abs(targetHY - curHY) < 0.005;

    if (!settled) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      if (leaving) {
        target.style.willChange = '';
        el.classList.remove('is-live');
        leaving = false;
      }
    }
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function onEnter() {
    if (el.classList.contains('is-opening')) return;
    rect = el.getBoundingClientRect();
    leaving = false;
    target.style.willChange = 'transform';
    el.classList.add('is-live');
  }

  function onMove(e) {
    if (el.classList.contains('is-opening')) return;
    if (!rect) rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    targetHX = (px - 0.5) * 2;
    targetHY = (py - 0.5) * 2;
    targetRY = (px - 0.5) * maxTilt * 2;
    targetRX = -(py - 0.5) * maxTilt * 2;
    targetScale = scale;
    kick();
  }

  function onLeave() {
    rect = null;
    leaving = true;
    targetRX = 0;
    targetRY = 0;
    targetScale = 1;
    targetHX = 0;
    targetHY = 0;
    kick();
  }

  el.addEventListener('pointerenter', onEnter);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    el.removeEventListener('pointerenter', onEnter);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    if (raf) cancelAnimationFrame(raf);
    target.style.transform = '';
    target.style.willChange = '';
    el.classList.remove('is-live');
  };
}
