import StandardLayout from '../../layout/standardLayout'
import { ToDoListProvider } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import MarkToDoItemsAsDoneButton from '../../components/MarkToDoItemsAsDoneButton'
import ModernPageHeader from '../../components/ModernPageHeader'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { Container, ScrollableContainer } from './index.styled'

export const ToDoListRoute = () => {
  return (
    <ToDoListProvider>
      <StandardLayout>
        <ModernPageHeader
          title="To-Do List"
          icon={<ChecklistIcon />}
        />
        <Container>
          <MarkToDoItemsAsDoneButton />
          <ScrollableContainer>
            <ToDoList />
          </ScrollableContainer>
        </Container>
      </StandardLayout>
    </ToDoListProvider>
  )
}

export default ToDoListRoute
