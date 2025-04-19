variable "cloudfront_distribution_domain_name" {
  type = string
}

variable "cloudfront_distribution_hosted_zone_id" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "domain_validation_options" {
  type = list(object({
    domain_name = string
    resource_record_name = string
    resource_record_value = string
    resource_record_type = string
  }))
}
