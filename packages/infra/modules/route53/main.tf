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

locals {
  validation_records = var.domain_validation_options != null ? var.domain_validation_options : []
}

resource "aws_route53_record" "validation_record" {
  count = length(local.validation_records)

  allow_overwrite = true
  name            = local.validation_records[count.index].resource_record_name
  records         = [local.validation_records[count.index].resource_record_value]
  ttl             = 60
  type            = local.validation_records[count.index].resource_record_type
  zone_id         = aws_route53_zone.zone.zone_id
}
