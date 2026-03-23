import { IAdventure } from '../../types/adventure'

export interface IState {
  adventures: IAdventure[]
  isLoading: boolean
  refetchAdventures: () => Promise<void>
  addAdventure: (adventure: { name: string; date: string; time?: string; location?: string; notes?: string; imagePath?: string }) => Promise<void>
  updateAdventure: (id: string, fields: { name?: string; date?: string; time?: string | null; location?: string | null; notes?: string | null; imagePath?: string | null }) => Promise<void>
  removeAdventure: (id: string) => Promise<void>
}

export interface IAdventureProviderProps {
  children: React.ReactNode
}
