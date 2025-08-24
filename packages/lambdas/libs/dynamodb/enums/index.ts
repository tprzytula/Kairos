export enum DynamoDBTable {
  GROCERY_LIST = "GroceryList",
  GROCERY_ITEMS_DEFAULTS = "GroceryItemsDefaults",
  NOISE_TRACKING = "NoiseTracking",
  TODO_LIST = "TodoList",
  MIGRATIONS = "Migrations",
  PROJECTS = "Projects",
  PROJECT_MEMBERS = "ProjectMembers",
  USER_PREFERENCES = "UserPreferences",
  PUSH_SUBSCRIPTIONS = "PushSubscriptions",
}

export enum DynamoDBIndex {
  GROCERY_LIST_NAME_UNIT = "NameUnitIndex",
  GROCERY_LIST_PROJECT = "ProjectItemsIndex",
  TODO_LIST_PROJECT = "ProjectTodosIndex",
  NOISE_TRACKING_PROJECT = "ProjectNoiseIndex",
  PROJECTS_OWNER = "OwnerIndex",
  PROJECTS_INVITE_CODE = "InviteCodeIndex",
  PROJECT_MEMBERS_USER_PROJECTS = "UserProjectsIndex",
  PROJECT_MEMBERS_PROJECT = "ProjectMembersIndex",
  PUSH_SUBSCRIPTIONS_USER = "UserPushSubscriptionsIndex",
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

export enum GroceryItemCategory {
  MEAT_POULTRY = "Meat & Poultry",
  DAIRY = "Dairy",
  FRUITS_VEGETABLES = "Fruits & Vegetables",
  BAKERY_GRAINS = "Bakery & Grains",
  PANTRY_GRAINS = "Pantry & Grains",
  BEVERAGES = "Beverages",
  HOUSEHOLD = "Household",
  OTHER = "Other",
}
