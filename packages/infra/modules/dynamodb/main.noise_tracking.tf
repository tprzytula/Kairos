resource "aws_dynamodb_table" "noise_tracking" {
  name           = "NoiseTracking"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "timestamp"

  attribute {
    name = "timestamp"
    type = "N"
  }
}
