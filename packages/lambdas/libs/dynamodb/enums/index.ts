export enum DynamoDBTable {
  GROCERY_LIST = "GroceryList",
  GROCERY_ITEMS_DEFAULTS = "GroceryItemsDefaults",
  NOISE_TRACKING = "NoiseTracking",
  TODO_LIST = "TodoList",
}

export enum DynamoDBIndex {
  GROCERY_LIST_NAME_UNIT = "NameUnitIndex",
}

export enum GroceryItemUnit {
  BAG = 'bag(s)',
  BOTTLE = 'bottle(s)',
  BOX = 'box(es)',
  CAN = 'can(s)',
  GRAM = 'g',
  KILOGRAM = 'kg',
  LITER = 'l',
  MILLILITER = 'ml',
  UNIT = 'unit(s)',
}
