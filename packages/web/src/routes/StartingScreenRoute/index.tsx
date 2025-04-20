import { GroceryListButton } from './index.styled'
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

  useEffect(() => {
    if (skipStartingScreen) {
      navigate(Route.GroceryList)
    }
  }, [skipStartingScreen, navigate])

  return (
    <StandardLayout
      title="Kairos"
    >
      <GroceryListButton onClick={navigateToGroceryList}>
        Grocery List
      </GroceryListButton>
    </StandardLayout>
  )
}

export default StartingScreenRoute;
