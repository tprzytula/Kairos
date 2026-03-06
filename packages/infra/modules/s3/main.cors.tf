resource "aws_s3_bucket_cors_configuration" "kairos_web_bucket" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}
