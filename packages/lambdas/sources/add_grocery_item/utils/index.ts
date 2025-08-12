import { DynamoDBTable, scan } from "@kairos-lambdas-libs/dynamodb";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";
import { getCategory } from "../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings";

export interface GroceryItemDefault {
  name: string;
  icon: string;
  unit: string;
}

export const getCategoryForItem = async (itemName: string): Promise<GroceryItemCategory> => {
  try {
    const defaults = await scan({
      tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
    });

    const matchingDefault = defaults.find(
      defaultItem => defaultItem.name.toLowerCase() === itemName.toLowerCase()
    );

    if (matchingDefault) {
      return getCategory(matchingDefault.name);
    }

    return getCategory(itemName);
  } catch (error) {
    console.error('Failed to fetch grocery defaults:', error);
    return getCategory(itemName);
  }
};