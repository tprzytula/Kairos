import { StyledButton } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback, useEffect } from 'react'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { ShoppingCart, VolumeUp } from '@mui/icons-material'

export const StartingScreenRoute = () => {
  const { state: { skipStartingScreen } } = useAppState()
  const navigate = useNavigate()

  const navigateToGroceryList = useCallback(() => {
    navigate(Route.GroceryList)
  }, [navigate])

  const navigateToNoiseTracking = useCallback(() => {
    navigate(Route.NoiseTracking)
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
      <StyledButton onClick={navigateToGroceryList} color="primary">
        <ShoppingCart />
        <span>Grocery List</span>
      </StyledButton>
      <StyledButton onClick={navigateToNoiseTracking} color="secondary">
        <VolumeUp />
        <span>Noise Tracking</span>
      </StyledButton>
    </StandardLayout>
  )
}

export default StartingScreenRoute;
