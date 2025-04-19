resource "aws_route53_zone" "zone" {
  name = var.zone_name
}

resource "aws_route53_record" "record" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}


resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = var.certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.validation_record : record.fqdn]
}


resource "aws_route53_record" "validation_record" {
  count = length(var.domain_validation_options)

  allow_overwrite = true
  name            = var.domain_validation_options[count.index].resource_record_name
  records         = [var.domain_validation_options[count.index].resource_record_value]
  ttl             = 60
  type            = var.domain_validation_options[count.index].resource_record_type
  zone_id         = aws_route53_zone.zone.zone_id
}
