resource "aws_s3_bucket" "kairos_lambdas_bucket" {
  bucket = format("kairos-lambdas-%s", var.random_name)
}

resource "aws_s3_bucket_versioning" "kairos_web_bucket_versioning" {
  bucket = aws_s3_bucket.kairos_web_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
