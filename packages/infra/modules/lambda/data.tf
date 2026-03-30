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

data "aws_s3_object" "upload_url_zips" {
  for_each = local.upload_url_functions

  bucket = local.s3_bucket_name
  key    = format("%s/%s.zip", each.key, each.key)
}
