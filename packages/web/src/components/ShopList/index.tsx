import ShopItem from '../ShopItem'
import SwipeableList from '../SwipeableList'
import EmptyState from '../EmptyState'
import { Container } from './index.styled'
import { IShopListProps } from './types'
import Placeholder from './Placeholder'
import { useShopContext } from '../../providers/ShopProvider'

const ShopList = ({ shops, onDelete, onEdit }: IShopListProps) => {
  const { isLoading, isError } = useShopContext()

  if (isLoading) {
    return <Placeholder />
  }

  if (shops.length === 0) {
    return (
      <EmptyState>
        {isError ? 'Unable to load shops' : 'No shops found'}
      </EmptyState>
    )
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
