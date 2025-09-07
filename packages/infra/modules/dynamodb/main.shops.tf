resource "aws_dynamodb_table" "shops" {
  name           = "Shops"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "projectId"
    type = "S"
  }

  global_secondary_index {
    name            = "ProjectShopsIndex"
    hash_key        = "projectId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}
