resource "aws_dynamodb_table" "projects" {
  name           = "Projects"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "ownerId"
    type = "S"
  }

  attribute {
    name = "inviteCode"
    type = "S"
  }

  global_secondary_index {
    name            = "OwnerIndex"
    hash_key        = "ownerId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "InviteCodeIndex"
    hash_key        = "inviteCode"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }
}
