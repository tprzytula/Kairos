data "aws_iam_policy_document" "lambda_policies" {
  for_each = var.lambda_functions

  statement {
    sid = "RoleForBasicLambdaLogs"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    effect = "Allow"
    resources = [
      "*"
    ]
  }

  dynamic "statement" {
    for_each = each.value.permissions.database == "read-only" ? [each.key] : []

    content {
      sid = "DatabaseReadOnly"
      actions = [
        "dynamodb:GetItem",
        "dynamodb:Scan",
      ]
      effect = "Allow"
      resources = [
        var.dynamodb_grocery_list_arn
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database == "read-write" ? [each.key] : []

    content {
      sid = "DatabaseReadWrite"
      actions = [
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:BatchWriteItem",
      ]
      effect = "Allow"
      resources = [
        var.dynamodb_grocery_list_arn,
      ]
    }
  }
}
