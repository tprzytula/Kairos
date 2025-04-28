import { StyledButton } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback, useEffect } from 'react'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { ShoppingCart, VolumeUp, List } from '@mui/icons-material'

export const StartingScreenRoute = () => {
  const { state: { skipStartingScreen } } = useAppState()
  const navigate = useNavigate()

  const navigateToGroceryList = useCallback(() => {
    navigate(Route.GroceryList)
  }, [navigate])

  const navigateToNoiseTracking = useCallback(() => {
    navigate(Route.NoiseTracking)
  }, [navigate])

  const navigateToToDoList = useCallback(() => {
    navigate(Route.ToDoList)
  }, [navigate])

  useEffect(() => {
    if (skipStartingScreen) {
      navigate(Route.GroceryList)
    }
  }, [skipStartingScreen, navigate])

  return (
    <StandardLayout
      title="Kairos"
    >
      <StyledButton color="primary" onClick={navigateToGroceryList}>
        <ShoppingCart />
        <span>Grocery List</span>
      </StyledButton>
      <StyledButton color="success" onClick={navigateToNoiseTracking}>
        <VolumeUp />
        <span>Noise Tracking</span>
      </StyledButton>
      <StyledButton color="info" onClick={navigateToToDoList}>
        <List />
        <span>To Do List</span>
      </StyledButton>
    </StandardLayout>
  )
}

export default StartingScreenRoute;
