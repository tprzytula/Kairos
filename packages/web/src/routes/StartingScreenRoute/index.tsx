import { StyledButton } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback, useEffect } from 'react'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'

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
      <StyledButton onClick={navigateToGroceryList}>
        Grocery List
      </StyledButton>
      <StyledButton onClick={navigateToNoiseTracking}>
        Noise Tracking
      </StyledButton>
    </StandardLayout>
  )
}

export default StartingScreenRoute;
