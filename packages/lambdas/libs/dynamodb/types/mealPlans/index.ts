import { IPrivateItemFields } from "../visibility";

export interface IMealPlan extends IPrivateItemFields {
  id: string;
  projectId: string;
  date: string;
  recipeName: string;
  recipeId?: string;
  mealType?: string;
  imagePath?: string;
  createdAt: string;
  updatedAt: string;
}
