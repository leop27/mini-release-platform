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

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.portfolio_cdn.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.portfolio_cdn.domain_name
}