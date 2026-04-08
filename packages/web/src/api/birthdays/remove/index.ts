import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const removeBirthday = createDeleteFetcher(ApiEndpoint.BIRTHDAYS)
