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
    },
    {
      "get_shop_upload_url" = {
        invoke_arn    = aws_lambda_function.get_shop_upload_url.invoke_arn
        function_arn  = aws_lambda_function.get_shop_upload_url.arn
        function_name = aws_lambda_function.get_shop_upload_url.function_name
        iam_role_name = aws_iam_role.get_shop_upload_url_role.name
        permissions = {
          database = { push_subscriptions = "none" }
          s3       = { shop_uploads = "put-only" }
          sns      = { todo_notifications = "none" }
        }
      }
    },
    {
      "get_adventure_upload_url" = {
        invoke_arn    = aws_lambda_function.get_adventure_upload_url.invoke_arn
        function_arn  = aws_lambda_function.get_adventure_upload_url.arn
        function_name = aws_lambda_function.get_adventure_upload_url.function_name
        iam_role_name = aws_iam_role.get_adventure_upload_url_role.name
        permissions = {
          database = { push_subscriptions = "none" }
          s3       = { adventure_uploads = "put-only" }
          sns      = { todo_notifications = "none" }
        }
      }
    },
    {
      "get_grocery_default_upload_url" = {
        invoke_arn    = aws_lambda_function.get_grocery_default_upload_url.invoke_arn
        function_arn  = aws_lambda_function.get_grocery_default_upload_url.arn
        function_name = aws_lambda_function.get_grocery_default_upload_url.function_name
        iam_role_name = aws_iam_role.get_grocery_default_upload_url_role.name
        permissions = {
          database = { push_subscriptions = "none" }
          s3       = { grocery_default_uploads = "put-only" }
          sns      = { todo_notifications = "none" }
        }
      }
    }
  )
}

