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
    for_each = each.value.permissions.database.grocery_list == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnly"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_grocery_list_arn,
        "${var.dynamodb_grocery_list_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.grocery_items_defaults == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnly"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_grocery_items_defaults_arn,
        "${var.dynamodb_grocery_items_defaults_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.noise_tracking == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnly"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_noise_tracking_arn,
        "${var.dynamodb_noise_tracking_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.todo_list == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnly"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_todo_list_arn,
        "${var.dynamodb_todo_list_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.grocery_list == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWrite"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_grocery_list_arn,
        "${var.dynamodb_grocery_list_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.grocery_items_defaults == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWrite"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_grocery_items_defaults_arn,
        "${var.dynamodb_grocery_items_defaults_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.noise_tracking == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWrite"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_noise_tracking_arn,
        "${var.dynamodb_noise_tracking_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.todo_list == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWrite"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_todo_list_arn,
        "${var.dynamodb_todo_list_arn}/index/*",
      ]
    }
  }
}
