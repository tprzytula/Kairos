resource "aws_dynamodb_table_item" "grocery_items_icons_entries" {
  for_each = { for icon in local.icons : icon => {
    name     = icon
    iconPath = "/${local.iconsPath}/${icon}.png"
  } }

  table_name = var.dynamodb_table_name
  hash_key   = each.value.name

  item = jsonencode({
    name     = { S = each.value.name }
    iconPath = { S = each.value.iconPath }
  })
}
