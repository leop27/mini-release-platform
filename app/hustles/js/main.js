/* ═══════════════════════════════════════════
   MAIN — boot. Theme + loader first, then reveal,
   then every section view, then the FX layer
   (icons, marquees, HUD, parallax, Three.js scenes,
   panels, glass cards, drag-scroll tracks).
   ═══════════════════════════════════════════ */

import { initTheme } from './theme.js';
import { initReveal } from './reveal.js';
import { initHeroCard, initProjects } from './projects.js';
import { initLoader, initHeroTypewriter } from './intro.js';
import { initPanels } from './panel.js';
import { initGlassCards } from './glass-cards.js';
import { initDragScroll } from './drag-scroll.js';
import { initMachinesParallax, initParallaxLayers } from './scroll-parallax.js';
import { mountIcons } from './icons.js';
import { initMarquees } from './marquee.js';
import { initHud, initStoryDots } from './hud.js';

import { initRepoSection } from './sections/repo.js';
import { initGlosarioSection } from './sections/glosario.js';
import { initPipelineSection } from './sections/pipeline.js';
import { initAcercaSection } from './sections/acerca.js';

function boot() {
  initTheme();
  initReveal();
  initLoader();
  initHeroTypewriter();

  // section views (some inject markup with data-icon spans)
  initHeroCard();
  initProjects();
  initRepoSection();
  initPipelineSection();
  initGlosarioSection();
  initAcercaSection();

  // replace every remaining static <span data-icon> with inline SVG
  mountIcons(document);

  // secondary nav + rhythm layers
  initMarquees();
  initHud();
  initStoryDots();
  initParallaxLayers();

  // interactions
  initPanels();
  initGlassCards();
  initDragScroll('#storyScroll');
  initDragScroll('.bookshelf');
  initDragScroll('#glosario-grid');
  initMachinesParallax();

  // Three.js layer — dynamic import so a slow/broken CDN
  // fetch of "three" never blocks the rest of the page.
  import('./three/nav-accent.js').then((m) => m.initNavAccent()).catch(() => {});
  import('./three/gravity-scene.js').then((m) => m.initGravityScene()).catch(() => {});
  import('./three/ambient-scene.js').then((m) => {
    m.initAmbientScene('labAmbientCanvas', 'lab', { count: 160, focus: 'torusKnot' });
  }).catch(() => {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
