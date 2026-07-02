variable "aws_region" {
  description = "AWS region for infrastructure resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name used to prefix AWS resources."
  type        = string
  default     = "mini-release-platform"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}
