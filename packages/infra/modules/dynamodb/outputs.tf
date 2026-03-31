output "table_arns" {
  description = "Map of table name to ARN for all DynamoDB tables"
  value       = { for name, table in aws_dynamodb_table.this : name => table.arn }
}
