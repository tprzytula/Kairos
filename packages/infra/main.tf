module "random" {
  source = "./modules/random"
}

module "dynamodb" {
  source = "./modules/dynamodb"

  random_name = module.random.random_name
}

module "lambda" {
  source = "./modules/lambda"

  random_name                  = module.random.random_name
  todo_notifications_topic_arn = module.sns.todo_notifications_topic_arn
  vapid_public_key             = var.vapid_public_key
  vapid_private_key            = var.vapid_private_key
  s3_kairos_web_bucket_name    = module.s3.kairos_web_bucket_name
  s3_cloudfront_domain         = module.s3.cloudfront_domain
}

module "api_gateway" {
  source = "./modules/api_gateway"

  random_name           = module.random.random_name
  lambda_functions      = module.lambda.lambda_functions
  cognito_user_pool_arn = module.cognito.user_pool_arn
}

module "s3" {
  source = "./modules/s3"

  random_name = module.random.random_name
}

module "sns" {
  source = "./modules/sns"

  random_name                       = module.random.random_name
  notification_lambda_arn           = module.lambda.lambda_functions["send_todo_notifications"].function_arn
  notification_lambda_function_name = module.lambda.lambda_functions["send_todo_notifications"].function_name
}

module "policies" {
  source = "./modules/policies"

  random_name                = module.random.random_name
  lambda_functions           = module.lambda.lambda_functions
  dynamodb_table_arns        = module.dynamodb.table_arns
  sns_todo_notifications_arn = module.sns.todo_notifications_topic_arn
  s3_kairos_web_arn          = module.s3.kairos_web_arn
  s3_kairos_lambdas_arn      = module.s3.kairos_lambdas_arn
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
