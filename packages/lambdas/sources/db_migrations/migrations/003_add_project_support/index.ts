import { DynamoDBTable, putItem, scan, updateItem, deleteItem } from "@kairos-lambdas-libs/dynamodb";
import { Migration } from "../../runner/types";
import { IProject, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

const LEGACY_PROJECT_ID = "legacy-shared-project";
const LEGACY_PROJECT_NAME = "Legacy Shared Data";

const migration: Migration = {
  id: "003",
  name: "Add project support to existing data",
  execute: async () => {
    console.log("Starting project migration...");

    await createLegacyProject();
    await migrateGroceryItems();
    await migrateTodoItems();
    await migrateNoiseTrackingItems();

    console.log("Project migration completed successfully");
  },
};

const createLegacyProject = async () => {
  console.log("Creating legacy shared project...");
  
  const legacyProject: IProject = {
    id: LEGACY_PROJECT_ID,
    name: LEGACY_PROJECT_NAME,
    ownerId: "system",
    createdAt: Date.now(),
    isPersonal: false,
    maxMembers: 1000,
  };

  await putItem({
    tableName: DynamoDBTable.PROJECTS,
    item: {
      ...legacyProject,
    },
  });

  console.log("Created legacy project");
};

const migrateGroceryItems = async () => {
  console.log("Migrating grocery items...");
  
  const items = await scan({
    tableName: DynamoDBTable.GROCERY_LIST,
  });

  console.log(`Found ${items.length} grocery items to migrate`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        await updateItem({
          tableName: DynamoDBTable.GROCERY_LIST,
          key: { id: item.id },
          updatedFields: {
            projectId: LEGACY_PROJECT_ID,
          },
        });
        
        console.log(`Migrated grocery item ${i + 1}/${items.length}`);
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          console.error(`Failed to migrate grocery item ${item.id} after ${maxRetries} retries:`, error);
          throw error;
        }
        console.log(`Retry ${retries}/${maxRetries} for grocery item: ${item.id}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`Migrated ${items.length} grocery items`);
};

const migrateTodoItems = async () => {
  console.log("Migrating todo items...");
  
  const items = await scan({
    tableName: DynamoDBTable.TODO_LIST,
  });

  console.log(`Found ${items.length} todo items to migrate`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        await updateItem({
          tableName: DynamoDBTable.TODO_LIST,
          key: { id: item.id },
          updatedFields: {
            projectId: LEGACY_PROJECT_ID,
          },
        });
        
        console.log(`Migrated todo item ${i + 1}/${items.length}`);
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          console.error(`Failed to migrate todo item ${item.id} after ${maxRetries} retries:`, error);
          throw error;
        }
        console.log(`Retry ${retries}/${maxRetries} for todo item: ${item.id}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`Migrated ${items.length} todo items`);
};

const migrateNoiseTrackingItems = async () => {
  console.log("Migrating noise tracking items...");
  
  const items = await scan({
    tableName: DynamoDBTable.NOISE_TRACKING,
  });

  console.log(`Found ${items.length} noise tracking items to migrate`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    console.log(`Migrating noise tracking item: ${item.timestamp} (${i + 1}/${items.length})`);
    
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        await deleteItem({
          tableName: DynamoDBTable.NOISE_TRACKING,
          key: { timestamp: item.timestamp },
        });

        await putItem({
          tableName: DynamoDBTable.NOISE_TRACKING,
          item: {
            projectId: LEGACY_PROJECT_ID,
            timestamp: item.timestamp,
          },
        });
        
        break;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          console.error(`Failed to migrate noise tracking item ${item.timestamp} after ${maxRetries} retries:`, error);
          throw error;
        }
        console.log(`Retry ${retries}/${maxRetries} for noise tracking item: ${item.timestamp}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`Migrated ${items.length} noise tracking items`);
};

export default migration;
