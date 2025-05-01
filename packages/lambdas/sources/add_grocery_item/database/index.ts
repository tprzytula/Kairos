import { IGroceryItem } from "../types";
import { DynamoDBTables, putItem, getItem, updateItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

const findExistingItem = async (itemProperties: Partial<IGroceryItem>): Promise<IGroceryItem | null> => {
  return await getItem<IGroceryItem>({
    tableName: DynamoDBTables.GROCERY_LIST,
    item: itemProperties,
  });
};

const updateExistingItem = async (id: string, fields: Partial<IGroceryItem>) => {
  await updateItem({
    tableName: DynamoDBTables.GROCERY_LIST,
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
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id,
        ...item,
      },
    });

    return id;
};

export const upsertItem = async (item: Omit<IGroceryItem, "id">): Promise<{ id: string, statusCode: number }> => {
  const { name, quantity, unit, imagePath } = item;

  const existingItem = await findExistingItem({
    name,
    unit,
  });

  if (existingItem) {
    return {
      id: await updateExistingItem(existingItem.id, {
        quantity: (Number(existingItem.quantity) + Number(quantity)).toString(),
      }),
      statusCode: 200,
    };
  }

  return {
    id: await createNewItem({
      name,
      quantity,
      unit,
      imagePath,
    }),
    statusCode: 201,
  };
};
