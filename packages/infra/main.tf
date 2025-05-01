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

  random_name                    = module.random.random_name
  lambda_functions               = module.lambda.lambda_functions
  dynamodb_items_arn             = module.dynamodb.items_arn
  s3_storage_manager_arn         = module.s3.storage_manager_arn
  s3_storage_manager_lambdas_arn = module.s3.storage_manager_lambdas_arn
}
