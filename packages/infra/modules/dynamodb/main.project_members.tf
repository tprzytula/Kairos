resource "aws_dynamodb_table" "project_members" {
  name           = "ProjectMembers"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "projectId"
  range_key      = "userId"

  attribute {
    name = "projectId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserProjectsIndex"
    hash_key        = "userId"
    range_key       = "projectId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "ProjectMembersIndex"
    hash_key        = "projectId"
    range_key       = "userId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}
