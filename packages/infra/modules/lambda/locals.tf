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
    }
  }
}