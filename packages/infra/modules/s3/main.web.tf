resource "aws_s3_bucket" "kairos_web_bucket" {
  bucket = format("kairos-web-%s", var.random_name)
}

resource "aws_s3_bucket_acl" "kairos_web_bucket_acl" {
  bucket = aws_s3_bucket.kairos_web_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "kairos_web_website_configuration" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  index_document {
    suffix = "index.html"
  }
}

data "aws_iam_policy_document" "kairos_web_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.kairos_web_bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.kairos_web_distribution.iam_arn]
    }
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.kairos_web_bucket.arn]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.kairos_web_distribution.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "kairos_web_bucket_policy" {
  bucket = aws_s3_bucket.kairos_web_bucket.id
  policy = data.aws_iam_policy_document.kairos_web_bucket_policy.json
}

resource "aws_s3_bucket_public_access_block" "kairos_web_bucket" {
  bucket = aws_s3_bucket.kairos_web_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = false
}