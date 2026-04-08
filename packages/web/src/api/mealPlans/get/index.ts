import { ApiEndpoint } from '../../../enums/apiResource'
import { IMealPlan } from '../../../types/mealPlan'
import { createGetFetcher } from '../../index'

export const getMealPlans = createGetFetcher<IMealPlan>(ApiEndpoint.MEAL_PLANS)
