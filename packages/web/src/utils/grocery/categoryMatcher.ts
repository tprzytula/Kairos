import { GroceryCategory } from "../../enums/groceryCategory"

const CATEGORY_KEYWORDS = {
  [GroceryCategory.PRODUCE]: [
    'apple', 'avocado', 'banana', 'carrot', 'lemon', 'onion', 'chilli', 'chili', 
    'tomato', 'butternut', 'squash', 'spinach', 'parsley', 'lettuce', 'cucumber',
    'pepper', 'fruit', 'vegetable', 'produce', 'fresh', 'organic', 'potato',
    'grape', 'strawberry', 'broccoli', 'cauliflower', 'celery', 'garlic',
    'ginger', 'herb', 'lime', 'mushroom', 'corn', 'peas', 'beet', 'radish'
  ],
  [GroceryCategory.DAIRY]: [
    'milk', 'cheese', 'crème', 'cream', 'butter', 'yogurt', 'yoghurt', 'dairy',
    'cottage', 'sour cream', 'whipped', 'mozzarella', 'cheddar', 'parmesan',
    'swiss', 'feta', 'goat cheese', 'ricotta', 'brie', 'camembert'
  ],
  [GroceryCategory.MEAT]: [
    'beef', 'chicken', 'minced', 'meat', 'bacon', 'pork', 'ham', 'turkey',
    'sausage', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster',
    'ground', 'steak', 'roast', 'chops', 'wings', 'thighs', 'breast'
  ],
  [GroceryCategory.FROZEN]: [
    'frozen', 'ice cream', 'popsicle', 'frozen fruit', 'frozen vegetable',
    'frozen meal', 'sorbet', 'gelato'
  ],
  [GroceryCategory.BAKERY]: [
    'bread', 'bagel', 'muffin', 'croissant', 'baguette', 'roll', 'bun',
    'pastry', 'cake', 'cookie', 'donut', 'pie', 'tart', 'danish', 'scone'
  ],
  [GroceryCategory.PANTRY]: [
    'rice', 'oats', 'bowl', 'spice', 'mix', 'butter beans', 'pasta', 'flour',
    'sugar', 'salt', 'oil', 'vinegar', 'sauce', 'canned', 'jar', 'cereal',
    'crackers', 'nuts', 'seeds', 'dried', 'grains', 'quinoa', 'lentils',
    'chickpeas', 'beans', 'condiment', 'seasoning', 'baking'
  ],
  [GroceryCategory.BEVERAGES]: [
    'coffee', 'tea', 'juice', 'soda', 'water', 'beer', 'wine', 'alcohol',
    'drink', 'beverage', 'smoothie', 'energy drink', 'sports drink',
    'coconut water', 'kombucha'
  ],
  [GroceryCategory.HOUSEHOLD]: [
    'toilet paper', 'paper towel', 'cleaning', 'detergent', 'shampoo',
    'toothpaste', 'deodorant', 'household', 'tissues', 'trash bags', 'sponge',
    'bleach', 'dish soap', 'laundry', 'fabric softener', 'toilet', 'bathroom',
    'kitchen', 'personal care', 'hygiene', 'soap'
  ]
}

export const getCategoryFromName = (name: string): GroceryCategory => {
  const lowerName = name.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category as GroceryCategory
    }
  }
  
  return GroceryCategory.OTHER
}

export const getCategoryFromItemOrDefault = (
  itemName: string, 
  defaultCategory?: string
): GroceryCategory => {
  if (defaultCategory && Object.values(GroceryCategory).includes(defaultCategory as GroceryCategory)) {
    return defaultCategory as GroceryCategory
  }
  
  return getCategoryFromName(itemName)
}