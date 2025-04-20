import { render, screen, waitFor } from "@testing-library/react";
import GroceryItem from ".";
import { useAppState } from "../../providers/AppStateProvider";
import { GroceryItemUnit } from "../../enums/groceryItem";
import { ActionName } from "../../providers/AppStateProvider/enums";

jest.mock("../../providers/AppStateProvider");

describe("Given the GroceryItem component", () => {
  it("should render the component with correct props", () => {
    mockAppState();
    renderGroceryItem();
    
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.name)).toBeVisible();
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.quantity)).toBeVisible();
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.unit)).toBeVisible();
  });

  describe("When the user clicks the item", () => {
    it("should dispatch the purchaseGroceryItem action", async () => {
      const dispatch = mockAppState();
      renderGroceryItem();

      await waitFor(() => {
        screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.name).click();
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: ActionName.PURCHASE_GROCERY_ITEM,
        payload: { id: EXAMPLE_GROCERY_ITEM_PROPS.id },
      });
    });
  });

  describe("When the item is purchased", () => {
    describe("And the user clicks the item", () => {
      it("should dispatch the clearPurchasedItem action", async () => {
        const dispatch = mockAppState(new Set([EXAMPLE_GROCERY_ITEM_PROPS.id]));

        renderGroceryItem();

        await waitFor(() => {
          screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.name).click();
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: ActionName.CLEAR_PURCHASED_ITEM,
          payload: { id: EXAMPLE_GROCERY_ITEM_PROPS.id },
        });
      });
    });
  });
});

const renderGroceryItem = () => {
  render(<GroceryItem {...EXAMPLE_GROCERY_ITEM_PROPS} />);
};

const mockAppState = (purchasedItems: Set<string> = new Set()) => {
  const dispatch = jest.fn();

  (useAppState as jest.Mock).mockReturnValue({
    state: { purchasedItems },
    dispatch,
  });

  return dispatch;
};

const EXAMPLE_GROCERY_ITEM_PROPS = {
  id: "1",
  name: "Test Item",
  quantity: 2,
  imagePath: "/test-image.jpg",
  unit: GroceryItemUnit.KILOGRAM,
};
