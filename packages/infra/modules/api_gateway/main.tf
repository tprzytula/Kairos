locals {
  process_yaml = { for file in ["grocery_list", "noise_tracking", "todo_list"] :
    file => yamldecode(templatefile("${path.module}/policies/${file}.yml", { lambda_functions = var.lambda_functions }))
  }
}

resource "aws_api_gateway_rest_api" "rest_api" {
  name = "kairos-rest-api"
  body = yamlencode({
    openapi = "3.0.1"
    info = {
      title = "Kairos API"
      description = "API for Kairos"
      version = "1.0"
    }
    paths = merge(
      local.process_yaml["grocery_list"].paths,
      local.process_yaml["noise_tracking"].paths,
      local.process_yaml["todo_list"].paths
    )
    components = {
      schemas = merge(
        local.process_yaml["grocery_list"].components.schemas,
        local.process_yaml["noise_tracking"].components.schemas,
        local.process_yaml["todo_list"].components.schemas
      )
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

resource "aws_lambda_permission" "rest_api_lambda_permissions" {
  for_each = var.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway-test"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = format("%s/*/*", aws_api_gateway_rest_api.rest_api.execution_arn)
}

resource "aws_api_gateway_deployment" "rest_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "rest_api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  deployment_id = aws_api_gateway_deployment.rest_api_deployment.id

  stage_name = "v1"
}