resource "aws_dynamodb_table" "grocery_items_defaults" {
  name           = "GroceryItemsDefaults"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "name"

  attribute {
    name = "name"
    type = "S"
  }
}
