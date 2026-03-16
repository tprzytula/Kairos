import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";

export const updateMealPlan = async (
  id: string,
  fields: { date?: string; recipeName?: string; recipeId?: string | null }
): Promise<void> => {
  const updatedFields: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (fields.date !== undefined) {
    updatedFields.date = fields.date.trim();
  }

  if (fields.recipeName !== undefined) {
    updatedFields.recipeName = fields.recipeName.trim();
  }

  if (fields.recipeId !== undefined) {
    updatedFields.recipeId = fields.recipeId || null;
  }

  await updateItem({
    tableName: DynamoDBTable.MEAL_PLANS,
    key: { id },
    updatedFields,
  });
};
