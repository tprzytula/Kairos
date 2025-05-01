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

  random_name               = module.random.random_name
  lambda_functions          = module.lambda.lambda_functions
  dynamodb_grocery_list_arn = module.dynamodb.grocery_list_arn
  s3_kairos_web_arn         = module.s3.kairos_web_arn
  s3_kairos_lambdas_arn     = module.s3.kairos_lambdas_arn
}

module "acm" {
  source = "./modules/acm"

  kairos_zone_id = module.route53.kairos_zone_id
}

module "cloudfront" {
  source = "./modules/cloudfront"

  kairos_web_bucket_name = module.s3.kairos_web_bucket_name
  kairos_web_bucket_regional_domain_name = module.s3.kairos_web_bucket_regional_domain_name
  region                 = "eu-west-2"
  kairos_certificate_arn = module.acm.kairos_certificate_arn
}

module "route53" {
  source = "./modules/route53"

  cloudfront_distribution_domain_name = module.cloudfront.cloudfront_distribution_domain_name
  cloudfront_distribution_hosted_zone_id = module.cloudfront.cloudfront_distribution_hosted_zone_id
}

