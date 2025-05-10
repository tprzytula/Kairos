import StandardLayout from '../../layout/standardLayout'
import { ToDoListProvider } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import MarkToDoItemsAsDoneButton from '../../components/MarkToDoItemsAsDoneButton'
import { Container, ScrollableContainer } from './index.styled'

export const NoiseTrackingRoute = () => {
  return (
    <ToDoListProvider>
      <StandardLayout 
        title="To Do List" 
      >
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

export default NoiseTrackingRoute
