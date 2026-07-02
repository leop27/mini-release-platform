# Rollback

## Purpose

Rollback is the process for restoring a previously known-good state when a release causes a user-facing or operational issue.

This project deploys static files to S3 from GitHub Actions after changes are merged to `main`, so rollback focuses on restoring the previous known-good static site version and keeping infrastructure changes reviewed separately.

## Application Rollback

Preferred path:

1. Identify the last known-good commit or release tag.
2. Revert the faulty change in Git.
3. Run CI validation.
4. Merge or rerun the previous known-good version through the deployment workflow.
5. Run smoke checks.

For a static site, rollback should be fast because the artifact is small and has no database migration dependency.

## Infrastructure Rollback

If a Terraform change caused the issue:

1. Stop and assess impact before applying more changes.
2. Revert the infrastructure commit.
3. Run `terraform plan` and review the proposed rollback.
4. Apply only after review and approval.
5. Confirm service health after the apply.

Avoid manual cloud-console changes unless production impact requires immediate intervention. If manual changes are made, reconcile them back into Terraform afterward.

## Rollback Decision Checklist

- What changed?
- Is the issue caused by application code, infrastructure, or configuration?
- Is there customer impact?
- Is rollback safer than a forward fix?
- What is the last known-good version?
- Who approves the rollback?

## Future Improvements

- Release tags
- Immutable Docker image tags
- Deployment history
- Automated smoke checks
- Documented recovery time objective
- Manual approval gates for production deployments
