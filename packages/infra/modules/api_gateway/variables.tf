variable "random_name" {
  type = string
}

variable "lambda_functions" {
  type = map(object({
    invoke_arn : string,
    function_name : string
  }))
}

variable "cognito_user_pool_arn" {
  description = "ARN of the Cognito User Pool for API Gateway authorization"
  type        = string
}
