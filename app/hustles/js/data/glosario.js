/* ═══════════════════════════════════════════
   GLOSSARY DATA — SRE/DevOps vocabulary, flashcards.
   ═══════════════════════════════════════════ */

export const GLOSARIO = [
  { term: 'CI', def: 'automatically test every code change before it merges' },
  { term: 'CD', def: 'automatically ship validated code to its target environment' },
  { term: 'Pipeline', def: 'the ordered stages a change passes through, build to deploy' },
  { term: 'Artifact', def: 'the built output of a pipeline (image, binary, zip)' },
  { term: 'Repository', def: 'where code and its full history live' },
  { term: 'Branch', def: "an isolated line of change, merged when it's proven safe" },
  { term: 'Rollback', def: 'reverting to the last known-good artifact, on purpose' },
  { term: 'Runbook', def: 'the documented "what to do when this breaks"' },
  { term: 'API Gateway', def: 'the single door every service request walks through' },
  { term: 'Split', def: 'breaking one gateway config into independently owned pieces' },
  { term: 'ECS Service', def: 'keeps N copies of a container running and healthy' },
  { term: 'Task Definition', def: 'the blueprint ECS reads to launch a container' },
  { term: 'Target Group', def: 'the pool of healthy containers a load balancer sends traffic to' },
  { term: 'ALB', def: 'routes incoming traffic to the right target group, by rule' },
  { term: 'Terraform', def: 'infrastructure described as code, reviewed before it exists' },
  { term: 'IAM', def: 'who is allowed to do what, to which AWS resource' },
  { term: 'Free Tier', def: 'the guardrail that keeps a learning project from becoming a bill' },
];
