# mini-release-platform
Branch protection test.
`mini-release-platform` is a DevOps/SRE portfolio project that demonstrates a small but complete release path from GitHub to AWS.

It packages a static web application with Docker, validates changes with GitHub Actions, provisions AWS S3 Static Website Hosting with Terraform, and deploys site updates automatically with `aws s3 sync`.

Live site:

```text
http://mini-release-platform-dev-32ffc51b.s3-website-us-east-1.amazonaws.com
```

## Project Status

- Docker image builds successfully.
- Local container smoke test is documented.
- GitHub Actions CI validates structure, Docker, smoke test, and Terraform.
- Terraform provisions the S3 static website infrastructure.
- S3 website hosting is enabled.
- Public read access is configured for website objects.
- GitHub Actions deploys static files to S3 on push to `main`.
- GitHub Secrets are used for AWS credentials and deployment configuration.

## Architecture Overview

This project represents a common release engineering problem: moving a small application from source control to a cloud-hosted environment in a way that is repeatable, reviewable, and easy to troubleshoot.

The goal is not platform complexity. The goal is to show the core mechanics of a professional delivery workflow:

- Source code is versioned in GitHub.
- Application packaging is validated with Docker.
- CI runs repeatable checks before deployment.
- Infrastructure is managed with Terraform.
- Static site hosting is provided by AWS S3.
- Deployment is automated through GitHub Actions.
- Operational documentation explains validation, release, and rollback.

Current architecture:

```text
Developer
   |
   v
Git commit / git push
   |
   v
GitHub repository
   |
   +-----------------------+
   |                       |
   v                       v
CI workflow            Deploy workflow
   |                       |
   |                       +--> Configure AWS credentials from GitHub Secrets
   |                       +--> aws s3 sync app/ s3://S3_BUCKET/
   |                       |
   v                       v
Docker build          AWS S3 Static Website Hosting
Docker run                  |
Smoke test                  v
Terraform validation   Public website endpoint
```

Infrastructure ownership:

```text
Terraform
   |
   +--> S3 bucket
   +--> S3 website configuration
   +--> Public access block settings
   +--> Bucket policy for public read access
   +--> Website endpoint output
```

Runtime validation:

```text
Docker image
   |
   v
Docker container
   |
   v
Nginx serving app/index.html
   |
   v
curl smoke test
```

## Components

- GitHub: source control and pull request workflow.
- GitHub Actions: CI validation and deployment automation.
- Docker: local packaging and runtime validation with Nginx.
- Terraform: Infrastructure as Code for AWS resources.
- AWS S3: static website hosting target.

## Repository Structure

```text
.
|-- app/
|   |-- Dockerfile
|   `-- index.html
|-- docs/
|   |-- 01-architecture.md
|   |-- 02-release-flow.md
|   |-- 03-rollback.md
|   `-- 04-local-validation.md
|-- infra/
|   |-- main.tf
|   |-- variables.tf
|   `-- outputs.tf
|-- .github/
|   `-- workflows/
|       |-- ci.yml
|       `-- deploy.yml
|-- .dockerignore
|-- .gitignore
`-- README.md
```

## CI/CD Flow

The current flow is:

```text
Developer
   |
   v
Commit
   |
   v
Push to main
   |
   v
GitHub Actions
   |
   v
Build and validation
   |
   v
AWS S3 sync
   |
   v
Website updated
```

Step by step:

1. A developer commits a change.
2. The change is pushed to GitHub.
3. GitHub Actions starts the CI and deploy workflows.
4. CI validates repository structure, Docker build, container startup, smoke test, Terraform formatting, and Terraform syntax.
5. The deploy workflow repeats validation before publishing.
6. AWS credentials and deployment settings are loaded from GitHub Secrets.
7. `aws s3 sync` uploads static files from `app/` to the S3 website bucket.
8. The public S3 website endpoint serves the updated content.

The CI workflow does not use AWS credentials and does not deploy. The deploy workflow runs only on push to `main`.

## Infrastructure

AWS region:

```text
us-east-1
```

S3 website endpoint:

```text
http://mini-release-platform-dev-32ffc51b.s3-website-us-east-1.amazonaws.com
```

Terraform lives in `infra/` and manages:

- `random_id.bucket_suffix`: generates a stable suffix for the bucket name.
- `aws_s3_bucket.portfolio_bucket`: creates the S3 bucket.
- `aws_s3_bucket_website_configuration.portfolio_website`: enables static website hosting.
- `aws_s3_bucket_public_access_block.portfolio_public_access`: allows the public website policy to work.
- `aws_s3_bucket_policy.portfolio_policy`: grants public `s3:GetObject` access to website objects.

Terraform outputs:

- `project_name`
- `environment`
- `aws_region`
- `website_endpoint`

Infrastructure changes are applied manually from a controlled environment. CI and deploy workflows do not run `terraform apply`.

## GitHub Secrets

The deploy workflow requires these repository secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET
```

Current dev values:

```text
AWS_REGION=us-east-1
S3_BUCKET=mini-release-platform-dev-32ffc51b
```

Use credentials scoped to the deployment bucket instead of broad administrator credentials.

Example least-privilege IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::mini-release-platform-dev-32ffc51b"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mini-release-platform-dev-32ffc51b/*"
    }
  ]
}
```

Deployment command used by the workflow:

```bash
aws s3 sync app/ "s3://${S3_BUCKET}/" --delete --exclude "Dockerfile"
```

`Dockerfile` is excluded because the S3 website bucket should contain static site files, not container build metadata.

## Local Development

Prerequisites:

- Docker
- Terraform

Build the Docker image:

```bash
docker build -t mini-release-platform ./app
```

Run the container:

```bash
docker run --rm -p 8080:80 mini-release-platform
```

Open:

```text
http://localhost:8080
```

Validate Terraform:

```bash
terraform fmt -check -recursive infra
terraform -chdir=infra init -backend=false
terraform -chdir=infra validate
```

See [docs/04-local-validation.md](docs/04-local-validation.md) for the full local validation runbook.

## Operational Documentation

- [Architecture](docs/01-architecture.md)
- [Release Flow](docs/02-release-flow.md)
- [Rollback](docs/03-rollback.md)
- [Local Validation](docs/04-local-validation.md)

## Lessons Learned

- Docker image vs container: the image is the packaged artifact; the container is the running process that must be tested.
- Service readiness matters: `docker run -d` does not guarantee Nginx is ready, so CI needs an HTTP readiness loop before the smoke test.
- GitHub Actions troubleshooting improves reliability: `docker ps -a` and `docker logs` make failures easier to diagnose.
- Terraform providers are part of the runtime contract: provider versions and `.terraform.lock.hcl` help make validation reproducible.
- Terraform state matters: local state works for a learning project, but shared environments need remote state and locking.
- Idempotency is central: Terraform manages infrastructure repeatedly, and `aws s3 sync` makes static file deployment repeatable.
- AWS IAM should be scoped: deployment credentials should only access the target bucket and required object operations.
- Bucket policies and public access block settings must work together for S3 website hosting.
- Static website hosting is a simple, low-cost deployment target for frontend/static content.
- Infrastructure as Code makes the platform reviewable, auditable, and easier to rebuild.

## Future Improvements

- Least Privilege IAM: replace broad deployment credentials with a tightly scoped IAM policy or GitHub OIDC role.
- Terraform Remote State: move state to a remote backend with locking for safer collaboration.
- CloudFront: add CDN caching, HTTPS, and better edge delivery.
- Custom Domain: map a domain name to the static website through DNS and certificate management.
- ECS/Fargate: add an optional container deployment path for workloads that need runtime compute.
- Observability: add deployment metadata, health checks, and basic operational dashboards.
- Monitoring: add uptime checks and alerting for the public endpoint.

## Cost And Scope Notes

This project intentionally avoids:

- Kubernetes
- Managed databases
- NAT Gateway
- Large compute instances
- Always-on infrastructure outside the S3 static website path

The current implementation is designed to stay simple, understandable, and appropriate for a DevOps/SRE portfolio.
