import { ApiEndpoint } from '../../../enums/apiResource'
import { createUpdateFetcher } from '../../index'
import { IUpdateAdventureRequest } from '../types'

const updateFetcher = createUpdateFetcher(ApiEndpoint.ADVENTURES)

export const updateAdventure = async (
  id: string,
  fields: IUpdateAdventureRequest,
  projectId?: string
): Promise<void> => {
  return updateFetcher(id, fields, projectId)
}
