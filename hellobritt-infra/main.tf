terraform {
  required_version = "~> 1.15.0"

  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.61.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.23.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      app = "hellobritt"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ---------------------------------------------------------------------------
# S3 — static site bucket. Site content (built React app) lives at bucket
# root. The Worker strips the "/shop" prefix before requesting from here.
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.site.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.site]
}

# ---------------------------------------------------------------------------
# Cloudflare — placeholder DNS record (proxied) so the zone is orange-clouded
# and the Worker route can intercept requests. The actual content target
# is never used since the Worker handles every request itself.
# ---------------------------------------------------------------------------

resource "cloudflare_dns_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "A"
  content = "192.0.2.1" # placeholder (TEST-NET-1) — Worker intercepts before this is ever fetched
  proxied = true
  ttl     = 1
}

resource "cloudflare_workers_script" "router" {
  account_id         = var.cloudflare_account_id
  script_name        = var.worker_name
  main_module        = "worker.js"
  compatibility_date = "2024-09-01"
  content = templatefile("${path.module}/worker.js.tmpl", {
    s3_origin = "http://${aws_s3_bucket_website_configuration.site.website_endpoint}"
  })

  bindings = [
    {
      type         = "kv_namespace"
      name         = "SITE_CONFIG"
      namespace_id = cloudflare_workers_kv_namespace.site_config.id
    }
  ]
}

resource "cloudflare_workers_route" "shop" {
  zone_id = var.cloudflare_zone_id
  pattern = "${var.domain}/*"
  script  = cloudflare_workers_script.router.script_name
}

# ---------------------------------------------------------------------------
# Workers KV — holds the single site-config JSON document (theme, profile,
# links). Terraform only creates the namespace; it never manages the value
# inside it, so applies never clobber content edited through the admin UI.
# The Worker falls back to built-in defaults if the key doesn't exist yet.
# ---------------------------------------------------------------------------

resource "cloudflare_workers_kv_namespace" "site_config" {
  account_id = var.cloudflare_account_id
  title      = "hellobritt-site-config"
}

# ---------------------------------------------------------------------------
# Cloudflare Access — gates everything under /shop/admin* (the config
# interface page and its write API) behind an email-OTP login, restricted
# to a single allowed address. Nothing else on the site is affected.
# ---------------------------------------------------------------------------

resource "cloudflare_zero_trust_access_identity_provider" "onetime_pin" {
  account_id = var.cloudflare_account_id
  name       = "One-time PIN login"
  type       = "onetimepin"
  config     = {}
}

resource "cloudflare_zero_trust_access_policy" "admin_allow" {
  account_id = var.cloudflare_account_id
  name       = "allow-hellobritt-admin"
  decision   = "allow"

  include = [
    for email in var.admin_allowed_emails : {
      email = {
        email = email
      }
    }
  ]
}

resource "cloudflare_zero_trust_access_application" "admin" {
  account_id           = var.cloudflare_account_id
  name                 = "hellobritt-admin"
  domain               = "${var.domain}/shop/admin*"
  type                 = "self_hosted"
  session_duration     = "24h"
  app_launcher_visible = false

  # Explicitly restrict to One-Time PIN only, rather than letting Access
  # fall back to "sign in with a Cloudflare account" by default.
  allowed_idps = [cloudflare_zero_trust_access_identity_provider.onetime_pin.id]

  policies = [
    {
      id         = cloudflare_zero_trust_access_policy.admin_allow.id
      precedence = 1
    }
  ]
}
