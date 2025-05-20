output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = module.api_gateway.api_gateway_url
}

output "web_bucket_name" {
  description = "Name of the S3 bucket for web assets"
  value       = module.s3.kairos_web_bucket_id
}

output "lambda_bucket_name" {
  description = "Name of the S3 bucket for Lambda functions"
  value       = module.s3.kairos_lambdas_bucket_id
}

output "dynamodb_tables" {
  description = "Map of DynamoDB table names"
  value = {
    grocery_list           = module.dynamodb.grocery_list_name
    grocery_items_defaults = module.dynamodb.grocery_items_defaults_name
    noise_tracking         = module.dynamodb.noise_tracking_name
    todo_list              = module.dynamodb.todo_list_name
  }
}
