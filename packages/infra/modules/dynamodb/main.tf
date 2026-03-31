resource "aws_dynamodb_table" "this" {
  for_each = local.table_configs

  name         = each.value.table_name
  billing_mode = each.value.billing_mode
  hash_key     = each.value.hash_key

  read_capacity  = each.value.billing_mode == "PROVISIONED" ? 1 : null
  write_capacity = each.value.billing_mode == "PROVISIONED" ? 1 : null

  range_key = each.value.range_key != null ? each.value.range_key.name : null

  dynamic "attribute" {
    for_each = local.table_attributes[each.key]
    content {
      name = attribute.key
      type = attribute.value
    }
  }

  dynamic "global_secondary_index" {
    for_each = { for gsi in each.value.gsis : gsi.name => gsi }
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = global_secondary_index.value.range_key
      projection_type = "ALL"
      read_capacity   = each.value.billing_mode == "PROVISIONED" ? 1 : null
      write_capacity  = each.value.billing_mode == "PROVISIONED" ? 1 : null
    }
  }

  tags = each.value.tags
}
