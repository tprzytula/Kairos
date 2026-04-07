import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const deleteAdventure = createDeleteFetcher(ApiEndpoint.ADVENTURES)
