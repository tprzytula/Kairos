import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { ToDoListProvider } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import MarkToDoItemsAsDoneButton from '../../components/MarkToDoItemsAsDoneButton'
import { Container, ScrollableContainer } from './index.styled'
export const NoiseTrackingRoute = () => {
  const { state: { skipStartingScreen } } = useAppState() 

  return (
    <ToDoListProvider>
      <StandardLayout 
        title="To Do List" 
        previousRoute={skipStartingScreen ? undefined : Route.Home} 
        nextRoute={Route.AddToDoItem}
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
