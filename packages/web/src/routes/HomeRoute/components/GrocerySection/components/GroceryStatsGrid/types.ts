import { IGroceryItem } from '../../../../../../providers/AppStateProvider/types'
import { IGroceryStats } from '../../../../../../hooks/useHomeData/types'

export interface IGroceryStatsGridProps {
  groceryStats: IGroceryStats
  onGroceryItemClick: (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => void
}
