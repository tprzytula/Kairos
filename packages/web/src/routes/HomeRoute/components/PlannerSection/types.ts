import { IToDoStats } from '../../../../hooks/useHomeData/types'
import { IMealPlan } from '../../../../types/mealPlan'
import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IAdventure } from '../../../../types/adventure'

export interface ITodayMealItem extends IMealPlan {
  imagePath?: string
}

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  todayMeals: ITodayMealItem[]
  upcomingAdventures: IAdventure[]
  isLoading: boolean
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
  onMealClick?: (meal: ITodayMealItem) => void
  onAdventureClick?: (adventure: IAdventure) => void
}
