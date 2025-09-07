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
      sid     = "DatabaseReadOnlyGroceryList"
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
      sid     = "DatabaseReadOnlyGroceryItemsDefaults"
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
      sid     = "DatabaseReadOnlyNoiseTracking"
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
      sid     = "DatabaseReadOnlyTodoList"
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
      sid     = "DatabaseReadWriteGroceryList"
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
      sid     = "DatabaseReadWriteGroceryItemsDefaults"
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
      sid     = "DatabaseReadWriteNoiseTracking"
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
      sid     = "DatabaseReadWriteTodoList"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_todo_list_arn,
        "${var.dynamodb_todo_list_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.migrations == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyMigrations"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_migrations_arn,
        "${var.dynamodb_migrations_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.migrations == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteMigrations"
      actions = concat(local.database_read_write_actions, ["dynamodb:CreateTable"])
      effect  = "Allow"
      resources = [
        var.dynamodb_migrations_arn,
        "${var.dynamodb_migrations_arn}/index/*",
        "arn:aws:dynamodb:*:*:table/Migrations"
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.projects == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyProjects"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_projects_arn,
        "${var.dynamodb_projects_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.projects == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteProjects"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_projects_arn,
        "${var.dynamodb_projects_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.project_members == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyProjectMembers"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_project_members_arn,
        "${var.dynamodb_project_members_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.project_members == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteProjectMembers"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_project_members_arn,
        "${var.dynamodb_project_members_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.user_preferences == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyUserPreferences"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_user_preferences_arn,
        "${var.dynamodb_user_preferences_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.user_preferences == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteUserPreferences"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_user_preferences_arn,
        "${var.dynamodb_user_preferences_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.push_subscriptions == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyPushSubscriptions"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_push_subscriptions_arn,
        "${var.dynamodb_push_subscriptions_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.push_subscriptions == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWritePushSubscriptions"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_push_subscriptions_arn,
        "${var.dynamodb_push_subscriptions_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.shops == local.permissions.read_only ? [each.key] : []

    content {
      sid     = "DatabaseReadOnlyShops"
      actions = local.database_read_only_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_shops_arn,
        "${var.dynamodb_shops_arn}/index/*",
      ]
    }
  }

  dynamic "statement" {
    for_each = each.value.permissions.database.shops == local.permissions.read_write ? [each.key] : []

    content {
      sid     = "DatabaseReadWriteShops"
      actions = local.database_read_write_actions
      effect  = "Allow"
      resources = [
        var.dynamodb_shops_arn,
        "${var.dynamodb_shops_arn}/index/*",
      ]
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
