output "grocery_list_arn" {
  value = aws_dynamodb_table.grocery_list.arn
}

output "grocery_items_icons_arn" {
  value = aws_dynamodb_table.grocery_items_icons.arn
}

output "grocery_items_icons_name" {
  value = aws_dynamodb_table.grocery_items_icons.name
}
