import { createUpdateFetcher } from '../../index'

const updateFetcher = createUpdateFetcher('meal-plans', 'meal plan')

export const updateMealPlan = async (
  id: string,
  fields: { date?: string; recipeName?: string; recipeId?: string | null; mealType?: string | null; imagePath?: string | null },
  projectId?: string
): Promise<void> => {
  return updateFetcher(id, fields, projectId)
}
