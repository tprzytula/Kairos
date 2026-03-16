import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

export const createMealPlan = async (mealPlan: {
  projectId: string;
  date: string;
  recipeName: string;
  recipeId?: string;
}): Promise<string> => {
  const id = randomUUID();
  const now = new Date().toISOString();

  const item: Record<string, any> = {
    id,
    projectId: mealPlan.projectId,
    date: mealPlan.date.trim(),
    recipeName: mealPlan.recipeName.trim(),
    createdAt: now,
    updatedAt: now,
  };

  if (mealPlan.recipeId) {
    item.recipeId = mealPlan.recipeId;
  }

  await putItem({
    tableName: DynamoDBTable.MEAL_PLANS,
    item,
  });

  return id;
};
