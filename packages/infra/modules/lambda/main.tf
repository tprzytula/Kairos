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

# Standalone resource — kept outside the for_each loop to avoid dependency cycles
# with var.s3_cloudfront_domain (which comes from the CloudFront distribution).
resource "aws_iam_role" "get_recipe_upload_url_role" {
  name               = format("get_recipe_upload_url_lambda_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_iam_role" "get_shop_upload_url_role" {
  name               = format("get_shop_upload_url_lambda_role_%s", var.random_name)
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

resource "aws_lambda_function" "get_shop_upload_url" {
  function_name     = format("get_shop_upload_url_%s", var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = "get_shop_upload_url/get_shop_upload_url.zip"
  s3_object_version = data.aws_s3_object.get_shop_upload_url_zip.version_id
  role              = aws_iam_role.get_shop_upload_url_role.arn
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

resource "aws_iam_role" "get_meal_plan_upload_url_role" {
  name               = format("get_meal_plan_upload_url_lambda_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "get_meal_plan_upload_url" {
  function_name     = format("get_meal_plan_upload_url_%s", var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = "get_meal_plan_upload_url/get_meal_plan_upload_url.zip"
  s3_object_version = data.aws_s3_object.get_meal_plan_upload_url_zip.version_id
  role              = aws_iam_role.get_meal_plan_upload_url_role.arn
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

resource "aws_iam_role" "get_adventure_upload_url_role" {
  name               = format("get_adventure_upload_url_lambda_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "get_adventure_upload_url" {
  function_name     = format("get_adventure_upload_url_%s", var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = "get_adventure_upload_url/get_adventure_upload_url.zip"
  s3_object_version = data.aws_s3_object.get_adventure_upload_url_zip.version_id
  role              = aws_iam_role.get_adventure_upload_url_role.arn
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

resource "aws_iam_role" "get_grocery_default_upload_url_role" {
  name               = format("get_grocery_default_upload_url_lambda_role_%s", var.random_name)
  assume_role_policy = data.aws_iam_policy_document.basic_lambda_role.json
}

resource "aws_lambda_function" "get_grocery_default_upload_url" {
  function_name     = format("get_grocery_default_upload_url_%s", var.random_name)
  s3_bucket         = local.s3_bucket_name
  s3_key            = "get_grocery_default_upload_url/get_grocery_default_upload_url.zip"
  s3_object_version = data.aws_s3_object.get_grocery_default_upload_url_zip.version_id
  role              = aws_iam_role.get_grocery_default_upload_url_role.arn
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
