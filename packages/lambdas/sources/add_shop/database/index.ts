import { DynamoDBTable, putItem, query, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { IShop } from "@kairos-lambdas-libs/dynamodb/types/shops";
import { randomUUID } from "node:crypto";

const findExistingShop = async (projectId: string, name: string): Promise<IShop | null> => {
  const projectShops = await query({
    tableName: DynamoDBTable.SHOPS,
    indexName: DynamoDBIndex.SHOPS_PROJECT,
    attributes: { projectId },
  });

  const matchingShop = projectShops.find(shop => 
    shop.name.toLowerCase() === name.toLowerCase()
  );

  return matchingShop || null;
};

const createNewShop = async (shop: Omit<IShop, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  await putItem({
    tableName: DynamoDBTable.SHOPS,
    item: {
      id,
      ...shop,
      createdAt: now,
      updatedAt: now,
    },
  });

  return id;
};

export const upsertItem = async (shop: { projectId: string; name: string; icon?: string }): Promise<{ id: string, statusCode: number }> => {
  const { projectId, name, icon } = shop;

  const existingShop = await findExistingShop(projectId, name);

  if (existingShop) {
    return {
      id: existingShop.id,
      statusCode: 409, // Conflict - shop name already exists
    };
  }

  return {
    id: await createNewShop({
      projectId,
      name: name.trim(),
      icon: icon || "/assets/icons/generic-grocery-item.png",
    }),
    statusCode: 201,
  };
};
