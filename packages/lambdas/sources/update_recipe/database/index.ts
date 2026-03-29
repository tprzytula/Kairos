import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";
import { IRecipeIngredientBody } from "../body/types";

export const updateRecipe = async (
  id: string,
  fields: { name?: string; ingredients?: IRecipeIngredientBody[]; instructions?: string[]; imagePath?: string; externalLink?: string; mealTypes?: string[]; dishTypes?: string[]; isPrivate?: boolean; userId?: string }
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

  if (fields.ingredients !== undefined) {
    updatedFields.ingredients = JSON.stringify(fields.ingredients);
  }

  if (fields.instructions !== undefined) {
    updatedFields.instructions = fields.instructions.length > 0
      ? JSON.stringify(fields.instructions)
      : null;
  }

  if (fields.imagePath !== undefined) {
    updatedFields.imagePath = fields.imagePath;
  }

  if (fields.externalLink !== undefined) {
    updatedFields.externalLink = fields.externalLink || null;
  }

  if (fields.mealTypes !== undefined) {
    updatedFields.mealTypes = fields.mealTypes.length > 0
      ? JSON.stringify(fields.mealTypes)
      : null;
  }

  if (fields.dishTypes !== undefined) {
    updatedFields.dishTypes = fields.dishTypes.length > 0
      ? JSON.stringify(fields.dishTypes)
      : null;
  }

  await updateItem({
    tableName: DynamoDBTable.RECIPES,
    key: { id },
    updatedFields,
  });
};
