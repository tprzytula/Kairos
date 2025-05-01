locals {
  s3_bucket_name = format("kairos-lambdas-%s", var.random_name)

  lambda_functions = {
    "get_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-only"
          grocery_items_defaults = "none"
          noise_tracking = "none"
          todo_list = "none"
        }
      }
    }
    "add_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          grocery_items_defaults = "none"
          noise_tracking = "none"
          todo_list = "none"
        }
      }
    }
    "delete_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          grocery_items_defaults = "none"
          noise_tracking = "none"
          todo_list = "none"
        }
      }
    }
    "delete_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_list = "read-write"
          grocery_items_defaults = "none"
          noise_tracking = "none"
          todo_list = "none"
        }
      }
    }
    "add_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
          grocery_list = "none"
          grocery_items_defaults = "none"
          todo_list = "none"
        }
      }
    }
    "get_noise_tracking_items" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-only"
          grocery_list = "none"
          grocery_items_defaults = "none"
          todo_list = "none"
        }
      }
    }
    "delete_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = {
          noise_tracking = "read-write"
          grocery_list = "none"
          grocery_items_defaults = "none"
          todo_list = "none"
        }
      }
    },
    "get_grocery_items_defaults" = {
      environment_variables = {}
      permissions = {
        database = {
          grocery_items_defaults = "read-only"
          grocery_list = "none"
          noise_tracking = "none"
          todo_list = "none"
        }
      }
    }
  }
}
