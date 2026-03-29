import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const updateAdventure = async (
  id: string,
  fields: { name?: string; date?: string; endDate?: string | null; time?: string | null; location?: string | null; notes?: string | null; imagePath?: string | null; isPrivate?: boolean; userId?: string }
): Promise<void> => {
  const updatedFields: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (fields.isPrivate === true) {
    updatedFields.visibility = "private";
    updatedFields.ownerId = fields.userId;
  } else if (fields.isPrivate === false) {
    updatedFields.visibility = null;
    updatedFields.ownerId = null;
  }

  if (fields.name !== undefined) {
    updatedFields.name = fields.name.trim();
  }

  if (fields.date !== undefined) {
    updatedFields.date = fields.date.trim();
  }

  if (fields.endDate !== undefined) {
    updatedFields.endDate = fields.endDate || null;
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
