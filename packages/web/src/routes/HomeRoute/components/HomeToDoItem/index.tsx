import { ItemText, Description } from './index.styled'
import { IHomeToDoItemProps } from './types'

const HomeToDoItem = ({ item }: IHomeToDoItemProps) => {
  return (
    <ItemText>
      {item.name}
      {item.description && (
        <Description>
          {item.description}
        </Description>
      )}
    </ItemText>
  )
}

export default HomeToDoItem