import { PlannerViewMode } from '../../enums/plannerViewMode';

export interface IToDoListProps {
  allExpanded?: boolean;
  expandKey?: string | number;
  viewMode?: PlannerViewMode;
};
