locals {
  openapi_files = {
    for file in fileset("${path.module}/openapi", "*.yml") :
    trimsuffix(file, ".yml") => trimsuffix(file, ".yml")
  }

  openapi_specs = {
    for spec in local.openapi_files :
    spec => yamldecode(
      templatefile(
        "${path.module}/openapi/${spec}.yml",
        { 
          lambda_functions = var.lambda_functions
          cognito_user_pool_arn = var.cognito_user_pool_arn
        }
      )
    )
  }

  merged_paths = merge([
    for spec in local.openapi_files :
    local.openapi_specs[spec].paths
  ]...)
  
  merged_schemas = merge([
    for spec in local.openapi_files :
    local.openapi_specs[spec].components.schemas
  ]...)

  merged_components = {
    schemas = local.merged_schemas
  }
}
