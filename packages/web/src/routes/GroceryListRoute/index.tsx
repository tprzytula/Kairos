import { Container, Header } from './index.styled'
import Navigation from '../../components/Navigation'
import AddItemButton from '../../components/AddItemButton'
import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <Container>
        <Header>
          Grocery List
      </Header>
      <GroceryList />
        <Navigation previousRoute="/" actionButton={<AddItemButton ariaLabel="Add Item" route="/groceries/add" />} />
      </Container>
    </GroceryListProvider>
  )
}

export default GroceryListRoute;
