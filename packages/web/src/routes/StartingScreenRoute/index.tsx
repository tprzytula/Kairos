import { Container, GroceryListButton, Content } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import Header from '../../components/Header'
import { Route } from '../../enums/route'

export const StartingScreenRoute = () => {
  const navigate = useNavigate()

  const navigateToGroceryList = useCallback(() => {
    navigate(Route.GroceryList)
  }, [navigate])

  return (
    <Container>
      <Header title="Kairos" />
      <Content>
        <GroceryListButton onClick={navigateToGroceryList}>
          Grocery List
        </GroceryListButton>
      </Content>
    </Container>
  )
}

export default StartingScreenRoute;
