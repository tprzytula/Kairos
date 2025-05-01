import { render, screen, waitFor } from "@testing-library/react";
import ToDoItem from ".";
import { useAppState } from "../../providers/AppStateProvider";
import { ActionName } from "../../providers/AppStateProvider/enums";
import { ThemeProvider, createTheme } from "@mui/material/styles";

jest.mock("../../providers/AppStateProvider");

describe("Given the ToDoItem component", () => {
  it("should render the component with correct props", () => {
    mockAppState();
    renderToDoItem();
    
    expect(screen.getByText(EXAMPLE_TO_DO_ITEM_PROPS.name)).toBeVisible();
    expect(screen.getByText(EXAMPLE_TO_DO_ITEM_PROPS.description)).toBeVisible();
    expect(screen.getByText('4/30/2025')).toBeVisible();
  });

  describe("When the user clicks the item", () => {
    it("should dispatch the purchaseGroceryItem action", async () => {
      const dispatch = mockAppState();
      renderToDoItem();

      await waitFor(() => {
        screen.getByText(EXAMPLE_TO_DO_ITEM_PROPS.name).click();
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: ActionName.SELECT_TODO_ITEM,
        payload: { id: EXAMPLE_TO_DO_ITEM_PROPS.id },
      });
    });
  });

  describe("When the item is purchased", () => {
    describe("And the user clicks the item", () => {
      it("should dispatch the unselectTodoItem action", async () => {
        const dispatch = mockAppState(new Set([EXAMPLE_TO_DO_ITEM_PROPS.id]));

        renderToDoItem();

        await waitFor(() => {
          screen.getByText(EXAMPLE_TO_DO_ITEM_PROPS.name).click();
        });

        expect(dispatch).toHaveBeenCalledWith({
          type: ActionName.UNSELECT_TODO_ITEM,
          payload: { id: EXAMPLE_TO_DO_ITEM_PROPS.id },
        });
      });
    });
  });
});

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}
const renderToDoItem = () => {
  renderWithTheme(<ToDoItem {...EXAMPLE_TO_DO_ITEM_PROPS} />);
};

const mockAppState = (selectedTodoItems: Set<string> = new Set()) => {
  const dispatch = jest.fn();

  (useAppState as jest.Mock).mockReturnValue({
    state: { selectedTodoItems },
    dispatch,
  });

  return dispatch;
};

const EXAMPLE_TO_DO_ITEM_PROPS = {
  id: "1",
  name: "Test Item",
  description: "Test Description",
  dueDate: 1746042442000,
  isDone: false,
};
