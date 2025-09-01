export interface INoiseTrackingItem {
  timestamp: number;
}

export interface ISimpleViewProps {
  noiseTrackingItems: INoiseTrackingItem[];
  allExpanded?: boolean;
  expandKey?: string | number;
};
