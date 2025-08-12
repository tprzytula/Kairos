import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb";

export interface GroceryItemData {
  name: string;
  icon: string;
  unit: GroceryItemUnit;
}

export const groceryItems: GroceryItemData[] = [
  { name: "apple", icon: "/assets/icons/apple.png", unit: GroceryItemUnit.UNIT },
  { name: "avocado", icon: "/assets/icons/avocado.png", unit: GroceryItemUnit.UNIT },
  { name: "bacon", icon: "/assets/icons/bacon.png", unit: GroceryItemUnit.UNIT },
  { name: "banana", icon: "/assets/icons/bananas.png", unit: GroceryItemUnit.UNIT },
  { name: "beans", icon: "/assets/icons/butter-beans.png", unit: GroceryItemUnit.BOX },
  { name: "beef", icon: "/assets/icons/beef.png", unit: GroceryItemUnit.GRAM },
  { name: "bread", icon: "/assets/icons/bread.png", unit: GroceryItemUnit.UNIT },
  { name: "carrot", icon: "/assets/icons/carrot.png", unit: GroceryItemUnit.GRAM },
  { name: "cheese", icon: "/assets/icons/cheese.png", unit: GroceryItemUnit.GRAM },
  { name: "chicken", icon: "/assets/icons/chicken.png", unit: GroceryItemUnit.GRAM },
  { name: "chicken breast", icon: "/assets/icons/chicken.png", unit: GroceryItemUnit.UNIT },
  { name: "chilli", icon: "/assets/icons/chilli.png", unit: GroceryItemUnit.UNIT },
  { name: "ciabatta", icon: "/assets/icons/bread.png", unit: GroceryItemUnit.UNIT },
  { name: "coffee", icon: "/assets/icons/coffee.png", unit: GroceryItemUnit.BAG },
  { name: "creme", icon: "/assets/icons/creme-fraiche.png", unit: GroceryItemUnit.MILLILITER },
  { name: "generic", icon: "/assets/icons/generic-grocery-item.png", unit: GroceryItemUnit.UNIT },
  { name: "lemon", icon: "/assets/icons/lemon.png", unit: GroceryItemUnit.UNIT },
  { name: "meat", icon: "/assets/icons/minced-meat.png", unit: GroceryItemUnit.GRAM },
  { name: "milk", icon: "/assets/icons/milk.png", unit: GroceryItemUnit.BOTTLE },
  { name: "oat", icon: "/assets/icons/oats.png", unit: GroceryItemUnit.BAG },
  { name: "oats", icon: "/assets/icons/oats-bowl.png", unit: GroceryItemUnit.BAG },
  { name: "onion", icon: "/assets/icons/onion.png", unit: GroceryItemUnit.UNIT },
  { name: "parmesan", icon: "/assets/icons/cheese.png", unit: GroceryItemUnit.GRAM },
  { name: "parsley", icon: "/assets/icons/parsley.png", unit: GroceryItemUnit.UNIT },
  { name: "rice", icon: "/assets/icons/rice.png", unit: GroceryItemUnit.GRAM },
  { name: "spice", icon: "/assets/icons/spice-mix.png", unit: GroceryItemUnit.GRAM },
  { name: "spinach", icon: "/assets/icons/spinach.png", unit: GroceryItemUnit.GRAM },
  { name: "squash", icon: "/assets/icons/butternut-squash.png", unit: GroceryItemUnit.GRAM },
  { name: "toilet paper", icon: "/assets/icons/toilet-paper.png", unit: GroceryItemUnit.ROLL },
  { name: "tomato", icon: "/assets/icons/tomato.png", unit: GroceryItemUnit.UNIT },
];