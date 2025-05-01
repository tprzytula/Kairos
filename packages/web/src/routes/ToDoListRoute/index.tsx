import { Typography } from '@mui/material'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'

const ToDoList = () => {
  return <Typography>WIP</Typography>
}

export const NoiseTrackingRoute = () => {
  const { state: { skipStartingScreen } } = useAppState() 

  return (
    <NoiseTrackingProvider>
      <StandardLayout 
        title="To Do List" 
        previousRoute={skipStartingScreen ? undefined : Route.Home} 
      >
        <ToDoList />
      </StandardLayout>
    </NoiseTrackingProvider>
  )
}

export default NoiseTrackingRoute
