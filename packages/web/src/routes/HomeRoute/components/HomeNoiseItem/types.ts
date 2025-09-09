import { INoiseTrackingItem } from '../../../../api/noiseTracking'

export interface IHomeNoiseItemProps {
  item: INoiseTrackingItem
  timeFormatted: string
  timeElapsed: string
}