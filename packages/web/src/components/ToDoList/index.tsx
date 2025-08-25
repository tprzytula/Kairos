import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToDoListContext } from '../../providers/ToDoListProvider';
import { useProjectContext } from '../../providers/ProjectProvider';
import ToDoItem from '../ToDoItem';
import ToDoItemPlaceholder from '../ToDoItemPlaceholder';
import ToDoTimeSection from '../ToDoTimeSection';
import { Container } from './index.styled';
import EmptyState from '../EmptyState';
import SwipeableList from '../SwipeableList';
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { updateToDoItems } from '../../api/toDoList';
import { showAlert } from '../../utils/alert';
import { Route } from '../../enums/route';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { groupTodosByTime } from './utils/timeGrouping';
import { ToDoViewMode } from '../../enums/todoViewMode';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <ToDoItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <Container>
    <EmptyState 
      icon={<ChecklistOutlinedIcon aria-label="Empty to-do list" />}
      title="No pending to-do items found"
      subtitle="Tap the + button to add your first task"
    />
  </Container>
)

export const ToDoList = ({ 
  allExpanded, 
  expandKey, 
  viewMode = ToDoViewMode.GROUPED 
}: { 
  allExpanded?: boolean; 
  expandKey?: string | number; 
  viewMode?: ToDoViewMode;
}) => {
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
    return <PlaceholderComponent />
  }

  if (toDoList.length === 0) {
    return <EmptyListComponent />
  }

  if (viewMode === ToDoViewMode.SIMPLE) {
    return (
      <Container>
        <ToDoTimeSection
          group="all"
          groupLabel="All Tasks"
          items={visibleToDoItems}
          onSwipeAction={markToDoItemAsDone}
          onEditAction={handleEdit}
          expandTo={allExpanded}
          expandKey={expandKey}
        />
      </Container>
    );
  }

  return (
    <Container>
      {groupedToDoItems.map(({ group, groupLabel, items }) => (
        <ToDoTimeSection
          key={group}
          group={group}
          groupLabel={groupLabel}
          items={items}
          onSwipeAction={markToDoItemAsDone}
          onEditAction={handleEdit}
          expandTo={allExpanded}
          expandKey={expandKey}
        />
      ))}
    </Container>
  );
};

export default ToDoList;
