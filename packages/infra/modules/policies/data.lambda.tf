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
    resources = ["*"]
  }

  dynamic "statement" {
    for_each = {
      grocery_list           = var.dynamodb_grocery_list_arn
      grocery_items_defaults = var.dynamodb_grocery_items_defaults_arn
      noise_tracking         = var.dynamodb_noise_tracking_arn
      todo_list              = var.dynamodb_todo_list_arn
    }

    content {
      sid     = each.value.permissions.database[each.key] == local.permissions.read_only ? "DatabaseReadOnly" : "DatabaseReadWrite"
      actions = each.value.permissions.database[each.key] == local.permissions.read_only ? local.database_read_only_actions : local.database_read_write_actions
      effect  = "Allow"
      resources = [
        each.value,
        "${each.value}/index/*"
      ]
    }
  }
}
