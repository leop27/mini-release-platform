/* ═══════════════════════════════════════════
   REPO VIEW · case study for mini-release-platform,
   live GitHub API fetch for the latest commit.
   ═══════════════════════════════════════════ */

import { icon } from '../icons.js';

const REPO_URL = 'https://github.com/leop27/mini-release-platform';

const TREE = `mini-release-platform/
├── .github/workflows/ (ci.yml, deploy.yml)
├── app/ (Dockerfile + index.html)
├── docs/ (4 markdowns operativos)
└── infra/ (main.tf, variables.tf, outputs.tf)`;

const SPRINTS = [
  { label: 'Sprint 1', estado: 'done', texto: 'Docker + Nginx' },
  { label: 'Sprint 1.5', estado: 'done', texto: 'build / run / curl local' },
  { label: 'Sprint 2', estado: 'done', texto: 'GitHub Actions CI' },
  { label: 'Sprint 3', estado: 'done', texto: 'Terraform → S3 static hosting' },
  { label: 'Now', estado: 'wip', texto: 'Multilingual EN/ES/PT + rollback runbook (in design)' },
];

async function fetchLatestCommit() {
  try {
    const res = await fetch('https://api.github.com/repos/leop27/mini-release-platform/commits?per_page=1');
    if (!res.ok) throw new Error('rate limited or unavailable');
    const [commit] = await res.json();
    return { message: commit.commit.message, date: commit.commit.author.date };
  } catch {
    return null;
  }
}

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

function renderCommitSection(commit) {
  if (!commit) return '';
  const fecha = new Date(commit.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return `
    <section class="repo-block repo-commit">
      <p class="repo-block__label">// LATEST COMMIT</p>
      <p class="repo-commit__message">${commit.message.split('\n')[0]}</p>
      <p class="repo-commit__date">${fecha}</p>
    </section>
  `;
}

export function initRepoSection() {
  const root = document.getElementById('view-repo');
  if (!root) return;

  root.innerHTML = `
    <header class="repo-header">
      <p class="repo-kicker">// CASE STUDY</p>
      <h2 class="repo-title">mini-release-platform</h2>
      <a class="repo-link" href="${REPO_URL}" target="_blank" rel="noopener">${REPO_URL} ↗</a>
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
        <code>docker run -d</code> only means the container started — it does not
        mean Nginx is ready yet. The pipeline's smoke test hit a port that wasn't
        accepting connections.
      </p>
      <p class="repo-incident__texto repo-incident__solucion">
        <strong>Fix:</strong> retries with readiness waiting before the curl,
        instead of assuming "started" means "ready".
      </p>
    </section>

    <section class="repo-block repo-guardrails">
      <p class="repo-block__label">// AWS FREE TIER GUARDRAILS</p>
      <ul class="repo-guardrails__list">
        <li>No Kubernetes</li>
        <li>No NAT Gateway</li>
        <li>No managed database</li>
        <li>No large instances</li>
        <li>No auto-deploy without approval</li>
      </ul>
    </section>

    <div id="repo-commit-slot"></div>
  `;

  fetchLatestCommit().then((commit) => {
    const slot = document.getElementById('repo-commit-slot');
    if (!slot) return;
    if (commit) slot.innerHTML = renderCommitSection(commit);
  });
}
