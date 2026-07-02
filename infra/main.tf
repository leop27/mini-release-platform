terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "portfolio_bucket" {
  bucket = "${var.project_name}-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "LeandroPicot"
  }
}
resource "aws_s3_bucket_website_configuration" "portfolio_website" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "portfolio_public_access" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "portfolio_policy" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "PublicReadGetObject"
        Effect = "Allow"

        Principal = "*"

        Action = [
          "s3:GetObject"
        ]

        Resource = [
          "${aws_s3_bucket.portfolio_bucket.arn}/*"
        ]
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.portfolio_public_access
  ]
}

# Current deployment target: S3 static website hosting. Future iterations can
# add CloudFront, a custom domain, or an optional container runtime path.
