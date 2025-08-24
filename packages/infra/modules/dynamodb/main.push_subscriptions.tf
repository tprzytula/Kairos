resource "aws_dynamodb_table" "push_subscriptions" {
  name           = "PushSubscriptions"
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

  global_secondary_index {
    name            = "UserPushSubscriptionsIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name = format("kairos-push-subscriptions-%s", var.random_name)
  }
}
