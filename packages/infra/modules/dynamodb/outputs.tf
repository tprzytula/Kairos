output "grocery_list_arn" {
  value = aws_dynamodb_table.grocery_list.arn
}

output "noise_tracking_arn" {
  value = aws_dynamodb_table.noise_tracking.arn
}

output "grocery_items_defaults_arn" {
  value = aws_dynamodb_table.grocery_items_defaults.arn
}

output "todo_list_arn" {
  value = aws_dynamodb_table.todo_list.arn
}

output "migrations_arn" {
  value = aws_dynamodb_table.migrations.arn
}

output "projects_arn" {
  value = aws_dynamodb_table.projects.arn
}

output "project_members_arn" {
  value = aws_dynamodb_table.project_members.arn
}
