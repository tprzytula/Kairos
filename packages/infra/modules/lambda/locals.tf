locals {
  s3_bucket_name = format("kairos-lambdas-%s", var.random_name)

  lambda_functions = {
    "get_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "add_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          grocery_items_defaults = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "delete_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "delete_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "add_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "get_noise_tracking_items" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
    "delete_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "get_grocery_items_defaults" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_items_defaults = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "add_todo_item" = {
      environment_variables = {
        TODO_NOTIFICATIONS_TOPIC_ARN = var.todo_notifications_topic_arn
      }
      permissions = {
        database = {
          todo_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "publish"
        }
      }
    },
    "get_todo_items" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "delete_todo_item" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "update_todo_items" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "update_todo_item" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "update_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "db_migrations" = {
      environment_variables = {}
      timeout               = 900
      permissions = {
        database = {
          migrations             = "read-write"
          grocery_items_defaults = "read-write"
          projects               = "read-write"
          grocery_list           = "read-write"
          todo_list              = "read-write"
          noise_tracking         = "read-write"
          push_subscriptions     = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "get_user_projects" = {
      environment_variables = {}
      permissions = {
        database = {
          projects = "read-only"
          project_members = "read-only"
        }
      }
    },
    "create_project" = {
      environment_variables = {}
      permissions = {
        database = {
          projects = "read-write"
          project_members = "read-write"
        }
      }
    },
    "join_project" = {
      environment_variables = {}
      permissions = {
        database = {
          projects = "read-only"
          project_members = "read-write"
        }
      }
    },
      "get_project_invite_info" = {
    environment_variables = {}
    permissions = {
      database = {
        projects = "read-only"
        project_members = "read-only"
        push_subscriptions = "none"
      }
      sns = {
        todo_notifications = "none"
      }
    }
  },
    "get_user_preferences" = {
      environment_variables = {}
      permissions = {
        database = {
          user_preferences = "read-only"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "update_user_preferences" = {
      environment_variables = {}
      permissions = {
        database = {
          user_preferences = "read-write"
          push_subscriptions = "none"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "send_todo_notifications" = {
      environment_variables = {}
      permissions = {
        database = {
          project_members = "read-only"
          projects = "read-only"
          push_subscriptions = "read-only"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "save_push_subscription" = {
      environment_variables = {}
      permissions = {
        database = {
          push_subscriptions = "read-write"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    },
    "delete_push_subscription" = {
      environment_variables = {}
      permissions = {
        database = {
          push_subscriptions = "read-write"
        }
        sns = {
          todo_notifications = "none"
        }
      }
    }
  }
}