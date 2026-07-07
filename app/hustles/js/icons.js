/* ═══════════════════════════════════════════
   ICONS — hand-drawn line-art SVG set, one visual
   system for the whole site (zero emojis policy).
   64×64 grid, stroke 3 (2.5 for detail), round
   caps/joins, 2–6 strokes per icon —
   stroke="currentColor" so CSS owns the color.
   Usage:  import { icon, mountIcons } from './icons.js'
           icon('gateway')            → svg string
           <span data-icon="lock">    → replaced by mountIcons()
   ═══════════════════════════════════════════ */

const P = (d, w = 3) => `<path d="${d}" stroke-width="${w}"/>`;
const C = (cx, cy, r, w = 3) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="${w}"/>`;

const ICONS = {
  /* docker / container — crate with pinned lid + wake lines */
  container: P('M10 26 L54 26 L54 50 L10 50 Z') + P('M10 34 L54 34', 2.5) + P('M21 26 L21 34 M32 26 L32 34 M43 26 L43 34', 2.5) + P('M14 18 L26 18 M32 18 L44 18', 2.5) + P('M8 57 Q18 53 28 57 T48 57', 2.5),
  /* terraform — stacked layers */
  layers: P('M32 8 L56 20 L32 32 L8 20 Z') + P('M8 32 L32 44 L56 32', 2.5) + P('M8 42 L32 54 L56 42', 2.5),
  /* pipeline — stages flowing right */
  pipeline: C(12, 32, 6) + C(32, 32, 6) + P('M18 32 L26 32', 2.5) + P('M38 32 L46 32', 2.5) + P('M46 26 L56 32 L46 38 Z'),
  /* api-platform / gateway — diamond splitting one flow into two */
  gateway: P('M32 12 L48 32 L32 52 L16 32 Z') + P('M4 32 L16 32', 2.5) + P('M48 32 L60 22 M48 32 L60 42', 2.5) + C(60, 22, 2.5, 2.5) + C(60, 42, 2.5, 2.5),
  /* traffic routing — one entry balanced into three targets */
  loadbalancer: C(12, 32, 6) + P('M18 32 L30 32 M30 32 L44 14 M30 32 L44 32 M30 32 L44 50', 2.5) + C(50, 14, 5, 2.5) + C(50, 32, 5, 2.5) + C(50, 50, 5, 2.5),
  /* image registry / registry — image shelf */
  registry: P('M10 12 L54 12 L54 52 L10 52 Z') + P('M10 25 L54 25 M10 38 L54 38', 2.5) + P('M17 18.5 L25 18.5 M17 31.5 L25 31.5 M17 44.5 L25 44.5', 2.5),
  /* secrets — padlock */
  lock: P('M16 28 L48 28 L48 54 L16 54 Z') + P('M22 28 L22 20 Q22 10 32 10 Q42 10 42 20 L42 28', 2.5) + P('M32 38 L32 46', 2.5) + C(32, 37, 3, 2.5),
  /* runbook — open manual with steps */
  runbook: P('M32 14 Q22 8 8 10 L8 50 Q22 48 32 54 Q42 48 56 50 L56 10 Q42 8 32 14 Z') + P('M32 14 L32 54', 2.5) + P('M15 22 L26 21 M15 30 L26 29 M38 21 L49 22 M38 29 L49 30', 2.5),
  /* rollback — arrow returning to a safe point */
  rollback: P('M46 14 Q56 24 56 34 Q56 50 38 50 L16 50', 2.5) + P('M24 40 L14 50 L24 60') + C(14, 14, 5, 2.5),
  /* release tag */
  tag: P('M12 12 L34 12 L54 32 L34 52 L12 30 Z') + C(23, 23, 3.5, 2.5),
  /* squad — three heads, one line of work */
  squad: C(32, 18, 7) + C(14, 26, 5.5, 2.5) + C(50, 26, 5.5, 2.5) + P('M6 50 Q14 38 24 42 Q32 30 40 42 Q50 38 58 50', 2.5),
  /* observability — telescope */
  telescope: P('M10 30 L44 12 L50 24 L16 42 Z') + P('M44 12 L50 24', 2.5) + P('M28 40 L20 58 M32 38 L44 58', 2.5) + C(54, 14, 3, 2.5),
  /* git branch */
  branch: C(16, 14, 6) + C(16, 50, 6) + C(48, 22, 6) + P('M16 20 L16 44', 2.5) + P('M48 28 Q48 40 24 46', 2.5),
  /* S3 bucket */
  bucket: P('M14 16 Q32 24 50 16 L45 52 Q32 58 19 52 Z') + P('M14 16 Q32 8 50 16', 2.5) + P('M22 30 Q32 35 42 30', 2.5),
  /* status: done */
  check: C(32, 32, 22) + P('M21 33 L29 41 L44 24'),
  /* status: in design / wip — dashed orbit */
  wip: `<circle cx="32" cy="32" r="22" stroke-width="3" stroke-dasharray="9 8"/>` + C(32, 32, 4, 2.5),
  /* gear — brand/system */
  gear: C(32, 32, 9) + P('M32 10 L32 18 M32 46 L32 54 M10 32 L18 32 M46 32 L54 32 M17 17 L23 23 M41 41 L47 47 M47 17 L41 23 M23 41 L17 47', 2.5),
  /* wrench — machines */
  wrench: P('M40 10 Q54 12 54 26 Q54 30 52 33 L30 55 Q26 59 21 54 Q16 49 20 45 L42 23 Q40 18 40 10 Z') + C(25, 50, 2, 2.5),
  /* keyboard / developer */
  keyboard: P('M8 20 L56 20 L56 46 L8 46 Z') + P('M15 28 L19 28 M25 28 L29 28 M35 28 L39 28 M45 28 L49 28 M15 37 L23 37 M28 37 L44 37', 2.5),
  /* pull request — forked review path */
  pr: C(16, 16, 6) + C(16, 48, 6) + C(48, 48, 6) + P('M16 22 L16 42', 2.5) + P('M32 16 L42 16 Q48 16 48 24 L48 42', 2.5) + P('M36 10 L30 16 L36 22', 2.5),
  /* arrow — CTA / links */
  arrow: P('M8 32 L52 32', 3) + P('M40 18 L54 32 L40 46'),
  /* road — machines & memories */
  road: P('M20 54 L28 10 L36 10 L44 54 Z') + P('M32 16 L32 22 M32 30 L32 36 M32 44 L32 50', 2.5),
  /* close — two strokes, animatable */
  close: P('M18 18 L46 46') + P('M46 18 L18 46'),
  /* youtube / media — play badge */
  play: P('M10 16 Q10 12 14 12 L50 12 Q54 12 54 16 L54 48 Q54 52 50 52 L14 52 Q10 52 10 48 Z') + P('M26 22 L44 32 L26 42 Z', 2.5),
  /* instagram — camera */
  camera: P('M12 12 L52 12 L52 52 L12 52 Z') + C(32, 32, 10, 2.5) + C(45, 19, 2.5, 2.5),
  /* email */
  mail: P('M8 16 L56 16 L56 48 L8 48 Z') + P('M8 18 L32 36 L56 18', 2.5),
  /* linkedin-ish — person card */
  person: P('M10 12 L54 12 L54 52 L10 52 Z') + C(21, 26, 5, 2.5) + P('M16 44 Q21 36 26 44', 2.5) + P('M34 24 L48 24 M34 32 L48 32 M34 40 L48 40', 2.5),
  /* github — branch node constellation */
  github: C(32, 32, 21) + C(32, 32, 4, 2.5) + P('M32 11 L32 22 M32 42 L32 53 M13.5 22.5 L23 28 M41 36 L50.5 41.5', 2.5),
};

export function icon(name, cls = '') {
  const body = ICONS[name];
  if (!body) return '';
  return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* replace every <span data-icon="name"> under root with the inline svg */
export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const svg = icon(el.dataset.icon, el.dataset.iconClass || '');
    if (svg) el.innerHTML = svg;
  });
}
