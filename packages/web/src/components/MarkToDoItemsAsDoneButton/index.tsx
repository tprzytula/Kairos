import { useAppState } from "../../providers/AppStateProvider";
import { ActionButton } from "../ActionButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback } from "react";
import { showAlert } from "../../utils/alert";
import { ActionName } from "../../providers/AppStateProvider/enums";
import { useToDoListContext } from "../../providers/ToDoListProvider";
import { updateToDoItems } from "../../api/toDoList";

export const MarkToDoItemsAsDoneButton = () => {
  const { state: { selectedTodoItems }, dispatch } = useAppState();
  const { refetchToDoList } = useToDoListContext()

  const clearSelectedTodoItems = useCallback((selectedTodoItems: Set<string>) => {
    dispatch({ 
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS, 
      payload: Array.from(selectedTodoItems) 
    })
  }, [dispatch])

  const markToDoItemsAsDone = useCallback(async () => {
    try {
      await updateToDoItems(Array.from(selectedTodoItems).map(id => ({ id, isDone: true })));
      clearSelectedTodoItems(selectedTodoItems)
      refetchToDoList()
    } catch (error) {
      console.error("Failed to mark to do items as done:", error);
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [selectedTodoItems, dispatch, refetchToDoList]);

  return (
    <ActionButton
      ariaLabel="Mark To Do Items As Done"
      icon={<DeleteIcon />}
      onClick={markToDoItemsAsDone}
      text="Mark To Do Items As Done"
      sx={{
        visibility: selectedTodoItems.size > 0 ? "visible" : "hidden",
        borderRadius: "10px",
      }}
    />
  );
};

export default MarkToDoItemsAsDoneButton;
