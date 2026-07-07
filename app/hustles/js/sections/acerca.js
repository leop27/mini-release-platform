export function initAcercaSection() {
  const root = document.getElementById('view-acerca');
  if (!root) return;

  root.innerHTML = `
    <header class="acerca-header">
      <p class="acerca-kicker">// WHAT THIS IS</p>
      <h2 class="acerca-headline">This is an <em>experimental frontend lab</em>.</h2>
    </header>

    <blockquote class="acerca-quote" data-fade>
      Most portfolios show something finished. This page shows a process:
      what is validated, what is still in design, and what I learned while
      building a release workflow.
    </blockquote>

    <div class="acerca-grid">
      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// WHAT IT IS</p>
        <p class="acerca-block__text">
          A static frontend experiment documenting platform thinking, release
          workflow, automation lab notes, cloud infrastructure concepts, and
          operational documentation patterns.
        </p>
      </section>

      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// WHAT IT ISN'T</p>
        <p class="acerca-block__text">
          Not a live dashboard. Not connected to customer environments,
          private operational systems. Every number is either
          public, illustrative, or updated by hand.
        </p>
      </section>

      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// HOW IT'S BUILT</p>
        <p class="acerca-block__text">
          Vanilla JavaScript, no framework, no bundler. Projects, glossary and
          notebook content live in versioned data files, not a database.
        </p>
      </section>
    </div>

    <p class="acerca-footer">
      Why it exists: to explore frontend storytelling while keeping professional
      work generic, non-sensitive and easy to review.
    </p>
  `;
}
