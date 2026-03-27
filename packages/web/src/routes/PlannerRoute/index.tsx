import StandardLayout from '../../layout/standardLayout'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { BirthdayProvider } from '../../providers/BirthdayProvider'
import { RecipeProvider } from '../../providers/RecipeProvider'
import { MealPlanProvider, useMealPlanContext } from '../../providers/MealPlanProvider'
import { AdventureProvider } from '../../providers/AdventureProvider'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import Planner from '../../components/Planner'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ModernPageHeader from '../../components/ModernPageHeader'
import MealPlanPreviewDrawer from '../../components/MealPlanPreviewDrawer'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import { Container, PlannerScrollArea } from './index.styled'
import { ScrollableContainer } from '../../components/ScrollableContainer'
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useMemo, useState } from 'react'
import { showAlert } from '../../utils/alert'
import { ActionName } from '../../providers/AppStateProvider/enums'
import { useProjectContext } from '../../providers/ProjectProvider'
import { updateToDoItems } from '../../api/toDoList'
import { PlannerViewMode } from '../../enums/plannerViewMode'
import { IMealPlan } from '../../types/mealPlan'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { Route } from '../../enums/route'

const VIEW_MODE_CYCLE = [PlannerViewMode.WEEKLY, PlannerViewMode.CALENDAR, PlannerViewMode.GROUPED] as const

const PlannerContent = () => {
  const { toDoList, refetchToDoList, updateToDoItemsBulk } = usePlannerContext()
  const { state: { selectedTodoItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()
  const [allExpanded, setAllExpanded] = useState(true)
  const [expandKey, setExpandKey] = useState(0)
  const [viewMode, setViewMode] = useState<PlannerViewMode>(PlannerViewMode.WEEKLY)
  const { mealPlans, removeMealPlan } = useMealPlanContext()
  const { defaults } = useItemDefaults({ fetchMethod: retrieveGroceryListDefaults })

  const [previewMealPlan, setPreviewMealPlan] = useState<IMealPlan | null>(null)

  const pendingItems = toDoList.filter(item => !item.isDone)
  const completedItems = toDoList.filter(item => item.isDone)

  const todayDayjs = dayjs()
  const overdueItems = toDoList.filter(
    item => !item.isDone && item.dueDate != null && dayjs(item.dueDate).isBefore(todayDayjs, 'day')
  )
  const noDateItems = toDoList.filter(
    item => !item.isDone && item.dueDate == null
  )

  // Format current date parts with consistent lengths
  const today = new Date()
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' }) // Thu
  const dayNumber = today.toLocaleDateString('en-US', { day: 'numeric' })   // 21
  const monthName = today.toLocaleDateString('en-US', { month: 'short' })   // Aug
  const yearNumber = today.toLocaleDateString('en-US', { year: 'numeric' }) // 2025

  const defaultStats = [
    { value: pendingItems.length, label: 'Pending' },
    { value: currentDay, label: 'Today' },
    { value: dayNumber, label: 'Day' },
    { value: monthName, label: 'Month' },
    { value: yearNumber, label: 'Year' }
  ]

  const calendarStats = [
    { value: pendingItems.length, label: 'Pending' },
    { value: overdueItems.length, label: 'Overdue' },
    { value: completedItems.length, label: 'Done' },
    { value: noDateItems.length, label: 'No Date' },
  ]

  const stats = viewMode === PlannerViewMode.GROUPED ? defaultStats : calendarStats

  const statusText = useMemo(() => {
    const totalItems = toDoList.length
    const selectedCount = selectedTodoItems.size

    if (totalItems === 0) {
      return "Your planner is empty"
    }

    if (selectedCount === 0) {
      if (viewMode === PlannerViewMode.CALENDAR) return "Tap a day to see its tasks"
      if (viewMode === PlannerViewMode.WEEKLY)   return "Tap a task to view details"
      return "Tap items to mark as done"
    }

    return `${selectedCount} of ${totalItems} item${totalItems === 1 ? '' : 's'} selected`
  }, [toDoList.length, selectedTodoItems.size, viewMode])

  const clearSelectedTodoItems = useCallback((selectedTodoItems: Set<string>) => {
    dispatch({
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS,
      payload: Array.from(selectedTodoItems)
    })
  }, [dispatch])

  const markToDoItemsAsDone = useCallback(async () => {
    const ids = Array.from(selectedTodoItems)
    try {
      await updateToDoItems(ids.map(id => ({ id, isDone: true })), currentProject!.id)
      updateToDoItemsBulk(ids, { isDone: true })
      clearSelectedTodoItems(selectedTodoItems)
    } catch (error) {
      console.error("Failed to mark to do items as done:", error)
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [selectedTodoItems, currentProject, dispatch, updateToDoItemsBulk, clearSelectedTodoItems])

  const toggleAll = useCallback(() => {
    setAllExpanded(!allExpanded)
    setExpandKey(prev => prev + 1) // Force re-render of sections
  }, [allExpanded])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      const idx = VIEW_MODE_CYCLE.indexOf(prev)
      return VIEW_MODE_CYCLE[(idx + 1) % VIEW_MODE_CYCLE.length]
    })
  }, [])

  const handleAddMealPlan = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem, { state: { itemType: 'meal' } })
  }, [dispatch, navigate])

  const handleMealPlanClick = useCallback((mealPlan: IMealPlan) => {
    setPreviewMealPlan(mealPlan)
  }, [])

  const handleMealPlanDelete = useCallback(async (id: string) => {
    try {
      await removeMealPlan(id)
    } catch (error) {
      console.error('Failed to delete meal plan:', error)
      showAlert({ description: 'Failed to delete meal plan', severity: 'error' }, dispatch)
    }
  }, [removeMealPlan, dispatch])

  const viewToggleIcon =
    viewMode === PlannerViewMode.CALENDAR ? <CalendarMonthIcon /> :
    viewMode === PlannerViewMode.WEEKLY ? <ViewWeekIcon /> :
    <ViewModuleIcon />

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Planner"
        icon={<ChecklistIcon />}
        stats={stats}
        accentGradient={SECTION_GRADIENTS.planner}
        accentRgb={SECTION_ACCENT_RGB.planner}
      />
      <Container>
        <ActionButtonsBar
          expandCollapseButton={{
            isExpanded: allExpanded,
            onToggle: toggleAll,
            disabled: pendingItems.length === 0 || viewMode !== PlannerViewMode.GROUPED,
          }}
          actionButton={{
            isEnabled: selectedTodoItems.size > 0,
            onClick: markToDoItemsAsDone,
            children: "Mark Tasks As Done",
            statusText: statusText,
          }}
          viewToggleButton={{
            children: viewToggleIcon,
            onClick: toggleViewMode,
          }}
        />
        <ScrollableContainer onRefresh={refetchToDoList} scrollArea={PlannerScrollArea}>
          <Planner
            allExpanded={allExpanded}
            expandKey={expandKey}
            viewMode={viewMode}
            mealPlans={mealPlans}
            onAddMealPlan={handleAddMealPlan}
            onMealPlanClick={handleMealPlanClick}
          />
        </ScrollableContainer>
      </Container>
      <MealPlanPreviewDrawer
        item={previewMealPlan}
        onClose={() => setPreviewMealPlan(null)}
        onDelete={handleMealPlanDelete}
        defaults={defaults}
      />
    </StandardLayout>
  )
}

export const PlannerRoute = () => {
  return (
    <PlannerProvider>
      <BirthdayProvider>
        <RecipeProvider>
          <MealPlanProvider>
            <AdventureProvider>
              <PlannerContent />
            </AdventureProvider>
          </MealPlanProvider>
        </RecipeProvider>
      </BirthdayProvider>
    </PlannerProvider>
  )
}

export default PlannerRoute
