/* ═══════════════════════════════════════════
   ACERCA VIEW · what this site is, for whoever is
   seeing it for the first time (recruiter, itti, demo).
   ═══════════════════════════════════════════ */

export function initAcercaSection() {
  const root = document.getElementById('view-acerca');
  if (!root) return;

  root.innerHTML = `
    <header class="acerca-header">
      <p class="acerca-kicker">// WHAT THIS IS</p>
      <h2 class="acerca-headline">This platform is <em>mine</em>. Here's how it's built.</h2>
    </header>

    <blockquote class="acerca-quote" data-fade>
      Most portfolios show something finished. This one shows a <em>process</em>
      — what's validated, what's still in design, and what I learned fixing a
      race condition nobody warned me about.
    </blockquote>

    <div class="acerca-grid">
      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// WHAT IT IS</p>
        <p class="acerca-block__text">
          A static site, no backend, documenting three things: how
          <code>mini-release-platform</code> works today, the work fronts I run
          at itti (anonymized, no internal data), and a living glossary of the
          terms I use every day — Kong, ECS, ALB, Terraform.
        </p>
      </section>

      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// WHAT IT ISN'T</p>
        <p class="acerca-block__text">
          Not a dashboard with live data from itti's infrastructure. Not
          connected to Kong, FaceTec, or any internal banking system. Every
          number you see is either public (GitHub's API for
          <code>mini-release-platform</code>) or updated by hand.
        </p>
      </section>

      <section class="acerca-block" data-fade>
        <p class="acerca-block__label">// HOW IT'S BUILT</p>
        <p class="acerca-block__text">
          Vanilla JavaScript, no framework, no bundler — served static, same
          pipeline shown in the Repo section. Projects, glossary and notebook
          content live in versioned data files, not a database. Zero cold
          starts, no server of its own.
        </p>
      </section>
    </div>

    <p class="acerca-footer">
      Why it exists: most portfolios show something finished. This one shows a
      process — what's already validated, what's still in design, and what I
      learned fixing a race condition nobody warned me about.
    </p>
  `;
}
