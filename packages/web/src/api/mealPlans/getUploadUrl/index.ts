import { ApiEndpoint } from '../../../enums/apiResource'
import { createUploadUrlFetcher } from '../../index'

export const getMealPlanUploadUrl = createUploadUrlFetcher(ApiEndpoint.MEAL_PLANS)
