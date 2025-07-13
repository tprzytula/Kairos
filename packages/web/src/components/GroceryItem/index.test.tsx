import { render, screen, waitFor } from "@testing-library/react";
import GroceryItem from ".";
import { useAppState } from "../../providers/AppStateProvider";
import { useGroceryListContext } from "../../providers/GroceryListProvider";
import { GroceryItemUnit } from "../../enums/groceryItem";
import { ActionName } from "../../providers/AppStateProvider/enums";

jest.mock("../../providers/AppStateProvider");
jest.mock("../../providers/GroceryListProvider");

describe("Given the GroceryItem component", () => {
  it("should render the component with correct props", () => {
    mockAppState();
    mockGroceryListContext();
    renderGroceryItem();
    
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.name)).toBeVisible();
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.quantity)).toBeVisible();
    expect(screen.getByText(EXAMPLE_GROCERY_ITEM_PROPS.unit)).toBeVisible();
  });

  describe("When the user clicks the item", () => {
    it("should dispatch the purchaseGroceryItem action", async () => {
      const dispatch = mockAppState();
      mockGroceryListContext();
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
        mockGroceryListContext();

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

    describe("And the user tries to interact with quantity buttons", () => {
      it("should disable the increment button", () => {
        mockAppState(new Set([EXAMPLE_GROCERY_ITEM_PROPS.id]));
        mockGroceryListContext();
        renderGroceryItem();

        const incrementButton = screen.getByLabelText("Increase quantity");
        expect(incrementButton).toBeInTheDocument();
        expect(incrementButton).toBeDisabled();
      });

      it("should disable the decrement button", () => {
        mockAppState(new Set([EXAMPLE_GROCERY_ITEM_PROPS.id]));
        mockGroceryListContext();
        renderGroceryItem();

        const decrementButton = screen.getByLabelText("Decrease quantity");
        expect(decrementButton).toBeInTheDocument();
        expect(decrementButton).toBeDisabled();
      });
    });
  });

  describe("When the user clicks the increment button", () => {
    it("should call updateGroceryItem with increased quantity", async () => {
      mockAppState();
      const updateGroceryItem = mockGroceryListContext();
      renderGroceryItem();

      await waitFor(() => {
        screen.getByLabelText("Increase quantity").click();
      });

      expect(updateGroceryItem).toHaveBeenCalledWith(EXAMPLE_GROCERY_ITEM_PROPS.id, EXAMPLE_GROCERY_ITEM_PROPS.quantity + 1);
    });
  });

  describe("When the user clicks the decrement button", () => {
    it("should call updateGroceryItem with decreased quantity", async () => {
      mockAppState();
      const updateGroceryItem = mockGroceryListContext();
      renderGroceryItem();

      await waitFor(() => {
        screen.getByLabelText("Decrease quantity").click();
      });

      expect(updateGroceryItem).toHaveBeenCalledWith(EXAMPLE_GROCERY_ITEM_PROPS.id, EXAMPLE_GROCERY_ITEM_PROPS.quantity - 1);
    });

    describe("When the quantity is 1", () => {
      it("should render the decrement button as disabled", () => {
        mockAppState();
        mockGroceryListContext();
        render(<GroceryItem {...EXAMPLE_GROCERY_ITEM_PROPS} quantity={1} />);

        const decrementButton = screen.getByLabelText("Decrease quantity");
        expect(decrementButton).toBeInTheDocument();
        expect(decrementButton).toBeDisabled();
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

const mockGroceryListContext = () => {
  const updateGroceryItem = jest.fn();

  (useGroceryListContext as jest.Mock).mockReturnValue({
    updateGroceryItem,
  });

  return updateGroceryItem;
};

const EXAMPLE_GROCERY_ITEM_PROPS = {
  id: "1",
  name: "Test Item",
  quantity: 2,
  imagePath: "/test-image.jpg",
  unit: GroceryItemUnit.KILOGRAM,
};
