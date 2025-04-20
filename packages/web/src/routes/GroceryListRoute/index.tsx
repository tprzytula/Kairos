import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import { Route } from '../../enums/route'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import StandardLayout from '../../layout/standardLayout'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <StandardLayout 
        title="Grocery List" 
        previousRoute={Route.Home} 
        nextRoute={Route.AddGroceryItem}
      >
        <GroceryList />
        <RemovePurchasedItemsButton />
      </StandardLayout>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
