import { Container } from './index.styled'
import Navigation from '../../components/Navigation'
import AddItemButton from '../../components/AddItemButton'
import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import Header from '../../components/Header'
import { Route } from '../../enums/route'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <Container>
        <Header title="Grocery List" />
        <GroceryList />
        <Navigation
          previousRoute={Route.Home}
          actionButton={
            <AddItemButton 
              ariaLabel="Add Item" 
              route={Route.AddGroceryItem}
            />
          } 
        />
      </Container>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
