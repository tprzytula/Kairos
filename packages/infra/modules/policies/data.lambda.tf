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

  # Read-only database permissions (standard tables)
  dynamic "statement" {
    for_each = {
      for table, config in local.dynamodb_table_config :
      table => config
      if table != "migrations" && each.value.permissions.database[table] == local.permissions.read_only
    }

    content {
      sid     = "DatabaseReadOnly${statement.value.sid}"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        statement.value.arn,
        "${statement.value.arn}/index/*",
      ]
    }
  }

  # Read-write database permissions (standard tables)
  dynamic "statement" {
    for_each = {
      for table, config in local.dynamodb_table_config :
      table => config
      if table != "migrations" && each.value.permissions.database[table] == local.permissions.read_write
    }

    content {
      sid     = "DatabaseReadWrite${statement.value.sid}"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        statement.value.arn,
        "${statement.value.arn}/index/*",
      ]
    }
  }

  # Migrations table (special: read-only uses standard pattern)
  dynamic "statement" {
    for_each = each.value.permissions.database.migrations == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyMigrations"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_table_arns["migrations"],
        "${var.dynamodb_table_arns["migrations"]}/index/*",
      ]
    }
  }

  # Migrations table (special: read-write has extra CreateTable action and wildcard resource)
  dynamic "statement" {
    for_each = each.value.permissions.database.migrations == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteMigrations"
      actions = concat(local.database_read_write_actions, ["dynamodb:CreateTable"])
      effect  = "Allow"
      resources = [
        var.dynamodb_table_arns["migrations"],
        "${var.dynamodb_table_arns["migrations"]}/index/*",
        "arn:aws:dynamodb:*:*:table/Migrations"
      ]
    }
  }

  # S3 upload permissions
  dynamic "statement" {
    for_each = {
      for upload, config in local.s3_upload_config :
      upload => config
      if try(each.value.permissions.s3[upload], "none") == "put-only"
    }

    content {
      sid       = "S3Put${statement.value.sid}"
      actions   = ["s3:PutObject"]
      effect    = "Allow"
      resources = ["${var.s3_kairos_web_arn}/user-uploads/${statement.value.path}/*"]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.sns.todo_notifications == local.permissions.publish ? [each.key] : []

    content {
      sid     = "SNSPublishTodoNotifications"
      actions = ["sns:Publish"]
      effect  = "Allow"
      resources = [
        var.sns_todo_notifications_arn
      ]
    }
  }
}
