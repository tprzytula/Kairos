import { IGroceryItem, IShop } from '../../../../providers/AppStateProvider/types'
import { IGroceryStats } from '../../../../hooks/useHomeData/types'

export interface IGrocerySectionProps {
  groceryStats: IGroceryStats
  shops: IShop[]
  isLoading: boolean
  isError: boolean
  onGroceryItemClick: (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => void
  onNavigate?: () => void
}
