# mini-release-platform

`mini-release-platform` is a small DevOps/SRE portfolio project that models a safe release path from source code to AWS-ready infrastructure.

The MVP is intentionally simple: a static application served with Docker + Nginx, validated by GitHub Actions, and prepared for future AWS deployment through Terraform. It does not create cloud resources or deploy anything yet.

## Problem This MVP Represents

Many teams need a reliable way to move changes from GitHub to production without making the release process fragile, opaque, or dependent on manual steps.

This project represents that problem in a compact form:

- A small web application needs to be packaged consistently.
- Infrastructure must be described as code before it is created.
- Pull requests should validate application and infrastructure changes.
- Release and rollback behavior should be documented before production deployment exists.
- The platform should stay understandable enough for another engineer to operate.

The goal is not to build a complex platform. The goal is to show the foundation of a professional release workflow that can grow safely.

## DevOps / SRE Capabilities Demonstrated

This MVP demonstrates:

- Containerization with Docker and Nginx
- Basic CI validation with GitHub Actions
- Infrastructure as Code structure with Terraform
- Terraform formatting and validation without applying changes
- AWS-oriented project layout with free-tier constraints in mind
- Operational documentation for architecture, release flow, and rollback
- Separation between validation and deployment responsibilities
- A release mindset based on review, reproducibility, and rollback readiness

It is designed for an SRE Release / DevOps portfolio: small enough to review quickly, but structured like a real platform seed.

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
|-- .gitignore
`-- README.md
```

## What Is Included

- `app/`: static HTML application and Docker image definition
- `infra/`: Terraform scaffold for future AWS resources
- `.github/workflows/ci.yml`: CI workflow for validation
- `docs/`: operational documentation

## What Is Not Included Yet

- No Kubernetes
- No managed database
- No NAT Gateway or expensive always-on infrastructure
- No runtime secrets or AWS credentials required for CI validation

## Run Locally

Prerequisites:

- Docker

Check Docker is available:

```bash
docker --version
```

Build the application image:

```bash
docker build -t mini-release-platform ./app
```

Run the container:

```bash
docker run --rm -p 8080:80 mini-release-platform
```

Open the application:

```text
http://localhost:8080
```

Stop the container with `Ctrl+C` if it is running in the foreground.

To run the same check in the background:

```bash
docker run --rm -d --name mini-release-platform -p 8080:80 mini-release-platform
curl --fail http://localhost:8080
docker stop mini-release-platform
```

Expected result:

- The browser shows the `mini-release-platform` page.
- `curl` returns the static HTML.
- The container stops cleanly.

If port `8080` is already in use, map another local port:

```bash
docker run --rm -p 8081:80 mini-release-platform
```

Then open `http://localhost:8081`.

## Validate Terraform Without Applying Changes

Prerequisites:

- Terraform

Check Terraform is available:

```bash
terraform version
```

The Terraform scaffold is safe to validate locally because it does not define AWS resources yet. These commands initialize Terraform and validate syntax only.

Check formatting:

```bash
terraform fmt -check -recursive infra
```

Initialize Terraform without configuring or using a backend:

```bash
terraform -chdir=infra init -backend=false
```

Validate Terraform syntax:

```bash
terraform -chdir=infra validate
```

Important: do not run `terraform apply` as part of CI or deploy. Infrastructure changes should be reviewed and applied manually from a controlled environment.

## CI Validation

GitHub Actions runs the same checks expected from a pull request:

- Check the expected repository structure exists
- Build the Docker image
- Run the container on `localhost:8080`
- Wait for Nginx readiness and smoke test the application with `curl --fail`
- Print `docker ps -a` and `docker logs` if the smoke test fails
- Clean up the container even if the smoke test fails
- Check Terraform formatting
- Initialize Terraform without a backend
- Validate Terraform syntax

The CI workflow is intentionally validation-only. It does not use secrets, does not require AWS credentials, does not run `terraform apply`, and does not deploy to AWS.

For a step-by-step local and CI validation runbook, see [docs/04-local-validation.md](docs/04-local-validation.md).

## S3 Deployment

The deployment workflow lives in `.github/workflows/deploy.yml`.

It runs only on `push` to `main` and uses two jobs:

- `validate`: repeats the build, Docker smoke test, and Terraform validation checks.
- `deploy`: syncs the static application files from `app/` to the existing S3 website bucket.

The deploy job runs only if validation succeeds.

Configure these GitHub repository secrets before enabling deployment:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET
```

For the current dev environment:

```text
AWS_REGION=us-east-1
S3_BUCKET=mini-release-platform-dev-32ffc51b
```

Use an IAM user or role scoped to this bucket instead of broad administrator credentials. The deployment needs permissions to list the bucket and put/delete objects under it.

Example least-privilege policy for this bucket:

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

The workflow deploys with:

```bash
aws s3 sync app/ "s3://${S3_BUCKET}/" --delete --exclude "Dockerfile"
```

`Dockerfile` is excluded because the S3 website bucket should contain static site files, not container build metadata.

The deployment workflow does not run `terraform apply`, does not create AWS resources, and does not hardcode credentials.

## Architecture

The current architecture is local and CI-focused:

```text
Developer
   |
   v
GitHub repository
   |
   v
GitHub Actions CI
   |
   +--> Docker build validation
   +--> Terraform format validation
   +--> Terraform syntax validation

Local runtime
   |
   v
Docker container running Nginx
   |
   v
Static HTML application
```

See [docs/01-architecture.md](docs/01-architecture.md) for more detail.

## Release Flow

The current release flow is:

1. Create a branch.
2. Change application, infrastructure, or documentation files.
3. Open a pull request.
4. Run CI validation.
5. Review the change.
6. Merge to `main` when checks pass.
7. On push to `main`, the deploy workflow validates the project again.
8. If validation succeeds, GitHub Actions syncs `app/` to the configured S3 bucket.

See [docs/02-release-flow.md](docs/02-release-flow.md).

## Rollback

Rollback is documented before deployment is automated.

The initial rollback model is:

- Revert the faulty Git change.
- Rebuild the previous known-good application artifact.
- Redeploy the previous known-good version once deployment exists.
- For infrastructure changes, revert the Terraform change and review the rollback plan before applying.

See [docs/03-rollback.md](docs/03-rollback.md).

## AWS Free Tier Guardrails

This project is designed to stay compatible with AWS free tier and low-cost learning environments.

Avoid by default:

- Kubernetes
- NAT Gateway
- Managed databases
- Large EC2 instances
- Always-on infrastructure without explicit cost notes
- Automated deploys without manual approval

## Roadmap

Planned next iterations:

1. S3 static hosting
   - Add Terraform resources for an S3 bucket configured for static website hosting.
   - Keep the deployment target low-cost and easy to reason about.

2. EC2 container deployment
   - Add an optional free-tier-friendly EC2 path for running the Dockerized Nginx app.
   - Document SSH, security group, and instance lifecycle considerations.

3. ALB routing
   - Add an Application Load Balancer option for a more production-like traffic entry point.
   - Include explicit cost warnings because ALB is not always free-tier friendly.

4. GitHub Actions deploy workflow
   - Add a manual `workflow_dispatch` deployment pipeline.
   - Separate validation from deployment.
   - Use GitHub environments and approvals for controlled releases.

5. Documented rollback execution
   - Add concrete rollback runbooks per deployment target.
   - Include previous-version redeploy steps, Terraform rollback steps, and smoke checks.

6. Release observability basics
   - Add health checks or smoke tests after deployment.
   - Document expected service behavior and basic troubleshooting.

## Current Status

The project is in scaffold stage:

- Application: ready for local Docker build
- CI: validation workflow defined
- Terraform: S3 static website infrastructure created for the dev environment
- Docs: architecture, release flow, and rollback notes included
- Sprint 1: local run and validation process documented
- Sprint 2: GitHub Actions CI validates structure, Docker, smoke test, and Terraform
- Sprint 5: GitHub Actions deploy syncs static files to S3 on push to `main`

Current website endpoint:

```text
http://mini-release-platform-dev-32ffc51b.s3-website-us-east-1.amazonaws.com
```
