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

# Upload URL functions — kept outside the main for_each loop to avoid dependency
# cycles with var.s3_cloudfront_domain (which comes from the CloudFront distribution).
resource "aws_iam_role" "upload_url_roles" {
  for_each = local.upload_url_functions

  name               = format("%s_lambda_role_%s", each.key, var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "upload_url_functions" {
  for_each = local.upload_url_functions

  function_name     = format("%s_%s", each.key, var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = format("%s/%s.zip", each.key, each.key)
  s3_object_version = data.aws_s3_object.upload_url_zips[each.key].version_id
  role              = aws_iam_role.upload_url_roles[each.key].arn
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
