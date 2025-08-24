resource "aws_dynamodb_table" "push_subscriptions" {
  name           = format("push_subscriptions_%s", var.random_name)
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "endpoint"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "endpoint"
    type = "S"
  }

  tags = {
    Name = format("kairos-push-subscriptions-%s", var.random_name)
  }
}
