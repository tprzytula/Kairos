import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { ToDoListProvider } from '../../providers/ToDoListProvider'
import ToDoList from '../../components/ToDoList'

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
      </StandardLayout>
    </ToDoListProvider>
  )
}

export default NoiseTrackingRoute
