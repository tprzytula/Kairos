resource "aws_dynamodb_table" "grocery_list" {
  name           = "grocery_list"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "quantity"
    type = "N"
  }

  global_secondary_index {
    name            = "NameIndex"
    hash_key        = "name"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "QuantityIndex"
    hash_key        = "quantity"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}