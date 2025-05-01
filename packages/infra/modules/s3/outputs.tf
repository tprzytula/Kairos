output "kairos_web_arn" {
  value = aws_s3_bucket.kairos_web_bucket.arn
}

output "kairos_web_bucket_name" {
  value = aws_s3_bucket.kairos_web_bucket.bucket
}

output "kairos_lambdas_arn" {
  value = aws_s3_bucket.kairos_lambdas_bucket.arn
}

output "kairos_web_bucket_id" {
  value = aws_s3_bucket.kairos_web_bucket.id
}
