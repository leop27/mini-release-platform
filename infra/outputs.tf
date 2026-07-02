output "project_name" {
  description = "Project name used by Terraform resources."
  value       = var.project_name
}

output "environment" {
  description = "Environment name used by Terraform resources."
  value       = var.environment
}

output "aws_region" {
  description = "AWS region configured for future resources."
  value       = var.aws_region
}

output "website_endpoint" {
  description = "S3 static website endpoint"
  value       = aws_s3_bucket_website_configuration.portfolio_website.website_endpoint
}
