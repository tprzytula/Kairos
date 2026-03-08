import StandardLayout from '../../layout/standardLayout'
import { PlannerProvider, usePlannerContext } from '../../providers/PlannerProvider'
import { BirthdayProvider } from '../../providers/BirthdayProvider'
import Planner from '../../components/Planner'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ModernPageHeader from '../../components/ModernPageHeader'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Container, ScrollableContainer } from './index.styled'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useMemo, useState } from 'react'
import { showAlert } from '../../utils/alert'
import { ActionName } from '../../providers/AppStateProvider/enums'
import { useProjectContext } from '../../providers/ProjectProvider'
import { updateToDoItems } from '../../api/toDoList'
import { PlannerViewMode } from '../../enums/plannerViewMode'
import dayjs from 'dayjs'

const PlannerContent = () => {
  const { toDoList, refetchToDoList } = usePlannerContext()
  const { state: { selectedTodoItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const [allExpanded, setAllExpanded] = useState(true)
  const [expandKey, setExpandKey] = useState(0)
  const [viewMode, setViewMode] = useState<PlannerViewMode>(PlannerViewMode.GROUPED)
  
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

  const stats = viewMode === PlannerViewMode.CALENDAR ? calendarStats : defaultStats

  const statusText = useMemo(() => {
    const totalItems = toDoList.length
    const selectedCount = selectedTodoItems.size
    
    if (totalItems === 0) {
      return "Your planner is empty"
    }
    
    if (selectedCount === 0) {
      return "Tap items to mark as done"
    }
    
    return `${selectedCount} of ${totalItems} item${totalItems === 1 ? '' : 's'} selected`
  }, [toDoList.length, selectedTodoItems.size])

  const clearSelectedTodoItems = useCallback((selectedTodoItems: Set<string>) => {
    dispatch({ 
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS, 
      payload: Array.from(selectedTodoItems) 
    })
  }, [dispatch])

  const markToDoItemsAsDone = useCallback(async () => {
    try {
      await updateToDoItems(Array.from(selectedTodoItems).map(id => ({ id, isDone: true })), currentProject!.id)
      clearSelectedTodoItems(selectedTodoItems)
      refetchToDoList()
    } catch (error) {
      console.error("Failed to mark to do items as done:", error)
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [selectedTodoItems, currentProject, dispatch, refetchToDoList, clearSelectedTodoItems])

  const toggleAll = useCallback(() => {
    setAllExpanded(!allExpanded)
    setExpandKey(prev => prev + 1) // Force re-render of sections
  }, [allExpanded])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      if (prev === PlannerViewMode.CALENDAR) return PlannerViewMode.GROUPED
      if (prev === PlannerViewMode.GROUPED) return PlannerViewMode.SIMPLE
      return PlannerViewMode.CALENDAR
    })
  }, [])

  const viewToggleIcon = viewMode === PlannerViewMode.CALENDAR
    ? <CalendarMonthIcon />
    : viewMode === PlannerViewMode.GROUPED
      ? <ViewModuleIcon />
      : <ViewListIcon />
  
  return (
    <StandardLayout>
      <ModernPageHeader
        title="Planner"
        icon={<ChecklistIcon />}
        stats={stats}
      />
      <Container>
        <ActionButtonsBar
          expandCollapseButton={{
            isExpanded: allExpanded,
            onToggle: toggleAll,
            disabled: pendingItems.length === 0 || viewMode === PlannerViewMode.CALENDAR,
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
        <ScrollableContainer>
          <Planner allExpanded={allExpanded} expandKey={expandKey} viewMode={viewMode} />
        </ScrollableContainer>
      </Container>
    </StandardLayout>
  )
}

export const PlannerRoute = () => {
  return (
    <PlannerProvider>
      <BirthdayProvider>
        <PlannerContent />
      </BirthdayProvider>
    </PlannerProvider>
  )
}

export default PlannerRoute
