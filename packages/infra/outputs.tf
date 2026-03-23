output "cloudfront_domain" {
  description = "CloudFront distribution domain name — set this as the 'cloudfront_domain' workspace variable to enable recipe image uploads"
  value       = module.s3.cloudfront_domain
}
