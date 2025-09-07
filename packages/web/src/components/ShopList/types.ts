import { IShop } from '../../providers/AppStateProvider/types'

export interface IShopListProps {
  shops: Array<IShop>
  onDelete: (id: string) => void
  onEdit: (id: string) => void
}
