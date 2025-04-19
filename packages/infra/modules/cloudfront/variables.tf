variable "bucket_name" {
  type = string
}

variable "bucket_regional_domain_name" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "region" {
  type = string
}

variable "aliases" {
  type = list(string)
}
