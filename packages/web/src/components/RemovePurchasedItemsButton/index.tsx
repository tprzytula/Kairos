import { useAppState } from "../../providers/AppStateProvider";
import { useCallback, useMemo } from "react";
import { removeGroceryItems } from "../../api/groceryList";
import { showAlert } from "../../utils/alert";
import { useGroceryListContext } from "../../providers/GroceryListProvider";
import { ActionName } from "../../providers/AppStateProvider/enums";
import { RemoveButton, RemoveButtonContainer, StatusText } from "./index.styled";

export const RemovePurchasedItemsButton = () => {
  const { state: { purchasedItems }, dispatch } = useAppState();
  const { groceryList, refetchGroceryList } = useGroceryListContext()

  const statusText = useMemo(() => {
    const totalItems = groceryList.length;
    const purchasedCount = purchasedItems.size;
    
    if (totalItems === 0) {
      return "Your grocery list is empty";
    }
    
    if (purchasedCount === 0) {
      return `${totalItems} item${totalItems === 1 ? '' : 's'} in your list`;
    }
    
    return `${purchasedCount} of ${totalItems} item${totalItems === 1 ? '' : 's'} purchased`;
  }, [groceryList.length, purchasedItems.size]);

  const clearPurchasedItems = useCallback((purchasedItems: Set<string>) => {
    dispatch({ 
      type: ActionName.CLEAR_PURCHASED_ITEMS, 
      payload: Array.from(purchasedItems) 
    })
  }, [dispatch])

  const removePurchasedItems = useCallback(async () => {
    try {
      await removeGroceryItems(Array.from(purchasedItems));
      clearPurchasedItems(purchasedItems)
      refetchGroceryList()
    } catch (error) {
      console.error("Failed to remove purchased items:", error);
      showAlert({
        description: "Failed to remove purchased items",
        severity: "error",
      }, dispatch)
    }
  }, [purchasedItems, dispatch, refetchGroceryList]);

  return (
    <RemoveButtonContainer>
      {purchasedItems.size > 0 ? (
        <RemoveButton
          variant="contained"
          color="primary"
          onClick={removePurchasedItems}
          aria-label="Remove Purchased Items"
        >
          Remove Purchased Items
        </RemoveButton>
      ) : (
        <StatusText>
          {statusText}
        </StatusText>
      )}
    </RemoveButtonContainer>
  );
};

export default RemovePurchasedItemsButton;
