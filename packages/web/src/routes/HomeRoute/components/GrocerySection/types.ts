import { IGroceryItem } from '../../../../providers/AppStateProvider/types'
import { IGroceryStats } from '../../../../hooks/useHomeData/types'

export interface IGrocerySectionProps {
  groceryStats: IGroceryStats
  isLoading: boolean
  onGroceryItemClick: (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => void
}
