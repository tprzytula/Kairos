import { ApiEndpoint } from '../../../enums/apiResource'
import { createUpdateFetcher } from '../../index'

const updateFetcher = createUpdateFetcher(ApiEndpoint.MEAL_PLANS)

export const updateMealPlan = async (
  id: string,
  fields: { date?: string; recipeName?: string; recipeId?: string | null; mealType?: string | null; imagePath?: string | null },
  projectId?: string
): Promise<void> => {
  return updateFetcher(id, fields, projectId)
}
