import { IMealPlan } from '../../../types/mealPlan'
import { createGetFetcher } from '../../index'

export const getMealPlans = createGetFetcher<IMealPlan>('meal-plans')
