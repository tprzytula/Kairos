data "aws_iam_policy_document" "s3_kairos_web_put_acl" {
  statement {
    sid = "S3KairosWebPutACL"
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    effect = "Allow"
    resources = [
      var.s3_kairos_web_arn,
      format("%s/*", var.s3_kairos_web_arn)
    ]
  }
}

data "aws_iam_policy_document" "s3_kairos_lambdas_put_acl" {
  statement {
    sid = "S3KairosLambdasPutACL"
    actions = [
      "s3:PutObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    effect = "Allow"
    resources = [
      var.s3_kairos_lambdas_arn,
      format("%s/*", var.s3_kairos_lambdas_arn)
    ]
  }
}

data "aws_iam_policy_document" "cloudfront_kairos_web" {
  statement {
    sid = "CloudFrontKairosWebAccess"
    actions = [
      "cloudfront:ListDistributions",
      "cloudfront:GetDistribution",
      "cloudfront:CreateInvalidation"
    ]
    effect = "Allow"
    resources = ["*"]
  }
}
