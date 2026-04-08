import StandardLayout from '../../layout/standardLayout'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { BirthdayProvider } from '../../providers/BirthdayProvider'
import { RecipeProvider } from '../../providers/RecipeProvider'
import { MealPlanProvider, useMealPlanContext } from '../../providers/MealPlanProvider'
import { AdventureProvider } from '../../providers/AdventureProvider'
import { OfficeAttendanceProvider, useOfficeAttendanceContext } from '../../providers/OfficeAttendanceProvider'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import Planner from '../../components/Planner'
import SegmentedControl, { SegmentedControlTab } from '../../components/SegmentedControl'
import ModernPageHeader from '../../components/ModernPageHeader'
import MealPlanPreviewDrawer from '../../components/MealPlanPreviewDrawer'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import { Box } from '@mui/material'
import { Container, PlannerScrollArea } from './index.styled'
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useState } from 'react'
import { showAlert } from '../../utils/alert'
import { ActionName } from '../../providers/AppStateProvider/enums'
import { PlannerViewMode } from '../../enums/plannerViewMode'
import { IMealPlan } from '../../types/mealPlan'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { Route } from '../../enums/route'

const PLANNER_VIEW_MODE_KEY = 'plannerViewMode'

const VIEW_MODE_MAP: Record<string, PlannerViewMode> = {
  [PlannerViewMode.CALENDAR]: PlannerViewMode.CALENDAR,
  [PlannerViewMode.WEEKLY]: PlannerViewMode.WEEKLY,
  [PlannerViewMode.GROUPED]: PlannerViewMode.GROUPED,
}

const getSavedViewMode = (): PlannerViewMode => {
  const saved = localStorage.getItem(PLANNER_VIEW_MODE_KEY)
  return (saved && VIEW_MODE_MAP[saved]) || PlannerViewMode.WEEKLY
}

const PLANNER_VIEW_TABS: Array<SegmentedControlTab<PlannerViewMode>> = [
  {
    id: PlannerViewMode.WEEKLY,
    label: 'Weekly',
    icon: <ViewWeekIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#6366f1',
    activeBg: '#ffffff',
    activeShadow: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: PlannerViewMode.CALENDAR,
    label: 'Calendar',
    icon: <CalendarMonthIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#6366f1',
    activeBg: '#ffffff',
    activeShadow: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: PlannerViewMode.GROUPED,
    label: 'Grouped',
    icon: <ViewModuleIcon sx={{ fontSize: '1.1rem' }} />,
    activeColor: '#6366f1',
    activeBg: '#ffffff',
    activeShadow: 'rgba(99, 102, 241, 0.15)',
  },
]

const PlannerContent = () => {
  const { toDoList } = usePlannerContext()
  const { dispatch } = useAppState()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<PlannerViewMode>(getSavedViewMode)

  const handleViewModeChange = useCallback((mode: PlannerViewMode) => {
    setViewMode(mode)
    localStorage.setItem(PLANNER_VIEW_MODE_KEY, mode)
  }, [])

  const { mealPlans, removeMealPlan } = useMealPlanContext()
  const { officeAttendance, removeAttendance } = useOfficeAttendanceContext()
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

  const handleAddMealPlan = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem, { state: { itemType: 'meal' } })
  }, [dispatch, navigate])

  const handleAddAdventure = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem, { state: { itemType: 'adventure' } })
  }, [dispatch, navigate])

  const handleAddTask = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem)
  }, [dispatch, navigate])

  const handleAddOfficeDay = useCallback((date: string) => {
    dispatch({ type: ActionName.SET_SELECTED_CALENDAR_DATE, payload: date })
    navigate(Route.AddPlannerItem, { state: { itemType: 'office' } })
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
        <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
          <SegmentedControl
            tabs={PLANNER_VIEW_TABS}
            activeTab={viewMode}
            onChange={handleViewModeChange}
            collapseInactive
          />
        </Box>
        <PlannerScrollArea>
          <Planner
            viewMode={viewMode}
            mealPlans={mealPlans}
            officeAttendance={officeAttendance}
            onAddMealPlan={handleAddMealPlan}
            onMealPlanClick={handleMealPlanClick}
            onAddAdventure={handleAddAdventure}
            onAddTask={handleAddTask}
            onAddOfficeDay={handleAddOfficeDay}
            onRemoveAttendance={removeAttendance}
          />
        </PlannerScrollArea>
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
              <OfficeAttendanceProvider>
                <PlannerContent />
              </OfficeAttendanceProvider>
            </AdventureProvider>
          </MealPlanProvider>
        </RecipeProvider>
      </BirthdayProvider>
    </PlannerProvider>
  )
}

export default PlannerRoute
