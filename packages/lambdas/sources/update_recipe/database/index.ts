import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";
import { IRecipeIngredientBody } from "../body/types";

export const updateRecipe = async (
  id: string,
  fields: { name?: string; ingredients?: IRecipeIngredientBody[] }
): Promise<void> => {
  const updatedFields: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (fields.name !== undefined) {
    updatedFields.name = fields.name.trim();
  }

  if (fields.ingredients !== undefined) {
    updatedFields.ingredients = JSON.stringify(fields.ingredients);
  }

  await updateItem({
    tableName: DynamoDBTable.RECIPES,
    key: { id },
    updatedFields,
  });
};
