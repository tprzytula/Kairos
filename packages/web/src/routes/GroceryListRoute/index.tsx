import { Container, ActionArea } from './index.styled'
import Navigation from '../../components/Navigation'
import NavigateButton from '../../components/NavigateButton'
import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import Header from '../../components/Header'
import { Route } from '../../enums/route'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <Container>
        <Header title="Grocery List" />
        <GroceryList />
        <ActionArea>
          <RemovePurchasedItemsButton />
          <Navigation
            previousRoute={Route.Home}
            actionButton={
              <NavigateButton 
                ariaLabel="Add Item" 
                route={Route.AddGroceryItem}
              />
            } 
          />
        </ActionArea>
      </Container>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
