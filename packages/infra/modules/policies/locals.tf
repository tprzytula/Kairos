locals {
  github_organisation           = "tprzytula"
  github_kairos_repository_name = "Kairos"

  database_read_only_actions = [
    "dynamodb:GetItem",
    "dynamodb:Scan",
    "dynamodb:Query",
  ]

  database_read_write_actions = [
    "dynamodb:DeleteItem",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:Scan",
    "dynamodb:UpdateItem",
    "dynamodb:BatchWriteItem",
    "dynamodb:Query",
  ]

  permissions = {
    read_only  = "read-only"
    read_write = "read-write"
    none       = "none"
  }
}
