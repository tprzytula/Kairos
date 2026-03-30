output "lambda_functions" {
  value = merge(
    {
      for lambda_name, value in local.lambda_functions :
      lambda_name => {
        invoke_arn    = aws_lambda_function.lambda_functions[lambda_name].invoke_arn,
        function_arn  = aws_lambda_function.lambda_functions[lambda_name].arn,
        function_name = aws_lambda_function.lambda_functions[lambda_name].function_name
        iam_role_name = aws_iam_role.lambda_roles[lambda_name].name
        permissions   = value.permissions
      }
    },
    {
      for func_name, config in local.upload_url_functions :
      func_name => {
        invoke_arn    = aws_lambda_function.upload_url_functions[func_name].invoke_arn
        function_arn  = aws_lambda_function.upload_url_functions[func_name].arn
        function_name = aws_lambda_function.upload_url_functions[func_name].function_name
        iam_role_name = aws_iam_role.upload_url_roles[func_name].name
        permissions = {
          database = { push_subscriptions = "none" }
          s3       = { (config.s3_permission) = "put-only" }
          sns      = { todo_notifications = "none" }
        }
      }
    }
  )
}

