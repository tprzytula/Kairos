export type CategoryName = 
  | "Meat & Poultry"
  | "Dairy"
  | "Fruits & Vegetables"
  | "Bakery & Grains"
  | "Pantry & Grains"
  | "Beverages"
  | "Household"
  | "Other";

export interface CategoryMapping {
  [itemName: string]: CategoryName;
}

export const categoryMap: CategoryMapping = {
  // Proteins
  "beef": "Meat & Poultry",
  "chicken": "Meat & Poultry", 
  "chicken breast": "Meat & Poultry",
  "meat": "Meat & Poultry",
  "bacon": "Meat & Poultry",
  
  // Dairy
  "cheese": "Dairy",
  "parmesan": "Dairy",
  "milk": "Dairy",
  "creme": "Dairy",
  
  // Fruits & Vegetables
  "apple": "Fruits & Vegetables",
  "banana": "Fruits & Vegetables",
  "avocado": "Fruits & Vegetables",
  "tomato": "Fruits & Vegetables",
  "lemon": "Fruits & Vegetables",
  "onion": "Fruits & Vegetables",
  "carrot": "Fruits & Vegetables",
  "spinach": "Fruits & Vegetables",
  "parsley": "Fruits & Vegetables",
  "chilli": "Fruits & Vegetables",
  "squash": "Fruits & Vegetables",
  
  // Bakery & Grains
  "bread": "Bakery & Grains",
  "ciabatta": "Bakery & Grains",
  "rice": "Pantry & Grains",
  "oats": "Pantry & Grains",
  "oat": "Pantry & Grains",
  
  // Pantry
  "beans": "Pantry & Grains",
  "spice": "Pantry & Grains",
  "coffee": "Beverages",
  
  // Household
  "toilet paper": "Household",
  
  // Generic
  "generic": "Other",
};

export const getCategory = (itemName: string): CategoryName => {
  return categoryMap[itemName.toLowerCase()] || "Other";
};