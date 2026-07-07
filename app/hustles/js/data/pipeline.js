/* ═══════════════════════════════════════════
   PIPELINE — the real path a change travels through
   portfolio release platform, repo → production. Anchored to
   the sub-repo's .github/workflows (ci.yml, deploy.yml)
   and docs/ (release-flow, architecture, rollback).
   The "roadmap" stages are declared, not done — greyed
   and labelled as such (anti-hallucination).
   Each stage opens a detail sheet built by pipeline.js.
   ═══════════════════════════════════════════ */

export const PIPELINE = [
  {
    id: 'dev', label: 'Developer', kind: 'source', iconName: 'keyboard',
    short: 'Every change starts on a branch cut from main.',
    detail: {
      badge: 'git', tone: 'accent',
      lead: 'Every change — code, infrastructure or docs — starts on an isolated branch cut from <code>main</code>. Nothing edits production history directly.',
      rows: [
        ['Rule', 'Every deploy maps to one Git commit'],
        ['Branch', 'Isolated; integrates only once it is proven'],
      ],
    },
  },
  {
    id: 'pr', label: 'Pull Request', kind: 'source', iconName: 'pr',
    short: 'A PR opens — the unit of review and validation.',
    detail: {
      badge: 'github', tone: 'accent',
      lead: 'The PR is where a change becomes visible and reviewable. Nothing reaches <code>main</code> without passing through it.',
      rows: [
        ['Triggers', 'CI on every pull_request and push to main'],
        ['Revert', 'Opens a new PR that undoes it — history stays traceable'],
      ],
    },
  },
  {
    id: 'ci-build', label: 'Docker build', kind: 'ci', iconName: 'container',
    short: 'CI builds the image from app/ (nginx:1.27-alpine).',
    detail: {
      badge: 'docker', tone: 'warm',
      lead: 'GitHub Actions first validates the repo structure, then builds the static image with <code>docker build ./app</code>.',
      rows: [
        ['Base', 'nginx:1.27-alpine — pinned, never :latest'],
        ['Fails fast', 'If app/Dockerfile, infra/ or docs/ are missing'],
      ],
    },
  },
  {
    id: 'ci-smoke', label: 'Smoke test', kind: 'ci', iconName: 'check', flag: true,
    short: 'Boots the container and waits for readiness before curl.',
    detail: {
      badge: 'readiness', tone: 'warm',
      lead: 'This is where the real incident lived: <code>curl: (56) Recv failure</code>. <code>docker run -d</code> means the container started — not that Nginx is ready.',
      rows: [
        ['Fix', 'Retries curl --fail up to 30× with a readiness wait'],
        ['On failure', 'Prints docker ps -a + logs; always cleans up the container'],
      ],
      note: '"Started" is not "ready" — the same idea as an traffic routing Routing Target health check.',
    },
  },
  {
    id: 'ci-tf', label: 'Terraform validate', kind: 'ci', iconName: 'layers',
    short: 'fmt -check, init -backend=false, validate. No apply.',
    detail: {
      badge: 'terraform', tone: 'warm',
      lead: 'Infrastructure is validated without creating anything: format, backend-less init, and syntax validation. CI holds no AWS credentials.',
      rows: [
        ['Runs', 'terraform fmt -check · init -backend=false · validate'],
        ['Does not run', 'terraform apply — validation is separate from release'],
      ],
    },
  },
  {
    id: 'merge', label: 'Merge → main', kind: 'source', iconName: 'branch',
    short: 'With CI green and review done, the change integrates.',
    detail: {
      badge: 'main', tone: 'accent',
      lead: 'Green CI plus a completed review is the gate. Only then does the change land on <code>main</code> — the single source of what production should be.',
      rows: [
        ['Gate', 'CI green + review approved'],
        ['Meaning', 'main is the contract for what is deployable'],
      ],
    },
  },
  {
    id: 'deploy', label: 'Deploy → S3', kind: 'ci', iconName: 'bucket',
    short: 'deploy.yml syncs the built app to S3 static hosting.',
    detail: {
      badge: 'aws s3', tone: 'accent',
      lead: 'A separate workflow — kept apart from validation on purpose — syncs the app to a Terraform-managed S3 static website bucket.',
      rows: [
        ['Separation', 'Validation and release are different workflows'],
        ['Guardrail', 'No auto-deploy without approval; free-tier only'],
      ],
    },
  },
  {
    id: 'rollback', label: 'Rollback path', kind: 'future', iconName: 'rollback',
    short: 'Declared roadmap: a documented, rehearsed rollback.',
    detail: {
      badge: 'roadmap', tone: 'muted',
      lead: 'Declared, not shipped: a documented rollback runbook so reverting is a rehearsed step, not an improvisation. Every deploy already maps to a commit — this makes going back deliberate.',
      rows: [
        ['Status', 'Roadmap — in design'],
        ['Principle', 'A rollback you have never practised is not a rollback'],
      ],
    },
  },
];
