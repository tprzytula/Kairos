import { PlannerViewMode } from '../../enums/plannerViewMode';
import { IMealPlan } from '../../types/mealPlan';
import { IOfficeAttendance } from '../../types/officeAttendance';

export interface IToDoListProps {
  viewMode?: PlannerViewMode;
  mealPlans?: IMealPlan[];
  officeAttendance?: IOfficeAttendance[];
  onAddMealPlan?: (date: string) => void;
  onMealPlanClick?: (mealPlan: IMealPlan) => void;
  onAddAdventure?: (date: string) => void;
  onAddTask?: (date: string) => void;
  onRemoveAttendance?: (id: string) => void;
};
