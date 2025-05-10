import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import { useAppState } from '../../providers/AppStateProvider'
import { NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from '../../components/NoiseTrackingList'

export const NoiseTrackingRoute = () => {
  return (
    <NoiseTrackingProvider>
      <StandardLayout 
        title="Noise Tracking" 
      >
        <NoiseTrackingList />
      </StandardLayout>
    </NoiseTrackingProvider>
  )
}

export default NoiseTrackingRoute
