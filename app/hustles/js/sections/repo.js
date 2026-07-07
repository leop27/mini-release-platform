import { icon } from '../icons.js';

const PROFILE_URL = 'https://github.com/leop27';

const TREE = `portfolio release platform/
|-- .github/workflows/ (ci.yml, deploy.yml)
|-- app/ (Dockerfile + static pages)
|-- docs/ (operational documentation)
|-- infra/ (Terraform configuration)`;

const SPRINTS = [
  { label: 'Sprint 1', estado: 'done', texto: 'Docker + Nginx' },
  { label: 'Sprint 1.5', estado: 'done', texto: 'build / run / curl local' },
  { label: 'Sprint 2', estado: 'done', texto: 'CI validation' },
  { label: 'Sprint 3', estado: 'done', texto: 'Terraform-managed static hosting' },
  { label: 'Now', estado: 'wip', texto: 'Multilingual foundation + rollback notes' },
];

function renderSprint(s) {
  const mark = s.estado === 'done' ? icon('check') : icon('wip');
  return `
    <li class="repo-sprint repo-sprint--${s.estado}">
      <span class="repo-sprint__icon">${mark}</span>
      <span class="repo-sprint__label">${s.label}</span>
      <span class="repo-sprint__texto">${s.texto}</span>
    </li>
  `;
}

function renderReleaseNote() {
  return `
    <section class="repo-block repo-commit">
      <p class="repo-block__label">// RELEASE NOTE</p>
      <p class="repo-commit__message">Static case study: no live repository data is fetched.</p>
      <p class="repo-commit__date">Updated manually as part of the portfolio workflow.</p>
    </section>
  `;
}

export function initRepoSection() {
  const root = document.getElementById('view-repo');
  if (!root) return;

  root.innerHTML = `
    <header class="repo-header">
      <p class="repo-kicker">// CASE STUDY</p>
      <h2 class="repo-title">portfolio release platform</h2>
      <a class="repo-link" href="${PROFILE_URL}" target="_blank" rel="noopener">Public GitHub profile</a>
    </header>

    <div class="repo-grid">
      <section class="repo-block">
        <p class="repo-block__label">// STRUCTURE</p>
        <pre class="repo-tree">${TREE}</pre>
      </section>

      <section class="repo-block">
        <p class="repo-block__label">// STATE</p>
        <ul class="repo-sprints">
          ${SPRINTS.map(renderSprint).join('')}
        </ul>
      </section>
    </div>

    <section class="repo-block repo-incident">
      <p class="repo-block__label">// REAL INCIDENT</p>
      <p class="repo-incident__error">curl: (56) Recv failure: Connection reset by peer</p>
      <p class="repo-incident__texto">
        <code>docker run -d</code> only means the container started; it does not
        mean Nginx is ready yet. The pipeline's smoke test hit a port that was not
        accepting connections.
      </p>
      <p class="repo-incident__texto repo-incident__solucion">
        <strong>Fix:</strong> retries with readiness waiting before the curl,
        instead of assuming "started" means "ready".
      </p>
    </section>

    <section class="repo-block repo-guardrails">
      <p class="repo-block__label">// FREE TIER GUARDRAILS</p>
      <ul class="repo-guardrails__list">
        <li>No Kubernetes</li>
        <li>No NAT Gateway</li>
        <li>No managed database</li>
        <li>No large instances</li>
        <li>No auto-deploy without approval</li>
      </ul>
    </section>

    <div id="repo-commit-slot">${renderReleaseNote()}</div>
  `;
}
