/* ═══════════════════════════════════════════
   THEME — dark/light toggle. The inline <head>
   snippet already set data-theme before first paint;
   this module wires the toggle, persistence and the
   OS-preference listener. Also dispatches
   'leo-theme-changed' so Three.js scenes can recolor
   materials live.
   ═══════════════════════════════════════════ */

const KEY = 'leo-theme';

function storedTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'dark' || t === 'light' ? t : null;
  } catch {
    return null;
  }
}

function reducedMotion() {
  return (
    !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function setTheme(next, persist = true) {
  const root = document.documentElement;

  const apply = () => {
    root.dataset.theme = next;
    if (persist) {
      try { localStorage.setItem(KEY, next); } catch { /* privacy mode */ }
    }
  };

  const btn = document.querySelector('.theme-toggle');
  const changed = root.dataset.theme !== next;

  if (document.startViewTransition && !reducedMotion() && changed) {
    // circular wipe growing out of the toggle (motion.css owns the
    // ::view-transition-* rules). Skip .theme-anim — the wipe already
    // animates every pixel and doubling up looks muddy.
    if (btn) {
      const r = btn.getBoundingClientRect();
      root.style.setProperty('--wipe-x', `${r.left + r.width / 2}px`);
      root.style.setProperty('--wipe-y', `${r.top + r.height / 2}px`);
    }
    document.startViewTransition(apply);
  } else {
    root.classList.add('theme-anim');
    apply();
    window.setTimeout(() => root.classList.remove('theme-anim'), 420);
  }

  // shared path — runs identically with or without View Transitions
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'dark' ? '#09090b' : '#ffffff';
  if (btn) {
    btn.setAttribute(
      'aria-label',
      next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  document.dispatchEvent(
    new CustomEvent('leo-theme-changed', { detail: { theme: next, isDark: next === 'dark' } })
  );
}

/**
 * @param {(detail: {theme: string, isDark: boolean}) => void} fn
 */
export function onThemeChange(fn) {
  document.addEventListener('leo-theme-changed', (e) => fn(e.detail));
}

export function initTheme() {
  // sync meta + aria with whatever the no-flash snippet chose
  setTheme(document.documentElement.dataset.theme || 'light', false);

  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme;
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  // follow the OS only while the visitor has not chosen explicitly
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!storedTheme()) setTheme(e.matches ? 'dark' : 'light', false);
      });
  }
}
