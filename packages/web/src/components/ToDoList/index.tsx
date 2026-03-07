import { useCallback, useMemo, useState } from 'react';
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
import { ITodoItem } from '../../api/toDoList/retrieve/types';
import { IBirthdayItem } from '../../api/birthdays/retrieve/types';
import { useBirthdayContext } from '../../providers/BirthdayProvider';
import BirthdayPreviewDrawer from '../BirthdayPreviewDrawer';
import BirthdayFormDialog from '../BirthdayFormDialog';
import SimpleView from './SimpleView';
import GroupedView from './GroupedView';
import CalendarView from './CalendarView';
import Placeholder from './Placeholder';
import EmptyToDoList from './EmptyToDoList';
import ToDoItemPreviewDrawer from '../ToDoItemPreviewDrawer';
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
  const [previewItem, setPreviewItem] = useState<ITodoItem | null>(null);
  const [previewBirthday, setPreviewBirthday] = useState<IBirthdayItem | null>(null);
  const [birthdayDialogOpen, setBirthdayDialogOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<IBirthdayItem | null>(null);
  const { birthdays, removeBirthdayItem } = useBirthdayContext();
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

  const handlePreview = useCallback((id: string) => {
    setPreviewItem(toDoList.find(item => item.id === id) ?? null)
  }, [toDoList]);

  const handleBirthdayPreview = useCallback((id: string) => {
    setPreviewBirthday(birthdays.find(b => b.id === id) ?? null)
  }, [birthdays]);

  const handleBirthdayEdit = useCallback((item: IBirthdayItem) => {
    setEditingBirthday(item);
    setBirthdayDialogOpen(true);
  }, []);

  const handleBirthdayDelete = useCallback(async (id: string) => {
    await removeBirthdayItem(id);
  }, [removeBirthdayItem]);

  if (viewMode === ToDoViewMode.CALENDAR) {
    return (
      <>
        {isLoading ? <Placeholder /> : (
          <CalendarView
            visibleToDoItems={toDoList}
            onItemClick={handlePreview}
            birthdayItems={birthdays}
            onBirthdayClick={handleBirthdayPreview}
          />
        )}
        <ToDoItemPreviewDrawer
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onEdit={handleEdit}
        />
        <BirthdayPreviewDrawer
          item={previewBirthday}
          onClose={() => setPreviewBirthday(null)}
          onEdit={handleBirthdayEdit}
          onDelete={handleBirthdayDelete}
        />
        <BirthdayFormDialog
          open={birthdayDialogOpen}
          onClose={() => { setBirthdayDialogOpen(false); setEditingBirthday(null); }}
          initialBirthday={editingBirthday}
        />
      </>
    );
  }

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
