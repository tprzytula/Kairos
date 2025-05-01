locals {
  s3_bucket_name = format("kairos-web-lambdas-%s", var.random_name)

  lambda_functions = {
    "get_grocery_list" = {
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
  }
}
