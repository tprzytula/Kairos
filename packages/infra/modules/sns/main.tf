resource "aws_sns_topic" "todo_notifications" {
  name = format("kairos-todo-notifications-%s", var.random_name)
}

resource "aws_sns_topic_subscription" "todo_notification_lambda" {
  topic_arn = aws_sns_topic.todo_notifications.arn
  protocol  = "lambda"
  endpoint  = var.notification_lambda_arn
}

resource "aws_lambda_permission" "allow_sns_invoke_notification_lambda" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = var.notification_lambda_function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.todo_notifications.arn
}
