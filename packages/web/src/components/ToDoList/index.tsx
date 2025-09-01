import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToDoListContext } from '../../providers/ToDoListProvider';
import { useProjectContext } from '../../providers/ProjectProvider';
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { updateToDoItems } from '../../api/toDoList';
import { showAlert } from '../../utils/alert';
import { Route } from '../../enums/route';
import { groupTodosByTime } from './utils/timeGrouping';
import { ToDoViewMode } from '../../enums/todoViewMode';
import SimpleView from './SimpleView';
import GroupedView from './GroupedView';
import Placeholder from './Placeholder';
import EmptyToDoList from './EmptyToDoList';
import { IToDoListProps } from './types';

export const ToDoList = ({
  allExpanded = true,
  expandKey = 0,
  viewMode = ToDoViewMode.GROUPED
}: IToDoListProps = {}) => {
  const { dispatch } = useAppState();
  const { toDoList, isLoading, removeFromToDoList } = useToDoListContext();
  const { currentProject } = useProjectContext();
  const navigate = useNavigate();
  const visibleToDoItems = useMemo(() => toDoList.filter(({ isDone }) => !isDone), [toDoList]);
  
  const groupedToDoItems = useMemo(() => {
    return groupTodosByTime(visibleToDoItems);
  }, [visibleToDoItems]);

  const clearSelectedTodoItems = useCallback((id: string) => {
    dispatch({ 
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS, 
      payload: [ id ] 
    })
  }, [dispatch])

  const markToDoItemAsDone = useCallback(async (id: string) => {
    try {
      await updateToDoItems([{ id, isDone: true }], currentProject!.id);
      clearSelectedTodoItems(id)
      removeFromToDoList(id)
    } catch (error) {
      console.error("Failed to mark to do items as done:", error);
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [currentProject, dispatch, clearSelectedTodoItems, removeFromToDoList]);

  const handleEdit = useCallback((id: string) => {
    navigate(Route.EditToDoItem.replace(':id', id))
  }, [navigate]);

  if (isLoading) {
    return <Placeholder />
  }

  if (toDoList.length === 0) {
    return <EmptyToDoList />
  }

  if (viewMode === ToDoViewMode.SIMPLE) {
    return (
      <SimpleView
        visibleToDoItems={visibleToDoItems}
        allExpanded={allExpanded}
        expandKey={expandKey}
        onSwipeAction={markToDoItemAsDone}
        onEditAction={handleEdit}
      />
    );
  }

  return (
    <GroupedView
      groupedToDoItems={groupedToDoItems}
      allExpanded={allExpanded}
      expandKey={expandKey}
      onSwipeAction={markToDoItemAsDone}
      onEditAction={handleEdit}
    />
  );
};

export default ToDoList;
