import StandardLayout from '../../layout/standardLayout'
import { NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from '../../components/NoiseTrackingList'
import { Container, ScrollableContainer } from './index.styled'

export const NoiseTrackingRoute = () => {
  return (
    <NoiseTrackingProvider>
      <StandardLayout 
        title="Noise Tracking" 
      >
        <Container>
          <ScrollableContainer>
            <NoiseTrackingList />
          </ScrollableContainer>
        </Container>
      </StandardLayout>
    </NoiseTrackingProvider>
  )
}

export default NoiseTrackingRoute
