locals {
  # ─── Shared OpenAPI components (parameters, securitySchemes) ─────────

  shared_spec = yamldecode(
    templatefile("${path.module}/openapi/_shared.yml", {
      lambda_functions      = var.lambda_functions
      cognito_user_pool_arn = var.cognito_user_pool_arn
    })
  )

  # ─── Resource specs (everything except _-prefixed files) ─────────────

  resource_spec_files = {
    for file in fileset("${path.module}/openapi", "*.yml") :
    trimsuffix(file, ".yml") => trimsuffix(file, ".yml")
    if !startswith(file, "_")
  }

  openapi_specs = {
    for spec in local.resource_spec_files :
    spec => yamldecode(
      templatefile(
        "${path.module}/openapi/${spec}.yml",
        {
          lambda_functions      = var.lambda_functions
          cognito_user_pool_arn = var.cognito_user_pool_arn
        }
      )
    )
  }

  # ─── Path collision detection ────────────────────────────────────────

  all_path_entries = flatten([
    for spec_name, spec in local.openapi_specs : [
      for path_key, _ in spec.paths : {
        path = path_key
        spec = spec_name
      }
    ]
  ])

  paths_by_key    = { for e in local.all_path_entries : e.path => e.spec... }
  duplicate_paths = { for path, specs in local.paths_by_key : path => specs if length(specs) > 1 }

  # ─── Merged spec ─────────────────────────────────────────────────────

  merged_paths = merge([
    for spec in local.resource_spec_files :
    local.openapi_specs[spec].paths
  ]...)

  merged_schemas = merge([
    for spec in local.resource_spec_files :
    try(local.openapi_specs[spec].components.schemas, {})
  ]...)

  merged_parameters = merge(
    try(local.shared_spec.components.parameters, {}),
    [for spec in local.resource_spec_files :
      try(local.openapi_specs[spec].components.parameters, {})
    ]...
  )

  merged_security_schemes = try(local.shared_spec.components.securitySchemes, {})

  merged_components = {
    schemas         = local.merged_schemas
    parameters      = local.merged_parameters
    securitySchemes = local.merged_security_schemes
  }

  # ─── CORS ────────────────────────────────────────────────────────────

  cors_response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,DELETE,PATCH,OPTIONS'"
  }

  gateway_error_template = jsonencode({
    error = {
      message = "$context.error.message"
      type    = "$context.error.responseType"
    }
  })
}
