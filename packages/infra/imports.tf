# These resources were lost from Terraform state and need to be re-imported.
# Remove this file after a successful apply.

# ─── Upload URL IAM Roles ──────────────────────────────────────────────

import {
  to = module.lambda.aws_iam_role.upload_url_roles["get_recipe_upload_url"]
  id = "get_recipe_upload_url_lambda_role_5rndghxqgv"
}

import {
  to = module.lambda.aws_iam_role.upload_url_roles["get_adventure_upload_url"]
  id = "get_adventure_upload_url_lambda_role_5rndghxqgv"
}

import {
  to = module.lambda.aws_iam_role.upload_url_roles["get_meal_plan_upload_url"]
  id = "get_meal_plan_upload_url_lambda_role_5rndghxqgv"
}

import {
  to = module.lambda.aws_iam_role.upload_url_roles["get_shop_upload_url"]
  id = "get_shop_upload_url_lambda_role_5rndghxqgv"
}

import {
  to = module.lambda.aws_iam_role.upload_url_roles["get_grocery_default_upload_url"]
  id = "get_grocery_default_upload_url_lambda_role_5rndghxqgv"
}

# ─── Upload URL Lambda Functions ───────────────────────────────────────

import {
  to = module.lambda.aws_lambda_function.upload_url_functions["get_recipe_upload_url"]
  id = "get_recipe_upload_url_5rndghxqgv"
}

import {
  to = module.lambda.aws_lambda_function.upload_url_functions["get_adventure_upload_url"]
  id = "get_adventure_upload_url_5rndghxqgv"
}

import {
  to = module.lambda.aws_lambda_function.upload_url_functions["get_meal_plan_upload_url"]
  id = "get_meal_plan_upload_url_5rndghxqgv"
}

import {
  to = module.lambda.aws_lambda_function.upload_url_functions["get_shop_upload_url"]
  id = "get_shop_upload_url_5rndghxqgv"
}

import {
  to = module.lambda.aws_lambda_function.upload_url_functions["get_grocery_default_upload_url"]
  id = "get_grocery_default_upload_url_5rndghxqgv"
}
