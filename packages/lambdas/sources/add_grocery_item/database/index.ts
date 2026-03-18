import { DynamoDBTable, putItem, updateItem, query, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";
import { randomUUID } from "node:crypto";

export const queryProjectItems = async (projectId: string): Promise<IGroceryItem[]> => {
  return query({
    tableName: DynamoDBTable.GROCERY_LIST,
    indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
    attributes: { projectId },
  });
};

const findExistingItem = (
  projectItems: IGroceryItem[],
  itemProperties: Partial<IGroceryItem>,
): IGroceryItem | null => {
  const { shopId, name, unit } = itemProperties;

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

export const upsertItem = async (
  item: Omit<IGroceryItem, "id">,
  projectItems: IGroceryItem[],
): Promise<{ id: string, statusCode: number }> => {
  const { projectId, shopId, name, quantity, unit, imagePath, category } = item;

  const existingItem = findExistingItem(projectItems, {
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

    // Update the in-memory list so subsequent items see the updated quantity
    existingItem.quantity = updateFields.quantity;
    if (updateFields.category) {
      existingItem.category = updateFields.category;
    }

    return {
      id: await updateExistingItem(existingItem.id, updateFields),
      statusCode: 200,
    };
  }

  const id = await createNewItem({
    projectId,
    shopId,
    name,
    quantity,
    unit,
    imagePath,
    category,
  });

  // Add newly created item to the in-memory list so subsequent items can find it
  projectItems.push({
    id,
    projectId,
    shopId,
    name,
    quantity,
    unit,
    imagePath,
    category,
  } as IGroceryItem);

  return {
    id,
    statusCode: 201,
  };
};
