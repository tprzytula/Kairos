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

  # Map of standard DynamoDB tables for policy generation loops
  dynamodb_table_config = {
    grocery_list           = { arn = var.dynamodb_grocery_list_arn, sid = "GroceryList" }
    grocery_items_defaults = { arn = var.dynamodb_grocery_items_defaults_arn, sid = "GroceryItemsDefaults" }
    noise_tracking         = { arn = var.dynamodb_noise_tracking_arn, sid = "NoiseTracking" }
    todo_list              = { arn = var.dynamodb_todo_list_arn, sid = "TodoList" }
    projects               = { arn = var.dynamodb_projects_arn, sid = "Projects" }
    project_members        = { arn = var.dynamodb_project_members_arn, sid = "ProjectMembers" }
    user_preferences       = { arn = var.dynamodb_user_preferences_arn, sid = "UserPreferences" }
    push_subscriptions     = { arn = var.dynamodb_push_subscriptions_arn, sid = "PushSubscriptions" }
    shops                  = { arn = var.dynamodb_shops_arn, sid = "Shops" }
    recipes                = { arn = var.dynamodb_recipes_arn, sid = "Recipes" }
    birthdays              = { arn = var.dynamodb_birthdays_arn, sid = "Birthdays" }
    meal_plans             = { arn = var.dynamodb_meal_plans_arn, sid = "MealPlans" }
    adventures             = { arn = var.dynamodb_adventures_arn, sid = "Adventures" }
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
