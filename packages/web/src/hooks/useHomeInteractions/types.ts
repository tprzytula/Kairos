import { IGroceryItem } from '../../providers/AppStateProvider/types'

export type NoiseView = 'overview' | 'today' | 'last7days' | 'last30days'

export interface IPopupPosition {
  top: number
  left: number
  arrowOffset?: number
}

export interface IHomeInteractionState {
  selectedGroceryItem: IGroceryItem | null
  isPopupOpen: boolean
  anchorPosition: IPopupPosition | undefined
  isToDoItemsExpanded: boolean
  noiseView: NoiseView
  expandedToDoItems: Set<string>
}

export interface IHomeInteractionHandlers {
  handleGroceryItemClick: (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => void
  handlePopupClose: () => void
  handleToggleToDoItems: () => void
  handleNoiseViewChange: (view: NoiseView) => void
  handleToDoItemToggle: (itemId: string) => void
}

export interface IUseHomeInteractions extends IHomeInteractionState, IHomeInteractionHandlers {}
