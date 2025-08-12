export enum GroceryCategory {
  PRODUCE = "produce",
  DAIRY = "dairy", 
  MEAT = "meat",
  FROZEN = "frozen",
  BAKERY = "bakery",
  PANTRY = "pantry",
  BEVERAGES = "beverages",
  HOUSEHOLD = "household",
  OTHER = "other",
}

export const GroceryCategoryLabelMap = {
  [GroceryCategory.PRODUCE]: "Fruits & Vegetables",
  [GroceryCategory.DAIRY]: "Dairy",
  [GroceryCategory.MEAT]: "Meat & Poultry", 
  [GroceryCategory.FROZEN]: "Frozen Foods",
  [GroceryCategory.BAKERY]: "Bakery & Grains",
  [GroceryCategory.PANTRY]: "Pantry & Grains",
  [GroceryCategory.BEVERAGES]: "Beverages",
  [GroceryCategory.HOUSEHOLD]: "Household",
  [GroceryCategory.OTHER]: "Other",
}

export enum GroceryViewMode {
  CATEGORIZED = "categorized",
  ALPHABETICAL = "alphabetical", 
  UNCATEGORIZED = "uncategorized",
}

export const GroceryViewModeLabelMap = {
  [GroceryViewMode.CATEGORIZED]: "Categorized",
  [GroceryViewMode.ALPHABETICAL]: "Alphabetical",
  [GroceryViewMode.UNCATEGORIZED]: "List View",
}

export const CategoryOrder = [
  GroceryCategory.PRODUCE,
  GroceryCategory.DAIRY,
  GroceryCategory.MEAT,
  GroceryCategory.FROZEN,
  GroceryCategory.BAKERY,
  GroceryCategory.PANTRY,
  GroceryCategory.BEVERAGES,
  GroceryCategory.HOUSEHOLD,
  GroceryCategory.OTHER,
]