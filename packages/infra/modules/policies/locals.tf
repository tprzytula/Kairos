locals {
  github_organisation           = "tprzytula"
  github_kairos_repository_name = "Kairos"

  database_read_only_actions = [
    "dynamodb:GetItem",
    "dynamodb:Scan",
    "dynamodb:Query",
  ]

  database_read_write_actions = [
    "dynamodb:DeleteItem",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:Scan",
    "dynamodb:UpdateItem",
    "dynamodb:BatchWriteItem",
    "dynamodb:Query",
  ]

  permissions = {
    read_only  = "read-only"
    read_write = "read-write"
    publish    = "publish"
    none       = "none"
  }

  # Map of DynamoDB tables for policy generation loops (auto-generated from table ARNs)
  dynamodb_table_config = {
    for name, arn in var.dynamodb_table_arns :
    name => {
      arn = arn
      sid = replace(title(replace(name, "_", " ")), " ", "")
    }
  }

  # Map of S3 upload paths for policy generation loops
  s3_upload_config = {
    recipe_uploads          = { sid = "RecipeUploads", path = "recipes" }
    shop_uploads            = { sid = "ShopUploads", path = "shops" }
    grocery_default_uploads = { sid = "GroceryDefaultUploads", path = "grocery-defaults" }
    meal_plan_uploads       = { sid = "MealPlanUploads", path = "meal-plans" }
    adventure_uploads       = { sid = "AdventureUploads", path = "adventures" }
  }
}
