output "project_name" {
  description = "Project name used by the Terraform scaffold."
  value       = var.project_name
}

output "environment" {
  description = "Environment name used by the Terraform scaffold."
  value       = var.environment
}

output "aws_region" {
  description = "AWS region configured for future resources."
  value       = var.aws_region
}
