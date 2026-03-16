resource "aws_dynamodb_table" "meal_plans" {
  name           = "MealPlans"
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
    name            = "ProjectMealPlansIndex"
    hash_key        = "projectId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}
