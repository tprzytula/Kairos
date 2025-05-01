import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import { Route } from '../../enums/route'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'

export const GroceryListRoute = () => {
  const { state: { skipStartingScreen } } = useAppState()

  return (
    <GroceryListProvider>
      <StandardLayout
        title="Grocery List" 
        previousRoute={skipStartingScreen ? undefined : Route.Home} 
        nextRoute={Route.AddGroceryItem}
      >
        <GroceryList />
        <RemovePurchasedItemsButton />
      </StandardLayout>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
