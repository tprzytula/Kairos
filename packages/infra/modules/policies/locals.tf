locals {
  github_organisation           = "tprzytula"
  github_kairos_repository_name = "Kairos"

  database_read_only_actions = [
    "GetItem",
    "Scan",
    "Query",
  ]

  database_read_write_actions = [
    "DeleteItem",
    "GetItem",
    "PutItem",
    "Scan",
    "UpdateItem",
    "BatchWriteItem",
    "Query",
  ]

  permissions = {
    read_only = "read-only"
    read_write = "read-write"
  }
}
