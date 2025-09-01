import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useToDoListContext } from '../../providers/ToDoListProvider';
import { useProjectContext } from '../../providers/ProjectProvider';
import ToDoItem from '../ToDoItem';
import ToDoItemPlaceholder from '../ToDoItem/Placeholder';
import CollapsibleSectionPlaceholder from '../CollapsibleSectionPlaceholder';
import CollapsibleSection from '../CollapsibleSection';
import { Container } from './index.styled';
import EmptyState from '../EmptyState';
import SwipeableList from '../SwipeableList';
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { updateToDoItems } from '../../api/toDoList';
import { showAlert } from '../../utils/alert';
import { Route } from '../../enums/route';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import { groupTodosByTime, TimeGroup, TIME_GROUP_META } from './utils/timeGrouping';
import { ToDoViewMode } from '../../enums/todoViewMode';
import { SectionIcon } from '../CollapsibleSection/types';

const TIME_GROUP_ICON_MAP: Record<TimeGroup, SectionIcon> = {
  [TimeGroup.OVERDUE]: { emoji: '⚠️', backgroundColor: '#fef2f2', foregroundColor: '#dc2626' },
  [TimeGroup.TODAY]: { emoji: '📅', backgroundColor: '#ecfdf5', foregroundColor: '#059669' },
  [TimeGroup.TOMORROW]: { emoji: '📌', backgroundColor: '#eff6ff', foregroundColor: '#2563eb' },
  [TimeGroup.THIS_WEEK]: { emoji: '📆', backgroundColor: '#fefce8', foregroundColor: '#ca8a04' },
  [TimeGroup.NEXT_WEEK]: { emoji: '🗓️', backgroundColor: '#f0f9ff', foregroundColor: '#0284c7' },
  [TimeGroup.LATER]: { emoji: '⏳', backgroundColor: '#f8fafc', foregroundColor: '#64748b' },
  [TimeGroup.NO_DUE_DATE]: { emoji: '📝', backgroundColor: '#f5f5f5', foregroundColor: '#6b7280' },
}

const ALL_TASKS_ICON: SectionIcon = {
  emoji: '✅',
  backgroundColor: '#f0f9ff',
  foregroundColor: '#0284c7'
}

const PlaceholderComponent = () => (
  <Container>
    <div aria-label="Loading to-do items">
      {Array.from({ length: 4 }).map((_, groupIndex) => (
        <CollapsibleSectionPlaceholder key={groupIndex}>
          {Array.from({ length: 3 + groupIndex }).map((_, itemIndex) => (
            <ToDoItemPlaceholder key={itemIndex} />
          ))}
        </CollapsibleSectionPlaceholder>
      ))}
    </div>
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
        <CollapsibleSection
          title="All Tasks"
          icon={ALL_TASKS_ICON}
          items={visibleToDoItems}
          expandTo={allExpanded}
          expandKey={expandKey}
        >
          <SwipeableList
            component={ToDoItem}
            list={visibleToDoItems}
            onSwipeAction={markToDoItemAsDone}
            onEditAction={handleEdit}
            threshold={0.3}
          />
        </CollapsibleSection>
      </Container>
    );
  }

  return (
    <Container>
      {groupedToDoItems.map(({ group, groupLabel, items }) => (
        <CollapsibleSection
          key={group}
          title={groupLabel}
          icon={TIME_GROUP_ICON_MAP[group]}
          items={items}
          expandTo={allExpanded}
          expandKey={expandKey}
        >
          <SwipeableList
            component={ToDoItem}
            list={items}
            onSwipeAction={markToDoItemAsDone}
            onEditAction={handleEdit}
            threshold={0.3}
          />
        </CollapsibleSection>
      ))}
    </Container>
  );
};

export default ToDoList;
