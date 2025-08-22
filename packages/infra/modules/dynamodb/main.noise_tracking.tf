resource "aws_dynamodb_table" "noise_tracking" {
  name           = "NoiseTracking"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "projectId"
  range_key      = "timestamp"

  attribute {
    name = "projectId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  global_secondary_index {
    name            = "ProjectNoiseIndex"
    hash_key        = "projectId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}
