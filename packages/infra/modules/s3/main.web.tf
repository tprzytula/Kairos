resource "aws_s3_bucket" "kairos_web_bucket" {
  bucket = format("kairos-web-%s", var.random_name)
}

resource "aws_s3_bucket_website_configuration" "kairos_web_website_configuration" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_versioning" "kairos_web_bucket_versioning" {
  bucket = aws_s3_bucket.kairos_web_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}