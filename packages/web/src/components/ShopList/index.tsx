import ShopItem from '../ShopItem'
import SwipeableList from '../SwipeableList'
import { Container } from './index.styled'
import { IShopListProps } from './types'

const ShopList = ({ shops, onDelete, onEdit }: IShopListProps) => {
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
