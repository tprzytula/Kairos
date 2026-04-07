import { IAdventure } from '../../../types/adventure'
import { createAddFetcher } from '../../index'
import { IAddAdventureRequest } from '../types'

const addFetcher = createAddFetcher<IAdventure>('adventures', 'adventure')

export const addAdventure = async (
  adventure: IAddAdventureRequest,
  projectId?: string
): Promise<IAdventure> => {
  const { isPrivate, ...adventureData } = adventure
  return addFetcher(adventureData, projectId, isPrivate)
}
