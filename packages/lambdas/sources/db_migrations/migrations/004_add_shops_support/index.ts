import { DynamoDBTable, putItem, scan, updateItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";
import { Migration } from "../../runner/types";
import { IShop } from "@kairos-lambdas-libs/dynamodb/types/shops";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/groceryList";
import { IProject } from "@kairos-lambdas-libs/dynamodb/types/projects";

const migration: Migration = {
  id: "004",
  name: "Add shops support - create default shops and assign grocery items",
  execute: async () => {
    console.log("Starting shops support migration...");
    
    // Get all projects
    const projects = await scan({ tableName: DynamoDBTable.PROJECTS });
    console.log(`Found ${projects.length} projects`);

    const projectShopMap = new Map<string, string>();

    // Create a default "Grocery Store" shop for each project
    for (const project of projects as IProject[]) {
      const shopId = randomUUID();
      const now = new Date().toISOString();
      
      const defaultShop: IShop = {
        id: shopId,
        projectId: project.id,
        name: "Grocery Store",
        icon: "/assets/icons/generic-grocery-item.png",
        createdAt: now,
        updatedAt: now,
      };

      await putItem({
        tableName: DynamoDBTable.SHOPS,
        item: defaultShop,
      });

      projectShopMap.set(project.id, shopId);
      console.log(`Created default shop "${defaultShop.name}" (${shopId}) for project ${project.id}`);
    }

    // Get all grocery items and assign them to their project's default shop
    const groceryItems = await scan({ tableName: DynamoDBTable.GROCERY_LIST });
    console.log(`Found ${groceryItems.length} grocery items to update`);

    let updatedItems = 0;
    for (const item of groceryItems as IGroceryItem[]) {
      const shopId = projectShopMap.get(item.projectId);
      
      if (!shopId) {
        console.warn(`No default shop found for project ${item.projectId}, skipping item ${item.id}`);
        continue;
      }

      await updateItem({
        tableName: DynamoDBTable.GROCERY_LIST,
        key: { id: item.id },
        updatedFields: { shopId },
      });

      updatedItems++;
    }

    console.log(`Migration completed successfully:`);
    console.log(`- Created ${projectShopMap.size} default shops`);
    console.log(`- Updated ${updatedItems} grocery items with shopId`);
  },
};

export default migration;
