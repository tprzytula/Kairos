import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { IRecipeIngredientBody } from "../body/types";
import { randomUUID } from "node:crypto";

export const createRecipe = async (recipe: {
  projectId: string;
  name: string;
  ingredients: IRecipeIngredientBody[];
  instructions?: string[];
  imagePath?: string;
  externalLink?: string;
}): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  const item: Record<string, any> = {
    id,
    projectId: recipe.projectId,
    name: recipe.name.trim(),
    ingredients: JSON.stringify(recipe.ingredients),
    createdAt: now,
    updatedAt: now,
  };

  if (recipe.instructions && recipe.instructions.length > 0) {
    item.instructions = JSON.stringify(recipe.instructions);
  }

  if (recipe.imagePath) {
    item.imagePath = recipe.imagePath;
  }

  if (recipe.externalLink) {
    item.externalLink = recipe.externalLink;
  }

  await putItem({
    tableName: DynamoDBTable.RECIPES,
    item,
  });

  return id;
};
