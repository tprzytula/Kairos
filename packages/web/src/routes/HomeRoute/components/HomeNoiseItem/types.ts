import { INoiseTrackingItem } from '../../../../api/noiseTracking/retrieve'

export interface IHomeNoiseItemProps {
  item: INoiseTrackingItem
  timeFormatted: string
  timeElapsed: string
}