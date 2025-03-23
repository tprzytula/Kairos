resource "aws_s3_bucket" "kairos_lambdas_bucket" {
  bucket = format("kairos-lambdas-%s", var.random_name)
}
