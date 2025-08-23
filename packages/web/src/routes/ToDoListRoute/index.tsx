import StandardLayout from '../../layout/standardLayout'
import { ToDoListProvider, useToDoListContext } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ModernPageHeader from '../../components/ModernPageHeader'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { Container, ScrollableContainer } from './index.styled'
import { useAppState } from '../../providers/AppStateProvider'
import { useCallback, useMemo } from 'react'
import { showAlert } from '../../utils/alert'
import { ActionName } from '../../providers/AppStateProvider/enums'
import { useProjectContext } from '../../providers/ProjectProvider'
import { updateToDoItems } from '../../api/toDoList'

const ToDoListContent = () => {
  const { toDoList, refetchToDoList } = useToDoListContext()
  const { state: { selectedTodoItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  
  const pendingItems = toDoList.filter(item => !item.isDone)
  const completedItems = toDoList.filter(item => item.isDone)
  
  const stats = [
    { value: toDoList.length, label: 'Total Items' },
    { value: pendingItems.length, label: 'Pending' },
    { value: completedItems.length, label: 'Completed' }
  ]

  const statusText = useMemo(() => {
    const totalItems = toDoList.length
    const selectedCount = selectedTodoItems.size
    
    if (totalItems === 0) {
      return "Your to-do list is empty"
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
  
  return (
    <StandardLayout>
      <ModernPageHeader
        title="To-Do List"
        icon={<ChecklistIcon />}
        stats={stats}
      />
      <Container>
        <ActionButtonsBar
          actionButton={{
            isEnabled: selectedTodoItems.size > 0,
            onClick: markToDoItemsAsDone,
            children: "Mark To Do Items As Done",
            statusText: statusText,
          }}
        />
        <ScrollableContainer>
          <ToDoList />
        </ScrollableContainer>
      </Container>
    </StandardLayout>
  )
}

export const ToDoListRoute = () => {
  return (
    <ToDoListProvider>
      <ToDoListContent />
    </ToDoListProvider>
  )
}

export default ToDoListRoute
