locals {
  s3_bucket_name = format("kairos-lambdas-%s", var.random_name)

  lambda_functions = {
    "get_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-only"
        }
      }
    }
    "add_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          grocery_items_defaults = "read-only"
        }
      }
    }
    "delete_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
        }
      }
    }
    "delete_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
        }
      }
    }
    "add_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
        }
      }
    }
    "get_noise_tracking_items" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-only"
        }
      }
    }
    "delete_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
        }
      }
    },
    "get_grocery_items_defaults" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_items_defaults = "read-only"
        }
      }
    },
    "add_todo_item" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
        }
      }
    },
    "get_todo_items" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-only"
        }
      }
    },
    "delete_todo_item" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
        }
      }
    },
    "update_todo_items" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
        }
      }
    },
    "update_todo_item" = {
      environment_variables = {}
      permissions = {
        database = {
          todo_list = "read-write"
        }
      }
    },
    "update_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
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
      }
    }
  }
  }
}