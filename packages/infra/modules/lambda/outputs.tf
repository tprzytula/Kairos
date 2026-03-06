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
      "get_recipe_upload_url" = {
        invoke_arn    = aws_lambda_function.get_recipe_upload_url.invoke_arn
        function_arn  = aws_lambda_function.get_recipe_upload_url.arn
        function_name = aws_lambda_function.get_recipe_upload_url.function_name
        iam_role_name = aws_iam_role.get_recipe_upload_url_role.name
        permissions = {
          database = { push_subscriptions = "none" }
          s3       = { recipe_uploads = "put-only" }
          sns      = { todo_notifications = "none" }
        }
      }
    }
  )
}

output "stream_agent_message_url" {
  value = aws_lambda_function_url.stream_agent_message.function_url
}
