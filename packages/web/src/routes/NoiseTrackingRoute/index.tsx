import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from '../../components/NoiseTrackingList'

export const NoiseTrackingRoute = () => {
  const { state: { skipStartingScreen } } = useAppState() 

  return (
    <NoiseTrackingProvider>
      <StandardLayout 
        title="Noise Tracking" 
        previousRoute={skipStartingScreen ? undefined : Route.Home} 
      >
        <NoiseTrackingList />
      </StandardLayout>
    </NoiseTrackingProvider>
  )
}

export default NoiseTrackingRoute
