locals {
  s3_origin_id   = "${var.kairos_web_bucket_name}-origin"
  s3_domain_name = "${var.kairos_web_bucket_name}.s3-website-${var.region}.amazonaws.com"
}
