import { Container, ActionArea, Content, Media, NameSkeleton, MetaInfoSkeleton, MediaSkeleton } from './index.styled'

const ShopItemPlaceholder = () => {
  return (
    <Container aria-label="Shop item placeholder">
      <ActionArea>
        <Media>
          <MediaSkeleton variant="rectangular" />
        </Media>
        <Content>
          <NameSkeleton variant="text" />
          <MetaInfoSkeleton variant="text" />
        </Content>
      </ActionArea>
    </Container>
  )
}

export default ShopItemPlaceholder
