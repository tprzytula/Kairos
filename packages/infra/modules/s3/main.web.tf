resource "aws_s3_bucket" "kairos_web_bucket" {
  bucket = format("kairos-web-%s", var.random_name)
}

resource "aws_s3_bucket_acl" "kairos_web_bucket_acl" {
  bucket = aws_s3_bucket.kairos_web_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "kairos_web_website_configuration" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "kairos_web_bucket_policy" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "AllowGetObjects"
    Statement = [
      {
        Sid       = "AllowPublic"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.kairos_web_bucket.arn}/**"
      }
    ]
  })
}
