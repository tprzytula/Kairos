import { useAppState } from "../../providers/AppStateProvider";
import { useCallback, useMemo } from "react";
import { showAlert } from "../../utils/alert";
import { ActionName } from "../../providers/AppStateProvider/enums";
import { useToDoListContext } from "../../providers/ToDoListProvider";
import { useProjectContext } from "../../providers/ProjectProvider";
import { updateToDoItems } from "../../api/toDoList";
import { DoneButton, DoneButtonContainer, StatusText } from "./index.styled";

export const MarkToDoItemsAsDoneButton = () => {
  const { state: { selectedTodoItems }, dispatch } = useAppState();
  const { toDoList, refetchToDoList } = useToDoListContext();
  const { currentProject } = useProjectContext();

  const statusText = useMemo(() => {
    const totalItems = toDoList.length;
    const selectedCount = selectedTodoItems.size;
    
    if (totalItems === 0) {
      return "Your to-do list is empty";
    }
    
    if (selectedCount === 0) {
      return "Tap items to mark as done";
    }
    
    return `${selectedCount} of ${totalItems} item${totalItems === 1 ? '' : 's'} selected`;
  }, [toDoList.length, selectedTodoItems.size]);

  const clearSelectedTodoItems = useCallback((selectedTodoItems: Set<string>) => {
    dispatch({ 
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS, 
      payload: Array.from(selectedTodoItems) 
    })
  }, [dispatch])

  const markToDoItemsAsDone = useCallback(async () => {
    try {
      await updateToDoItems(Array.from(selectedTodoItems).map(id => ({ id, isDone: true })), currentProject!.id);
      clearSelectedTodoItems(selectedTodoItems)
      refetchToDoList()
    } catch (error) {
      console.error("Failed to mark to do items as done:", error);
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [selectedTodoItems, currentProject, dispatch, refetchToDoList, clearSelectedTodoItems]);

  return (
    <DoneButtonContainer>
      {selectedTodoItems.size > 0 ? (
        <DoneButton
          variant="contained"
          color="primary"
          onClick={markToDoItemsAsDone}
          aria-label="Mark To Do Items As Done"
        >
          Mark To Do Items As Done
        </DoneButton>
      ) : (
        <StatusText>
          {statusText}
        </StatusText>
      )}
    </DoneButtonContainer>
  );
};

export default MarkToDoItemsAsDoneButton;
