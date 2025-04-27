import { DynamoDBTable, putItem, updateItem, query, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";
import { randomUUID } from "node:crypto";

const findExistingItem = async (itemProperties: Partial<IGroceryItem>): Promise<IGroceryItem | null> => {
  const items = await query({
    tableName: DynamoDBTable.GROCERY_LIST,
    indexName: DynamoDBIndex.GROCERY_LIST_NAME_UNIT,
    attributes: itemProperties,
  });

  return items?.[0] ?? null;
};

const updateExistingItem = async (id: string, fields: Partial<IGroceryItem>) => {
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
