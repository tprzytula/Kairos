output "certificate_arn" {
  value = aws_acm_certificate.certificate.arn
}

output "domain_validation_options" {
  value = aws_acm_certificate.certificate.domain_validation_options
}
