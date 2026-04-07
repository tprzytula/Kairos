import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const deleteMealPlan = createDeleteFetcher(ApiEndpoint.MEAL_PLANS)
