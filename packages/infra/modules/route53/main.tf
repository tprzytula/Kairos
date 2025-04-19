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
  for_each = {
    for idx, dvo in var.domain_validation_options : idx => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.zone.zone_id
}
