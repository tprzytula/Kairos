import { DynamoDBTable, putItem, updateItem, query, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";
import { randomUUID } from "node:crypto";

const findExistingItem = async (itemProperties: Partial<IGroceryItem>): Promise<IGroceryItem | null> => {
  const { projectId, shopId, name, unit } = itemProperties;
  
  if (!projectId || !shopId) {
    return null;
  }

  const projectItems = await query({
    tableName: DynamoDBTable.GROCERY_LIST,
    indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
    attributes: { projectId },
  });

  const matchingItem = projectItems.find(item => 
    item.name === name && item.unit === unit && item.shopId === shopId
  );

  return matchingItem || null;
};

const updateExistingItem = async (id: string, fields: Record<string, any>) => {
  await updateItem({
    tableName: DynamoDBTable.GROCERY_LIST,
    key: {
      id,
    },
    updatedFields: fields,
  });

  return id;
};

const createNewItem = async (item: Omit<IGroceryItem, "id">): Promise<string> => {
    const id = randomUUID();

    await putItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id,
        ...item,
      },
    });

    return id;
};

export const upsertItem = async (item: Omit<IGroceryItem, "id">): Promise<{ id: string, statusCode: number }> => {
  const { projectId, shopId, name, quantity, unit, imagePath, category } = item;

  const existingItem = await findExistingItem({
    projectId,
    shopId,
    name,
    unit,
  });

  if (existingItem) {
    const updateFields: Record<string, any> = {
      quantity: Number(existingItem.quantity) + Number(quantity),
    };

    if (category && !existingItem.category) {
      updateFields.category = category;
    }

    return {
      id: await updateExistingItem(existingItem.id, updateFields),
      statusCode: 200,
    };
  }

  return {
    id: await createNewItem({
      projectId,
      shopId,
      name,
      quantity,
      unit,
      imagePath,
      category,
    }),
    statusCode: 201,
  };
};
