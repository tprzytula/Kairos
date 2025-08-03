import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import StandardLayout from '../../layout/standardLayout'
import { Container, ScrollableContainer } from './index.styled'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <StandardLayout
        title="Grocery List" 
      >
        <Container>
          <RemovePurchasedItemsButton />
          <ScrollableContainer>
            <GroceryList />
          </ScrollableContainer>
        </Container>
      </StandardLayout>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
