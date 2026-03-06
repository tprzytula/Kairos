data "aws_iam_policy_document" "basic_lambda_role" {
  statement {
    sid = "RoleForBasicLambdaOperations"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com"
      ]
    }
    effect = "Allow"
  }
}

data "aws_s3_object" "lambdas_s3_zips" {
  for_each = local.lambda_functions

  bucket = local.s3_bucket_name
  key    = format("%s/%s.zip", each.key, each.key)
}

data "aws_s3_object" "get_recipe_upload_url_zip" {
  bucket = local.s3_bucket_name
  key    = "get_recipe_upload_url/get_recipe_upload_url.zip"
}
