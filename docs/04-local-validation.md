# Local Validation

## Goal

This runbook verifies that a new contributor can run `mini-release-platform` locally and validate the same checks used by CI.

## Prerequisites

Install:

- Docker
- Terraform

Check versions:

```bash
docker --version
terraform version
```

Expected result:

- Docker prints an installed version.
- Terraform prints an installed version.

## Build The Application Image

From the repository root:

```bash
docker build -t mini-release-platform ./app
```

Expected result:

- The command exits successfully.
- A local image named `mini-release-platform` is created.

## Run The Application

```bash
docker run --rm -p 8080:80 mini-release-platform
```

Expected result:

- Nginx starts in the foreground.
- The terminal remains attached to the container logs.

Open:

```text
http://localhost:8080
```

You should see the `mini-release-platform` static page.

Stop the container with `Ctrl+C`.

## Run In The Background

Use this mode when you want to test with `curl`:

```bash
docker run --rm -d --name mini-release-platform -p 8080:80 mini-release-platform
curl --fail http://localhost:8080
docker stop mini-release-platform
```

Expected result:

- `curl` returns the HTML page.
- `docker stop` removes the container because it was started with `--rm`.

## Validate Terraform Without Applying Changes

Check formatting:

```bash
terraform fmt -check -recursive infra
```

Initialize Terraform without using a backend:

```bash
terraform -chdir=infra init -backend=false
```

Validate syntax:

```bash
terraform -chdir=infra validate
```

Do not run:

```bash
terraform apply
```

Local validation does not deploy AWS resources. S3 deployment happens only through the separate GitHub Actions deploy workflow on `push` to `main`.

## CI Validation

The GitHub Actions workflow in `.github/workflows/ci.yml` validates the same release basics expected from a pull request:

- Repository structure exists: `app/Dockerfile`, `app/index.html`, `infra/`, and `docs/`
- Docker image builds from `./app`
- Container starts on `localhost:8080`
- Smoke test waits for Nginx readiness and succeeds with `curl --fail`
- Docker diagnostics print `docker ps -a` and `docker logs` if validation fails
- Container is cleaned up even if the smoke test fails
- Terraform formatting passes
- Terraform initializes with `-backend=false`
- Terraform validates without applying changes

The workflow does not use AWS credentials, secrets, or `terraform apply`.

The deployment workflow in `.github/workflows/deploy.yml` runs only on `push` to `main`. It repeats validation first, then syncs `app/` to the configured S3 bucket using GitHub Secrets.

## Local Equivalent Of CI

Run these commands from the repository root:

```bash
test -f app/Dockerfile
test -f app/index.html
test -d infra
test -d docs

docker build -t mini-release-platform ./app
docker run -d -p 8080:80 --name mini-release-platform mini-release-platform

ready=false
for attempt in {1..30}; do
  if curl --fail http://localhost:8080; then
    ready=true
    break
  fi

  echo "Application is not ready yet. Attempt ${attempt}/30."
  sleep 2
done

if [ "$ready" != "true" ]; then
  docker ps -a
  docker logs mini-release-platform || true
  docker stop mini-release-platform || true
  docker rm mini-release-platform || true
  exit 1
fi

docker stop mini-release-platform
docker rm mini-release-platform

terraform fmt -check -recursive infra
terraform -chdir=infra init -backend=false
terraform -chdir=infra validate
```

## Troubleshooting

If `docker` is not found:

- Install Docker Desktop.
- Start Docker Desktop before running the commands.
- Open a new terminal after installation so the `docker` command is available in `PATH`.

If port `8080` is already in use:

```bash
docker run --rm -p 8081:80 mini-release-platform
```

Then open:

```text
http://localhost:8081
```

If Terraform validation fails locally:

- Re-run `terraform -chdir=infra init -backend=false`.
- Confirm you are running the commands from the repository root.
- Try the same validation in GitHub Actions if the local workstation behaves differently.

## Acceptance Criteria

- Docker image builds successfully.
- Container serves the static page locally.
- `curl http://localhost:8080` returns HTML.
- CI fails if the expected repository structure is missing.
- CI cleans up the Docker container even when validation fails.
- Terraform format check passes.
- Terraform initializes with `-backend=false`.
- Terraform validation runs without applying changes.
- README contains enough detail for a new contributor to repeat the process.
