locals {
  s3_bucket_name = format("kairos-lambdas-%s", var.random_name)

  lambda_functions = {
    "get_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = "read-only"
      }
    }
    "add_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = "read-write"
      }
    }
    "delete_grocery_item" = {
      environment_variables = {}
      permissions = {
        database = "read-write"
      }
    }
    "delete_grocery_items" = {
      environment_variables = {}
      permissions = {
        database = "read-write"
      }
    }
    "get_grocery_items_icons" = {
      environment_variables = {}
      permissions = {
        database = "read-only"
      }
    }
    "get_grocery_items_default_units" = {
      environment_variables = {}
      permissions = {
        database = "read-only"
      }
    }
    "add_noise_tracking_item" = {
      environment_variables = {}
      permissions = {
        database = "read-write"
      }
    }
    "get_noise_tracking_items" = {
      environment_variables = {}
      permissions = {
        database = "read-only"
      }
    }
  }
}
