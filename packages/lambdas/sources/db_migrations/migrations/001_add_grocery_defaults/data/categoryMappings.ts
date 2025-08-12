import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

export type CategoryName = GroceryItemCategory;

export interface CategoryMapping {
  [itemName: string]: CategoryName;
}

export const categoryMap: CategoryMapping = {
  // Proteins
  "beef": GroceryItemCategory.MEAT_POULTRY,
  "chicken": GroceryItemCategory.MEAT_POULTRY, 
  "chicken breast": GroceryItemCategory.MEAT_POULTRY,
  "meat": GroceryItemCategory.MEAT_POULTRY,
  "bacon": GroceryItemCategory.MEAT_POULTRY,
  
  // Dairy
  "cheese": GroceryItemCategory.DAIRY,
  "parmesan": GroceryItemCategory.DAIRY,
  "milk": GroceryItemCategory.DAIRY,
  "creme": GroceryItemCategory.DAIRY,
  
  // Fruits & Vegetables
  "apple": GroceryItemCategory.FRUITS_VEGETABLES,
  "banana": GroceryItemCategory.FRUITS_VEGETABLES,
  "avocado": GroceryItemCategory.FRUITS_VEGETABLES,
  "tomato": GroceryItemCategory.FRUITS_VEGETABLES,
  "lemon": GroceryItemCategory.FRUITS_VEGETABLES,
  "onion": GroceryItemCategory.FRUITS_VEGETABLES,
  "carrot": GroceryItemCategory.FRUITS_VEGETABLES,
  "spinach": GroceryItemCategory.FRUITS_VEGETABLES,
  "parsley": GroceryItemCategory.FRUITS_VEGETABLES,
  "chilli": GroceryItemCategory.FRUITS_VEGETABLES,
  "squash": GroceryItemCategory.FRUITS_VEGETABLES,
  
  // Bakery & Grains
  "bread": GroceryItemCategory.BAKERY_GRAINS,
  "ciabatta": GroceryItemCategory.BAKERY_GRAINS,
  "rice": GroceryItemCategory.PANTRY_GRAINS,
  "oats": GroceryItemCategory.PANTRY_GRAINS,
  "oat": GroceryItemCategory.PANTRY_GRAINS,
  
  // Pantry
  "beans": GroceryItemCategory.PANTRY_GRAINS,
  "spice": GroceryItemCategory.PANTRY_GRAINS,
  "coffee": GroceryItemCategory.BEVERAGES,
  
  // Household
  "toilet paper": GroceryItemCategory.HOUSEHOLD,
  
  // Generic
  "generic": GroceryItemCategory.OTHER,
};

export const getCategory = (itemName: string): CategoryName => {
  return categoryMap[itemName.toLowerCase()] || GroceryItemCategory.OTHER;
};