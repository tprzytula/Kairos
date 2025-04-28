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
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }
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