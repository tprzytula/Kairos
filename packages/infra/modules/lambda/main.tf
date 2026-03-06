resource "aws_iam_role" "lambda_roles" {
  for_each = local.lambda_functions

  name               = format("%s_lambda_role_%s", each.key, var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "lambda_functions" {
  for_each = local.lambda_functions

  function_name     = format("%s_%s", each.key, var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = format("%s/%s.zip", each.key, each.key)
  s3_object_version = data.aws_s3_object.lambdas_s3_zips[each.key].version_id
  role              = aws_iam_role.lambda_roles[each.key].arn
  handler           = "index.handler"
  runtime           = "nodejs20.x"
  memory_size       = "512"
  publish           = true
  timeout           = lookup(each.value, "timeout", 5)

  dynamic "environment" {
    for_each = length(keys(each.value.environment_variables)) > 0 ? [each.value.environment_variables] : []
    content {
      variables = environment.value
    }
  }
}

resource "aws_lambda_function_url" "stream_agent_message" {
  function_name      = aws_lambda_function.lambda_functions["stream_agent_message"].function_name
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["Content-Type", "Authorization"]
    max_age           = 300
  }
}

resource "aws_lambda_permission" "stream_agent_message_public" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.lambda_functions["stream_agent_message"].function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "stream_agent_message_invoke" {
  statement_id  = "FunctionURLAllowInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_functions["stream_agent_message"].function_name
  principal     = "*"
}

# Standalone resource — kept outside the for_each loop so that its dependency
# on var.s3_cloudfront_domain (which comes from the CloudFront distribution
# that itself needs stream_agent_message_url) does not form a cycle.
resource "aws_iam_role" "get_recipe_upload_url_role" {
  name               = format("get_recipe_upload_url_lambda_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "get_recipe_upload_url" {
  function_name     = format("get_recipe_upload_url_%s", var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = "get_recipe_upload_url/get_recipe_upload_url.zip"
  s3_object_version = data.aws_s3_object.get_recipe_upload_url_zip.version_id
  role              = aws_iam_role.get_recipe_upload_url_role.arn
  handler           = "index.handler"
  runtime           = "nodejs20.x"
  memory_size       = "512"
  publish           = true
  timeout           = 5

  environment {
    variables = {
      UPLOAD_BUCKET_NAME = var.s3_kairos_web_bucket_name
      CLOUDFRONT_DOMAIN  = var.s3_cloudfront_domain
    }
  }
}
