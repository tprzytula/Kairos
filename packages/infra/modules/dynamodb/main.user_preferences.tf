resource "aws_dynamodb_table" "user_preferences" {
  name           = "UserPreferences"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }
}
