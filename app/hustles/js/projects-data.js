/* ═══════════════════════════════════════════
   PROJECTS DATA — work fronts + real repos, as
   holographic cards. Every claim traces to
   LEO_PICOT_CEREBRO.md or to what Leo himself
   published on leop27/mini-release-platform
   (tech lists, AI lab, milestones).
   rarity: legendary | epic | rare (frame tier)
   tint: violet | crimson | plum | graphite
   iconName: name from js/icons.js line-art set
   ═══════════════════════════════════════════ */

export const PROJECTS = [
  {
    slug: 'mini-release-platform',
    title: 'mini-release-platform',
    subtitle: 'GitHub → CI/CD → Docker → Terraform → AWS',
    category: 'Current project',
    rarity: 'legendary',
    tint: 'violet',
    iconName: 'pipeline',
    oneLiner: 'The release pipeline this very site ships through.',
    impact: 'A static platform validated by GitHub Actions — Docker build, smoke test with readiness retries, Terraform fmt/validate — and shipped to Terraform-managed AWS S3 Static Website Hosting. Free-tier guardrailed by design: no Kubernetes, no NAT Gateway, no managed database, no auto-deploy without approval.',
    stack: ['Docker', 'Nginx', 'GitHub Actions', 'Terraform', 'AWS S3'],
    status: 'Live — multilingual EN/ES/PT',
    repoUrl: 'https://github.com/leop27/mini-release-platform',
  },
  {
    slug: 'kong-split',
    title: 'Kong Split',
    subtitle: 'API Gateway · Platform Ops',
    category: 'Work front · 01',
    rarity: 'epic',
    tint: 'violet',
    iconName: 'gateway',
    oneLiner: 'Precision in the split — one monolithic gateway becoming squad-owned pieces.',
    impact: 'Runbook written, squad onboarding defined, tracking in place. Current priority is explicit: close one or two complete splits in DEV — not perfect the process, not automate everything. Scope discipline is release discipline.',
    stack: ['Kong', 'API Gateway', 'Runbooks', 'Squad onboarding'],
    status: 'Owner — closing 1–2 splits in DEV',
  },
  {
    slug: 'facetec-aws',
    title: 'FaceTec on AWS',
    subtitle: 'ECS · Task Definitions · ALB',
    category: 'Work front · 02',
    rarity: 'epic',
    tint: 'crimson',
    iconName: 'loadbalancer',
    oneLiner: 'Turning tribal lore into code — mapping how a biometric system lives in AWS.',
    impact: 'ECS services, task definitions, ECR, target groups and ALB routing — translated into operational documentation the whole team can actually use, not tribal knowledge locked in one head.',
    stack: ['ECS', 'ECR', 'Task Definitions', 'ALB', 'Target Groups', 'Secrets'],
    status: 'Deep work — knowledge transfer',
  },
  {
    slug: 'github-enterprise',
    title: 'GitHub Enterprise Migration',
    subtitle: 'Cross-team traceability',
    category: 'Work front · 03',
    rarity: 'epic',
    tint: 'plum',
    iconName: 'branch',
    oneLiner: 'Visibility is the antidote to friction — guardian of a critical migration.',
    impact: 'Coordinating repository migrations from legacy platforms to GitHub Enterprise: governance alignment, access management, enterprise onboarding and migration tracking across multiple engineering teams — without becoming the bottleneck.',
    stack: ['GitHub Enterprise', 'Bitbucket', 'Okta', 'EMU', 'Git'],
    status: 'Cross-team guardian — ongoing',
  },
  {
    slug: 'ai-automation-workspace',
    title: 'AI Automation Workspace',
    subtitle: 'Agents · docs systems · delivery loops',
    category: 'Automation lab',
    rarity: 'epic',
    tint: 'graphite',
    iconName: 'gear',
    oneLiner: 'AI-assisted engineering with clear process boundaries.',
    impact: 'A practical lab for AI-assisted workflows: Cursor, Codex and AI agents applied to documentation systems, repetitive operations and personal delivery loops. Automation that reduces friction without hiding context — learnings captured as reusable notes and workflows.',
    stack: ['Cursor', 'Codex', 'AI agents', 'Automation'],
    status: 'Active lab',
  },
  {
    slug: 'next-objective',
    title: 'Next objective',
    subtitle: 'Roadmap · declared',
    category: 'What’s next',
    rarity: 'rare',
    tint: 'violet',
    iconName: 'arrow',
    oneLiner: 'The platform is live — next comes the personal content layer.',
    impact: 'Declared milestones, not promises: publish the first Peugeot 504 restoration log, build a dedicated DevOps Lab page for technical writeups, and add a project timeline connecting releases, repairs and learning notes.',
    stack: ['Content layer', 'Restoration log', 'Writeups'],
    status: 'Declared — in design',
  },
];

export const RARITY_LABEL = {
  legendary: '★★★ Legendary',
  epic: '★★ Epic',
  rare: '★ Rare',
};
