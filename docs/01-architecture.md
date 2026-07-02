# Architecture

## Purpose

`mini-release-platform` demonstrates a simple release platform for a static web application hosted on AWS S3.

This document complements the README with operational architecture details.

The platform focuses on clarity:

- Source code is versioned in GitHub.
- The application is packaged and validated with Docker.
- Nginx serves static content during local and CI smoke tests.
- GitHub Actions validates changes.
- Terraform manages S3 static website infrastructure.
- GitHub Actions deploys static files to S3 after validation on `main`.

## Current Architecture

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
   +--> Docker smoke test
   +--> Terraform format validation
   +--> Terraform syntax validation

Push to main
   |
   v
GitHub Actions deploy
   |
   +--> Build and validate
   +--> aws s3 sync app/ s3://S3_BUCKET/
   |
   v
S3 static website hosting
   |
   v
Public website endpoint

Local runtime
   |
   v
Docker container running Nginx
   |
   v
Static HTML application
```

## Application

The application is a static HTML page in `app/index.html`.

The Docker image uses `nginx:1.27-alpine` and copies the static file into the default Nginx web root.

Docker is used for validation and local development. The deployed S3 website serves the static files directly from the bucket.

## Infrastructure

Terraform lives in `infra/`.

The current infrastructure configures:

- Terraform version constraint
- Common variables for region, project name, and environment
- AWS provider
- Random provider for the bucket suffix
- S3 bucket for static website hosting
- S3 website configuration
- Public read bucket policy for website objects
- Public access block settings compatible with the public website policy
- Outputs including the website endpoint

The current dev website is served from:

```text
http://mini-release-platform-dev-32ffc51b.s3-website-us-east-1.amazonaws.com
```

## AWS Free Tier Guardrails

The project should avoid:

- NAT Gateway
- Kubernetes
- Managed databases
- Large or always-on compute
- Unbounded logs, storage, or traffic

Good candidates for future iterations:

- CloudFront with careful cost awareness
- ECR only if container deployment is required
- A small ECS/Fargate example only with explicit cost notes

## Extensibility

Future improvements can add:

- Remote Terraform state
- Manual approval gates for deployment
- Versioned Docker image tags
- Smoke checks
- Environment separation
- Release notes
