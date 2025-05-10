import { GroceryList } from '../../components/GroceryList'
import { GroceryListProvider } from '../../providers/GroceryListProvider'
import { RemovePurchasedItemsButton } from '../../components/RemovePurchasedItemsButton'
import StandardLayout from '../../layout/standardLayout'

export const GroceryListRoute = () => {
  return (
    <GroceryListProvider>
      <StandardLayout
        title="Grocery List" 
      >
        <GroceryList />
        <RemovePurchasedItemsButton />
      </StandardLayout>
    </GroceryListProvider>
  )
}

export default GroceryListRoute
