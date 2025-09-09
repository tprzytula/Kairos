import { INoiseTrackingItem } from '../../../../api/noiseTracking'
import { INoiseCounts } from '../../../../hooks/useHomeData/types'
import { NoiseView } from '../../../../hooks/useHomeInteractions/types'

export interface INoiseSectionProps {
  noiseTrackingItems: INoiseTrackingItem[]
  noiseCounts: INoiseCounts
  isLoading: boolean
  noiseView: NoiseView
  onNoiseViewChange: (view: NoiseView) => void
}
