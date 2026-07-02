# Release Flow

## Goal

The release process should be predictable, reviewable, and easy to rollback.

This project validates the app and infrastructure, then deploys static files to S3 after changes are merged to `main`.

## Current Flow

1. Create a branch from `main`.
2. Make changes to application, infrastructure, or documentation.
3. Open a pull request.
4. GitHub Actions runs CI validation.
5. Review the pull request.
6. Merge to `main` when validation passes.
7. GitHub Actions runs the deploy workflow on `main`.
8. The deploy workflow validates the project again.
9. If validation succeeds, `app/` is synced to the configured S3 website bucket.
10. The S3 website endpoint serves the updated static files.

## CI Validation

The CI workflow checks:

- Docker image build
- Docker container smoke test
- Terraform formatting
- Terraform initialization without backend
- Terraform validation

The CI workflow does not require AWS credentials.

## Deployment Flow

The deployment workflow:

1. Runs only on `push` to `main`.
2. Repeats build and validation checks.
3. Configures AWS credentials from GitHub Secrets.
4. Runs `aws s3 sync app/ s3://$S3_BUCKET/ --delete --exclude "Dockerfile"`.
5. Does not run `terraform apply`.
6. Does not create or modify infrastructure resources.

Required GitHub Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`

## Release Principles

- Every deployment should map back to a Git commit.
- Infrastructure changes should be reviewed before apply.
- Rollback instructions should be known before deployment.
- CI should fail fast on formatting and syntax issues.
- Deployment permissions should be separate from validation permissions.
- Static file deployment should be repeatable and idempotent.
