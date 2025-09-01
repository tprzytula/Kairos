export enum ViewMode {
  Grouped = 'grouped',
  Simple = 'simple'
}

export interface INoiseTrackingListProps {
  viewMode: ViewMode;
  allExpanded?: boolean;
  expandKey?: string | number;
};
