import { IAdventure } from '../../types/adventure'
import { IAddAdventureRequest, IUpdateAdventureRequest } from '../../api/adventures/types'

export type { IAddAdventureRequest, IUpdateAdventureRequest }

export interface IState {
  adventures: IAdventure[]
  isLoading: boolean
  isError: boolean
  refetchAdventures: () => Promise<void>
  addAdventure: (adventure: IAddAdventureRequest) => Promise<void>
  updateAdventure: (id: string, fields: IUpdateAdventureRequest) => Promise<void>
  removeAdventure: (id: string) => Promise<void>
}

export interface IAdventureProviderProps {
  children: React.ReactNode
}
