# Rollback

## Purpose

Rollback is the process for restoring a previously known-good state when a release causes a user-facing or operational issue.

This MVP does not deploy yet, so rollback is documented as an operational pattern for future releases.

## Application Rollback

Preferred path:

1. Identify the last known-good commit or release tag.
2. Revert the faulty change in Git.
3. Run CI validation.
4. Redeploy the previous known-good artifact.
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
