resource "aws_dynamodb_table" "grocery_items_icons" {
  name           = "GroceryItemsIcons"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "name"

  attribute {
    name = "name"
    type = "S"
  }
}

resource "aws_dynamodb_table_item" "grocery_items_icons_entries" {
  for_each = {
    apple   = { name = "apple", iconPath = "/assets/icons/apple.png" }
    avocado = { name = "avocado", iconPath = "/assets/icons/avocado.png" }
    banana  = { name = "banana", iconPath = "/assets/icons/banana.png" }
    beef    = { name = "beef", iconPath = "/assets/icons/beef.png" }
    bread   = { name = "bread", iconPath = "/assets/icons/bread.png" }
    carrot  = { name = "carrot", iconPath = "/assets/icons/carrot.png" }
    cereal  = { name = "cereal", iconPath = "/assets/icons/cereal.png" }
    cheese  = { name = "cheese", iconPath = "/assets/icons/cheese.png" }
    chicken = { name = "chicken", iconPath = "/assets/icons/chicken.png" }
    coffee  = { name = "coffee", iconPath = "/assets/icons/coffee.png" }
    cookie  = { name = "cookie", iconPath = "/assets/icons/cookie.png" }
    eggs    = { name = "eggs", iconPath = "/assets/icons/eggs.png" }
    fish    = { name = "fish", iconPath = "/assets/icons/fish.png" }
    lettuce = { name = "lettuce", iconPath = "/assets/icons/lettuce.png" }
    milk    = { name = "milk", iconPath = "/assets/icons/milk.png" }
    onion   = { name = "onion", iconPath = "/assets/icons/onion.png" }
    pasta   = { name = "pasta", iconPath = "/assets/icons/pasta.png" }
    potato  = { name = "potato", iconPath = "/assets/icons/potato.png" }
    rice    = { name = "rice", iconPath = "/assets/icons/rice.png" }
    tea     = { name = "tea", iconPath = "/assets/icons/tea.png" }
    tomato  = { name = "tomato", iconPath = "/assets/icons/tomato.png" }
    yogurt  = { name = "yogurt", iconPath = "/assets/icons/yogurt.png" }
  }

  table_name = aws_dynamodb_table.grocery_items_icons.name
  hash_key   = each.value.name

  item = jsonencode({
    name     = each.value.name
    iconPath = each.value.iconPath
  })
}
