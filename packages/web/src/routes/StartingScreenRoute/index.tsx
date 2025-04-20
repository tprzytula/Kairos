import { GroceryListButton } from './index.styled'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'

export const StartingScreenRoute = () => {
  const navigate = useNavigate()

  const navigateToGroceryList = useCallback(() => {
    navigate(Route.GroceryList)
  }, [navigate])

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
