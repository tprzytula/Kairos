import { INoiseTrackingItem } from '../../../../../../api/noiseTracking'
import { INoiseTimestampFormatted } from '../../../../../../utils/dateTime/types'

export interface INoiseDetailViewProps {
  items: INoiseTrackingItem[]
  viewTitle: string
  onBackClick: () => void
  formatTimestamp: (timestamp: number) => INoiseTimestampFormatted
}
