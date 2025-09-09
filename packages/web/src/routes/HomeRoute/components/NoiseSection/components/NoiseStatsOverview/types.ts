import { INoiseCounts } from '../../../../../../hooks/useHomeData/types'
import { NoiseView } from '../../../../../../hooks/useHomeInteractions/types'

export interface INoiseStatsOverviewProps {
  noiseCounts: INoiseCounts
  onNoiseViewChange: (view: NoiseView) => void
}
