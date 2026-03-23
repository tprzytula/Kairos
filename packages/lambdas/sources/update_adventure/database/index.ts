import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const updateAdventure = async (
  id: string,
  fields: { name?: string; date?: string; time?: string | null; location?: string | null; notes?: string | null; imagePath?: string | null }
): Promise<void> => {
  const updatedFields: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (fields.name !== undefined) {
    updatedFields.name = fields.name.trim();
  }

  if (fields.date !== undefined) {
    updatedFields.date = fields.date.trim();
  }

  if (fields.time !== undefined) {
    updatedFields.time = fields.time || null;
  }

  if (fields.location !== undefined) {
    updatedFields.location = fields.location || null;
  }

  if (fields.notes !== undefined) {
    updatedFields.notes = fields.notes || null;
  }

  if (fields.imagePath !== undefined) {
    updatedFields.imagePath = fields.imagePath || null;
  }

  await updateItem({
    tableName: DynamoDBTable.ADVENTURES,
    key: { id },
    updatedFields,
  });
};
