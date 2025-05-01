import { Container, Header, GroceryListButton, Content } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'

export const StartingScreen = () => {
  const navigate = useNavigate()

  const navigateToGroceryList = useCallback(() => {
    navigate('/groceries')
  }, [navigate])

  return (
    <Container>
      <Header>
        Kairos
      </Header>
      <Content>
        <GroceryListButton onClick={navigateToGroceryList}>
          Grocery List
        </GroceryListButton>
      </Content>
    </Container>
  )
}

export default StartingScreen;
