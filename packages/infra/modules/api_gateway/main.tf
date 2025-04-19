resource "aws_api_gateway_rest_api" "rest_api" {
  name = "kairos-rest-api"
  body = templatefile("${path.module}/policies/kairos.yml", {
    add_grocery_item    = var.lambda_functions["add_grocery_item"].invoke_arn,
    get_grocery_items   = var.lambda_functions["get_grocery_items"].invoke_arn,
    delete_grocery_item = var.lambda_functions["delete_grocery_item"].invoke_arn
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