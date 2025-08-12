import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";
import { Migration } from "../../runner/types";
import { groceryItems } from "./data/groceryItems";
import { getCategory } from "./data/categoryMappings";

const migration: Migration = {
  id: "001",
  name: "Add grocery item defaults from JSON data",
  execute: async () => {
    console.log("Adding grocery item defaults...");
    console.log(`Adding ${groceryItems.length} grocery item defaults...`);

    for (const item of groceryItems) {
      await putItem({
        tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
        item: {
          id: randomUUID(),
          name: item.name,
          icon: item.icon,
          unit: item.unit,
          quantity: 1,
          category: getCategory(item.name),
          createdAt: new Date().toISOString(),
        },
      });
      
      console.log(`Added grocery item default: ${item.name}`);
    }
    
    console.log("Grocery item defaults migration completed successfully");
  },
};



export default migration;