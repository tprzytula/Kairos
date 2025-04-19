resource "aws_route53_zone" "kairos" {
  name = "kairos.dev."
}

resource "aws_route53_record" "kairos_web" {
  zone_id = aws_route53_zone.kairos.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
