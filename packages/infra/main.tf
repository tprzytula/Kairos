module "random" {
  source = "./modules/random"
}

module "dynamodb" {
  source = "./modules/dynamodb"

  random_name = module.random.random_name
}

module "lambda" {
  source = "./modules/lambda"

  random_name = module.random.random_name
}

module "api_gateway" {
  source = "./modules/api_gateway"

  random_name      = module.random.random_name
  lambda_functions = module.lambda.lambda_functions
}

module "s3" {
  source = "./modules/s3"

  random_name = module.random.random_name
}

module "policies" {
  source = "./modules/policies"

  random_name                      = module.random.random_name
  lambda_functions                 = module.lambda.lambda_functions
  dynamodb_grocery_list_arn        = module.dynamodb.grocery_list_arn
  # dynamodb_grocery_items_icons_arn = module.dynamodb.grocery_items_icons_arn
  s3_kairos_web_arn                = module.s3.kairos_web_arn
  s3_kairos_lambdas_arn            = module.s3.kairos_lambdas_arn
}

module "assets" {
  source              = "./modules/assets"
  bucket_id           = module.s3.kairos_web_bucket_id
}
