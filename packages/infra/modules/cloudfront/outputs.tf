output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.kairos_web_distribution.domain_name
}

output "cloudfront_distribution_hosted_zone_id" {
  value = aws_cloudfront_distribution.kairos_web_distribution.hosted_zone_id
}
