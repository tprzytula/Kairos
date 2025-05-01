import { useAppState } from "../../providers/AppStateProvider";
import { ActionButton } from "../ActionButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback } from "react";
import { removeGroceryItems } from "../../api/groceryList";
import { showAlert } from "../../utils/alert";
import { useGroceryListContext } from "../../providers/GroceryListProvider";
import { ActionName } from "../../providers/AppStateProvider/enums";

export const RemovePurchasedItemsButton = () => {
  const { state: { purchasedItems }, dispatch } = useAppState();
  const { refetchGroceryList } = useGroceryListContext()

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
    <ActionButton
      ariaLabel="Remove Purchased Items"
      icon={<DeleteIcon />}
      onClick={removePurchasedItems}
      text="Remove Purchased Items"
      sx={{
        visibility: purchasedItems.size > 0 ? "visible" : "hidden",
        borderRadius: "10px",
      }}
    />
  );
};

export default RemovePurchasedItemsButton;
