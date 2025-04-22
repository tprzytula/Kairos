resource "aws_dynamodb_table" "grocery_list" {
  name           = "GroceryList"
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
    name = "unit"
    type = "S"
  }

  global_secondary_index {
    name               = "NameUnitIndex"
    hash_key           = "name"
    range_key          = "unit"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }
}
