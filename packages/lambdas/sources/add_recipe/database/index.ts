import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { IRecipeIngredientBody } from "../body/types";
import { randomUUID } from "node:crypto";

export const createRecipe = async (recipe: {
  projectId: string;
  name: string;
  ingredients: IRecipeIngredientBody[];
}): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  await putItem({
    tableName: DynamoDBTable.RECIPES,
    item: {
      id,
      projectId: recipe.projectId,
      name: recipe.name.trim(),
      ingredients: JSON.stringify(recipe.ingredients),
      createdAt: now,
      updatedAt: now,
    },
  });

  return id;
};
