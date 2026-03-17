import { IGroceryItem, IShop } from '../../../../../../providers/AppStateProvider/types'
import { IGroceryStats } from '../../../../../../hooks/useHomeData/types'

export interface IGroceryStatsGridProps {
  groceryStats: IGroceryStats
  shops: IShop[]
  onGroceryItemClick: (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => void
}
