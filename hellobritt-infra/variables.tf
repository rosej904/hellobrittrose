variable "aws_region" {
  description = "AWS region for the S3 bucket"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket that will hold the built React site"
  type        = string
  default     = "hellobrittrose-site"
}

variable "domain" {
  description = "Root domain (must already be an active zone in Cloudflare)"
  type        = string
  default     = "hellobrittrose.com"
}

variable "worker_name" {
  description = "Name of the Cloudflare Worker script"
  type        = string
  default     = "hellobritt-router"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token (needs Zone:DNS Edit + Account:Workers Scripts Edit)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (needed for the Workers script resource)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for hellobrittrose.com"
  type        = string
}

variable "admin_allowed_emails" {
  description = "Email addresses allowed to authenticate into the /shop/admin config interface"
  type        = list(string)
}
