import { Container } from './index.styled'
import Navigation from '../../components/Navigation'
import Header from '../../components/Header'
export const AddGroceryItemRoute = () => {
  return (
    <Container>
      <Header title="Add Grocery Item" />
      <Navigation previousRoute="/groceries" />
    </Container>
  )
}

export default AddGroceryItemRoute;
