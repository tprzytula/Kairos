resource "aws_iam_role" "web_identity_github_role" {
  name = "web_identity_github_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Sid    = "WebIdentityGithubRole"
        Principal = {
          Federated = format("arn:aws:iam::%s:oidc-provider/token.actions.githubusercontent.com", data.aws_caller_identity.current.account_id)
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub" = format("repo:%s/%s:*", local.github_organisation, local.github_kairos_repository_name)
          }
        }
      },
    ]
  })
}

resource "aws_iam_policy" "s3_kairos_web_put_acl_policy" {
  name   = format("s3_kairos_web_put_acl_policy_%s", var.random_name)
  policy = data.aws_iam_policy_document.s3_kairos_web_put_acl.json
}

resource "aws_iam_role_policy_attachment" "s3_kairos_web_put_acl_policy_role_attachment" {
  role       = aws_iam_role.web_identity_github_role.name
  policy_arn = aws_iam_policy.s3_kairos_web_put_acl_policy.arn
}

resource "aws_iam_policy" "s3_kairos_lambdas_put_acl_policy" {
  name   = format("s3_kairos_lambdas_put_acl_policy_%s", var.random_name)
  policy = data.aws_iam_policy_document.s3_kairos_lambdas_put_acl.json
}

resource "aws_iam_role_policy_attachment" "s3_kairos_lambdas_put_acl_policy_role_attachment" {
  role       = aws_iam_role.web_identity_github_role.name
  policy_arn = aws_iam_policy.s3_kairos_lambdas_put_acl_policy.arn
}
