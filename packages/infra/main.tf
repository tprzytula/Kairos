module "random" {
  source = "${local.module_path}/modules/random"
}

module "dynamodb" {
  source = "${local.module_path}/modules/dynamodb"
  random_name = module.random.random_name
}

module "lambda" {
  source = "${local.module_path}/modules/lambda"
  random_name = module.random.random_name
}

module "api_gateway" {
  source = "${local.module_path}/modules/api_gateway"
  random_name      = module.random.random_name
  lambda_functions = module.lambda.lambda_functions
}

module "s3" {
  source = "${local.module_path}/modules/s3"
  random_name = module.random.random_name
}

module "policies" {
  source = "${local.module_path}/modules/policies"
  random_name                   = module.random.random_name
  lambda_functions              = module.lambda.lambda_functions
  dynamodb_grocery_list_arn     = module.dynamodb.grocery_list_arn
  dynamodb_grocery_items_defaults_arn = module.dynamodb.grocery_items_defaults_arn
  dynamodb_noise_tracking_arn   = module.dynamodb.noise_tracking_arn
  dynamodb_todo_list_arn        = module.dynamodb.todo_list_arn
  s3_kairos_web_arn             = module.s3.kairos_web_arn
  s3_kairos_lambdas_arn         = module.s3.kairos_lambdas_arn
}

module "assets" {
  source    = "${local.module_path}/modules/assets"
  bucket_id = module.s3.kairos_web_bucket_id
}
