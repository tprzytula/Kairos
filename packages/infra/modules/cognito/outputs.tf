output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.kairos_user_pool.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.kairos_user_pool.arn
}

output "user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.kairos_user_pool_client.id
}

output "user_pool_client_secret" {
  description = "The secret of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.kairos_user_pool_client.client_secret
  sensitive   = true
}

output "user_pool_domain" {
  description = "The domain of the Cognito User Pool"
  value       = aws_cognito_user_pool_domain.kairos_domain.domain
}

output "user_pool_endpoint" {
  description = "The endpoint name of the Cognito User Pool"
  value       = aws_cognito_user_pool.kairos_user_pool.endpoint
}

# Useful for constructing OAuth URLs
output "hosted_ui_url" {
  description = "The hosted UI URL for the Cognito User Pool"
  value       = "https://${aws_cognito_user_pool_domain.kairos_domain.domain}.auth.${data.aws_region.current.name}.amazoncognito.com"
}

data "aws_region" "current" {}
