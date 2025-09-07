import ShopItem from '../ShopItem'
import SwipeableList from '../SwipeableList'
import { Container } from './index.styled'
import { IShopListProps } from './types'
import Placeholder from './Placeholder'
import { useShopContext } from '../../providers/ShopProvider'

const ShopList = ({ shops, onDelete, onEdit }: IShopListProps) => {
  const { isLoading } = useShopContext()

  if (isLoading) {
    return <Placeholder />
  }

  return (
    <Container>
      <SwipeableList
        component={ShopItem}
        list={shops}
        onSwipeAction={onDelete}
        onEditAction={onEdit}
        threshold={0.3}
      />
    </Container>
  )
}

export default ShopList
