import StandardLayout from '../../layout/standardLayout'
import { ToDoListProvider, useToDoListContext } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import MarkToDoItemsAsDoneButton from '../../components/MarkToDoItemsAsDoneButton'
import ModernPageHeader from '../../components/ModernPageHeader'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { Container, ScrollableContainer } from './index.styled'

const ToDoListContent = () => {
  const { toDoList } = useToDoListContext()
  
  const pendingItems = toDoList.filter(item => !item.isDone)
  const completedItems = toDoList.filter(item => item.isDone)
  
  const stats = [
    { value: toDoList.length, label: 'Total Items' },
    { value: pendingItems.length, label: 'Pending' },
    { value: completedItems.length, label: 'Completed' }
  ]
  
  return (
    <StandardLayout>
      <ModernPageHeader
        title="To-Do List"
        icon={<ChecklistIcon />}
        stats={stats}
      />
      <Container>
        <MarkToDoItemsAsDoneButton />
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
