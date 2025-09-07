import ShopItemPlaceholder from '../../ShopItem/Placeholder'
import { Container, PlaceholdersWrapper } from './index.styled'
import { IPlaceholderProps } from './types'

const Placeholder = ({ numberOfShops = 4 }: IPlaceholderProps) => {
  return (
    <Container>
      <PlaceholdersWrapper aria-label="Loading shops">
        {Array.from({ length: numberOfShops }).map((_, index) => (
          <ShopItemPlaceholder key={index} />
        ))}
      </PlaceholdersWrapper>
    </Container>
  )
}

export default Placeholder
