import { ItemText } from './index.styled'
import { IHomeGroceryItemProps } from './types'

const HomeGroceryItem = ({ item }: IHomeGroceryItemProps) => {
  return (
    <ItemText>
      {item.name}
    </ItemText>
  )
}

export default HomeGroceryItem