import { PlannerViewMode } from '../../enums/plannerViewMode';
import { IMealPlan } from '../../types/mealPlan';

export interface IToDoListProps {
  viewMode?: PlannerViewMode;
  mealPlans?: IMealPlan[];
  onAddMealPlan?: (date: string) => void;
  onMealPlanClick?: (mealPlan: IMealPlan) => void;
  onAddAdventure?: (date: string) => void;
  onAddTask?: (date: string) => void;
};
