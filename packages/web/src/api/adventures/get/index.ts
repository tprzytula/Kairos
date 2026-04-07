import { IAdventure } from '../../../types/adventure'
import { createGetFetcher } from '../../index'

export const getAdventures = createGetFetcher<IAdventure>('adventures')
