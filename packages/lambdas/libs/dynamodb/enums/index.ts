export enum DynamoDBTable {
  GROCERY_LIST = "GroceryList",
  GROCERY_ITEMS_DEFAULTS = "GroceryItemsDefaults",
  NOISE_TRACKING = "NoiseTracking",
  TODO_LIST = "TodoList",
  MIGRATIONS = "Migrations",
}

export enum DynamoDBIndex {
  GROCERY_LIST_NAME_UNIT = "NameUnitIndex",
}

export enum GroceryItemUnit {
  BAG = 'bag(s)',
  BOTTLE = 'bottle(s)',
  BOX = 'box(es)',
  CAN = 'can(s)',
  GRAM = 'gram(s)',
  KILOGRAM = 'kg',
  LITER = 'liter(s)',
  MILLILITER = 'ml(s)',
  ROLL = 'roll(s)',
  UNIT = 'unit(s)',
}
