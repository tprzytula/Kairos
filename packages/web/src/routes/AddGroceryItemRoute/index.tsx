import { Container, Header } from './index.styled'
import Navigation from '../../components/Navigation'

export const AddGroceryItemRoute = () => {
  return (
    <Container>
      <Header>
        Add Grocery Item
      </Header>
      <Navigation previousRoute="/groceries" />
    </Container>
  )
}

export default AddGroceryItemRoute;
