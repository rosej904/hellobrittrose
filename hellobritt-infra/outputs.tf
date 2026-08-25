output "bucket_name" {
  value = aws_s3_bucket.site.id
}

output "s3_website_endpoint" {
  value = aws_s3_bucket_website_configuration.site.website_endpoint
}

output "worker_route" {
  value = cloudflare_workers_route.shop.pattern
}

output "site_config_kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.site_config.id
}

output "admin_app_domain" {
  value = cloudflare_zero_trust_access_application.admin.domain
}
