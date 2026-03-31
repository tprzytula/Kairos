moved {
  from = aws_dynamodb_table.adventures
  to   = aws_dynamodb_table.this["adventures"]
}

moved {
  from = aws_dynamodb_table.birthdays
  to   = aws_dynamodb_table.this["birthdays"]
}

moved {
  from = aws_dynamodb_table.grocery_items_defaults
  to   = aws_dynamodb_table.this["grocery_items_defaults"]
}

moved {
  from = aws_dynamodb_table.grocery_list
  to   = aws_dynamodb_table.this["grocery_list"]
}

moved {
  from = aws_dynamodb_table.meal_plans
  to   = aws_dynamodb_table.this["meal_plans"]
}

moved {
  from = aws_dynamodb_table.migrations
  to   = aws_dynamodb_table.this["migrations"]
}

moved {
  from = aws_dynamodb_table.noise_tracking
  to   = aws_dynamodb_table.this["noise_tracking"]
}

moved {
  from = aws_dynamodb_table.project_members
  to   = aws_dynamodb_table.this["project_members"]
}

moved {
  from = aws_dynamodb_table.projects
  to   = aws_dynamodb_table.this["projects"]
}

moved {
  from = aws_dynamodb_table.push_subscriptions
  to   = aws_dynamodb_table.this["push_subscriptions"]
}

moved {
  from = aws_dynamodb_table.recipes
  to   = aws_dynamodb_table.this["recipes"]
}

moved {
  from = aws_dynamodb_table.shops
  to   = aws_dynamodb_table.this["shops"]
}

moved {
  from = aws_dynamodb_table.todo_list
  to   = aws_dynamodb_table.this["todo_list"]
}

moved {
  from = aws_dynamodb_table.user_preferences
  to   = aws_dynamodb_table.this["user_preferences"]
}
