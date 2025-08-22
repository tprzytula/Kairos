import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";
import { Migration } from "../../runner/types";
import { groceryItems } from "./data/groceryItems";
import { getCategory } from "./data/categoryMappings";

const migration: Migration = {
  id: "002",
  name: "Add 100 more common grocery item defaults",
  execute: async () => {
    console.log("Adding additional grocery item defaults...");
    console.log(`Adding ${groceryItems.length} more grocery item defaults...`);

    for (let i = 0; i < groceryItems.length; i++) {
      const item = groceryItems[i];
      
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
      
      console.log(`Added grocery item default: ${item.name} (${i + 1}/${groceryItems.length})`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log("Additional grocery item defaults migration completed successfully");
  },
};

export default migration;
