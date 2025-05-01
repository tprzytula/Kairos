output "grocery_list_arn" {
  value = aws_dynamodb_table.grocery_list.arn
}

output "noise_tracking_arn" {
  value = aws_dynamodb_table.noise_tracking.arn
}

output "grocery_items_defaults_arn" {
  value = aws_dynamodb_table.grocery_items_defaults.arn
}
