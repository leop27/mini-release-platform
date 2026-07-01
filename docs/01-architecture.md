# Architecture

## Purpose

`mini-release-platform` demonstrates a simple release platform for a static web application.

The MVP focuses on clarity:

- Source code is kept in GitHub.
- The application is packaged with Docker.
- Nginx serves static content.
- GitHub Actions validates changes.
- Terraform provides the infrastructure layout for AWS.
- Operational documentation explains release and rollback decisions.

## Current Components

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

## Application

The application is a static HTML page in `app/index.html`.

The Docker image uses `nginx:1.27-alpine` and copies the static file into the default Nginx web root.

## Infrastructure

Terraform lives in `infra/`.

The initial scaffold configures:

- Terraform version constraint
- Common variables for region, project name, and environment
- Outputs that verify the module can be initialized and validated

No AWS resources are created in this first step.
The AWS provider will be added together with the first real AWS resource, such as S3 static hosting.

## AWS Free Tier Guardrails

The project should avoid:

- NAT Gateway
- Kubernetes
- Managed databases
- Large or always-on compute
- Unbounded logs, storage, or traffic

Good candidates for future iterations:

- S3 static website hosting
- CloudFront with careful cost awareness
- ECR only if container deployment is required
- A small ECS/Fargate example only with explicit cost notes

## Extensibility

Future improvements can add:

- Remote Terraform state
- Manual deployment workflow
- Versioned Docker image tags
- Smoke checks
- Environment separation
- Release notes
