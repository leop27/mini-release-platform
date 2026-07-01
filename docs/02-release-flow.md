# Release Flow

## Goal

The release process should be predictable, reviewable, and easy to rollback.

This MVP validates the project but does not deploy it yet.

## Current Flow

1. Create a branch from `main`.
2. Make changes to application, infrastructure, or documentation.
3. Open a pull request.
4. GitHub Actions runs CI validation.
5. Review the pull request.
6. Merge to `main` when validation passes.

## CI Validation

The CI workflow checks:

- Docker image build
- Terraform formatting
- Terraform initialization without backend
- Terraform validation

The workflow does not require AWS credentials.

## Future Deployment Flow

A future deployment workflow should:

1. Build and tag the artifact.
2. Run infrastructure validation.
3. Require manual approval for production-like environments.
4. Deploy the selected version.
5. Run smoke checks.
6. Publish release notes.

## Release Principles

- Every deployment should map back to a Git commit.
- Infrastructure changes should be reviewed before apply.
- Rollback instructions should be known before deployment.
- CI should fail fast on formatting and syntax issues.
- Deployment permissions should be separate from validation permissions.
