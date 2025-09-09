import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { INoiseTrackingItem } from '../../api/noiseTracking'

export interface IGroceryStats {
  totalItems: number
  unpurchasedItems: IGroceryItem[]
  displayItems: IGroceryItem[]
  hasOverflow: boolean
}

export interface IToDoStats {
  pendingItems: ITodoItem[]
  sortedItems: ITodoItem[]
  displayedItems: ITodoItem[]
  hasMoreItems: boolean
}

export interface INoiseCounts {
  todayCount: number
  last7DaysCount: number
  last30DaysCount: number
  totalCount: number
}

export interface IHomeData {
  groceryStats: IGroceryStats
  toDoStats: IToDoStats
  noiseCounts: INoiseCounts
}

export interface IUseHomeDataProps {
  groceryList: IGroceryItem[]
  toDoList: ITodoItem[]
  noiseTrackingItems: INoiseTrackingItem[]
  purchasedItems: Set<string>
  isToDoItemsExpanded: boolean
}
