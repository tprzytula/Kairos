import { INoiseTrackingItem } from '../../../api/noiseTracking'

export interface ISimpleViewProps {
  noiseTrackingItems: INoiseTrackingItem[];
  allExpanded?: boolean;
  expandKey?: string | number;
};
