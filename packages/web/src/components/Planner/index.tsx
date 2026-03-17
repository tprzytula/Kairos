import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import { usePlannerContext } from '../../providers/PlannerProvider';
import { useProjectContext } from '../../providers/ProjectProvider';
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { removeTodoItems, updateToDoItems } from '../../api/toDoList';
import { showAlert } from '../../utils/alert';
import { Route } from '../../enums/route';
import { groupTodosByTime } from './utils/timeGrouping';
import { PlannerViewMode } from '../../enums/plannerViewMode';
import { ITodoItem } from '../../api/toDoList/retrieve/types';
import { IBirthdayItem } from '../../api/birthdays/retrieve/types';
import { useBirthdayContext } from '../../providers/BirthdayProvider';
import BirthdayPreviewDrawer from '../BirthdayPreviewDrawer';
import BirthdayFormDialog from '../BirthdayFormDialog';
import GroupedView from './GroupedView';
import CalendarView from './CalendarView';
import WeeklyView from './WeeklyView';
import Placeholder from './Placeholder';
import EmptyPlanner from './EmptyPlanner';
import ToDoItemPreviewDrawer from '../ToDoItemPreviewDrawer';
import { IToDoListProps } from './types';

export const Planner = ({
  allExpanded = true,
  expandKey = 0,
  viewMode = PlannerViewMode.CALENDAR,
  mealPlans = [],
  onAddMealPlan,
  onMealPlanClick,
}: IToDoListProps = {}) => {
  const { dispatch } = useAppState();
  const { user } = useAuth();
  const { toDoList, isLoading, removeFromToDoList, updateToDoItemFields } = usePlannerContext();
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
    navigate(Route.EditPlannerItem.replace(':id', id))
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

  const handleDeleteTodo = useCallback(async (id: string) => {
    try {
      await removeTodoItems([id], currentProject!.id, user?.access_token);
      clearSelectedTodoItems(id);
      removeFromToDoList(id);
    } catch (error) {
      console.error('Failed to delete todo item:', error);
      showAlert({ description: 'Failed to delete task', severity: 'error' }, dispatch);
    }
  }, [currentProject, user, dispatch, clearSelectedTodoItems, removeFromToDoList]);

  const handleBirthdayDelete = useCallback(async (id: string) => {
    await removeBirthdayItem(id);
  }, [removeBirthdayItem]);

  const handleAddTask = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem)
  }, [dispatch, navigate])

  const handleStepToggle = useCallback(async (todoId: string, stepId: string, isDone: boolean) => {
    const item = toDoList.find(t => t.id === todoId)
    if (!item?.steps) return
    const updatedSteps = item.steps.map(s => s.id === stepId ? { ...s, isDone } : s)
    setPreviewItem({ ...item, steps: updatedSteps })
    try {
      await updateToDoItemFields(todoId, { steps: updatedSteps })
    } catch (error) {
      console.error('Failed to update step:', error)
    }
  }, [toDoList, updateToDoItemFields])

  const drawers = (
    <>
      <ToDoItemPreviewDrawer
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={handleEdit}
        onMarkDone={markToDoItemAsDone}
        onStepToggle={handleStepToggle}
        onDelete={handleDeleteTodo}
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

  if (viewMode === PlannerViewMode.CALENDAR) {
    return (
      <>
        {isLoading ? <Placeholder /> : (
          <CalendarView
            visibleToDoItems={toDoList}
            onItemClick={handlePreview}
            birthdayItems={birthdays}
            onBirthdayClick={handleBirthdayPreview}
            mealPlans={mealPlans}
            onAddMealPlan={onAddMealPlan}
            onMealPlanClick={onMealPlanClick}
            onAddTask={handleAddTask}
          />
        )}
        {drawers}
      </>
    );
  }

  if (viewMode === PlannerViewMode.WEEKLY) {
    return (
      <>
        {isLoading ? <Placeholder /> : (
          <WeeklyView
            visibleToDoItems={toDoList}
            onItemClick={handlePreview}
            birthdayItems={birthdays}
            onBirthdayClick={handleBirthdayPreview}
            mealPlans={mealPlans}
            onAddMealPlan={onAddMealPlan}
            onMealPlanClick={onMealPlanClick}
          />
        )}
        {drawers}
      </>
    );
  }

  if (isLoading) {
    return <Placeholder />
  }

  if (toDoList.length === 0) {
    return <EmptyPlanner />
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

export default Planner;
