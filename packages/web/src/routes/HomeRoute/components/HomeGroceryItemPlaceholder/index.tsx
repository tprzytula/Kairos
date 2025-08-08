import { PlaceholderContainer, PlaceholderGrid, PlaceholderImageBox } from './index.styled'

const HomeGroceryItemPlaceholder = () => {
  return (
    <PlaceholderContainer>
      <PlaceholderGrid>
        {Array.from({ length: 10 }).map((_, index) => (
          <PlaceholderImageBox key={index} />
        ))}
      </PlaceholderGrid>
    </PlaceholderContainer>
  )
}

export default HomeGroceryItemPlaceholder