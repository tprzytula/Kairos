module "random" {
  source = "./modules/random"
}

module "dynamodb" {
  source = "./modules/dynamodb"

  random_name = module.random.random_name
}

module "lambda" {
  source = "./modules/lambda"

  random_name                   = module.random.random_name
  todo_notifications_topic_arn = module.sns.todo_notifications_topic_arn
  vapid_public_key             = var.vapid_public_key
  vapid_private_key            = var.vapid_private_key
}

module "api_gateway" {
  source = "./modules/api_gateway"

  random_name            = module.random.random_name
  lambda_functions       = module.lambda.lambda_functions
  cognito_user_pool_arn  = module.cognito.user_pool_arn
}

module "s3" {
  source = "./modules/s3"

  random_name = module.random.random_name
}

module "sns" {
  source = "./modules/sns"

  random_name                      = module.random.random_name
  notification_lambda_arn          = module.lambda.lambda_functions["send_todo_notifications"].function_arn
  notification_lambda_function_name = module.lambda.lambda_functions["send_todo_notifications"].function_name
}

module "policies" {
  source = "./modules/policies"

  random_name                         = module.random.random_name
  lambda_functions                    = module.lambda.lambda_functions
  dynamodb_grocery_list_arn           = module.dynamodb.grocery_list_arn
  dynamodb_grocery_items_defaults_arn = module.dynamodb.grocery_items_defaults_arn
  dynamodb_noise_tracking_arn         = module.dynamodb.noise_tracking_arn
  dynamodb_todo_list_arn              = module.dynamodb.todo_list_arn
  dynamodb_migrations_arn             = module.dynamodb.migrations_arn
  dynamodb_projects_arn               = module.dynamodb.projects_arn
  dynamodb_project_members_arn        = module.dynamodb.project_members_arn
  dynamodb_user_preferences_arn       = module.dynamodb.user_preferences_arn
  dynamodb_push_subscriptions_arn     = module.dynamodb.push_subscriptions_arn
  sns_todo_notifications_arn          = module.sns.todo_notifications_topic_arn
  s3_kairos_web_arn                   = module.s3.kairos_web_arn
  s3_kairos_lambdas_arn               = module.s3.kairos_lambdas_arn
}

module "assets" {
  source    = "./modules/assets"
  bucket_id = module.s3.kairos_web_bucket_id
}

module "cognito" {
  source = "./modules/cognito"

  random_name = module.random.random_name

  # Google OAuth credentials from Terraform Cloud workspace variables
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}
