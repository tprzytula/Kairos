resource "aws_api_gateway_rest_api" "kairos_api" {
  name = "kairos-rest-api"
  body = yamlencode({
    openapi = "3.0.1"
    info = {
      title = "Kairos API"
      description = "API for Kairos"
      version = "1.0"
    }
    paths = local.merged_paths
    components = {
      schemas = local.merged_schemas
    }
    x-amazon-apigateway-request-validators = {
      "Validate body" = {
        validateRequestParameters = false
        validateRequestBody = true
      }
    }
    x-amazon-apigateway-gateway-responses = {
      DEFAULT_4XX = {
        responseParameters = {
          "gatewayresponse.header.Access-Control-Allow-Origin" = "'*'"
          "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID'"
          "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,DELETE,PATCH,OPTIONS'"
        }
        responseTemplates = {
          "application/json" = jsonencode({
            error = {
              message = "$context.error.message"
              type = "$context.error.responseType"
            }
          })
        }
      }
      DEFAULT_5XX = {
        responseParameters = {
          "gatewayresponse.header.Access-Control-Allow-Origin" = "'*'"
          "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID'"
          "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,DELETE,PATCH,OPTIONS'"
        }
        responseTemplates = {
          "application/json" = jsonencode({
            error = {
              message = "$context.error.message"
              type = "$context.error.responseType"
            }
          })
        }
      }
      UNAUTHORIZED = {
        responseParameters = {
          "gatewayresponse.header.Access-Control-Allow-Origin" = "'*'"
          "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID'"
          "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,DELETE,PATCH,OPTIONS'"
        }
        responseTemplates = {
          "application/json" = jsonencode({
            error = {
              message = "Unauthorized"
              type = "UNAUTHORIZED"
            }
          })
        }
      }
    }
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Cognito User Pool Authorizer
resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name                   = "cognito-authorizer"
  rest_api_id           = aws_api_gateway_rest_api.kairos_api.id
  type                  = "COGNITO_USER_POOLS"
  provider_arns         = [var.cognito_user_pool_arn]
  identity_source       = "method.request.header.Authorization"
}

resource "aws_lambda_permission" "kairos_api_lambda_permissions" {
  for_each = var.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway-test"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = format("%s/*/*", aws_api_gateway_rest_api.kairos_api.execution_arn)
}

resource "aws_api_gateway_deployment" "kairos_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.kairos_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.kairos_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "kairos_api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.kairos_api.id
  deployment_id = aws_api_gateway_deployment.kairos_api_deployment.id

  stage_name = "v1"
}