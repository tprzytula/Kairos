import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { ToDoListProvider } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'
import MarkToDoItemsAsDoneButton from '../../components/MarkToDoItemsAsDoneButton'

export const NoiseTrackingRoute = () => {
  const { state: { skipStartingScreen } } = useAppState() 

  return (
    <ToDoListProvider>
      <StandardLayout 
        title="To Do List" 
        previousRoute={skipStartingScreen ? undefined : Route.Home} 
        nextRoute={Route.AddToDoItem}
      >
        <ToDoList />
        <MarkToDoItemsAsDoneButton />
      </StandardLayout>
    </ToDoListProvider>
  )
}

export default NoiseTrackingRoute
