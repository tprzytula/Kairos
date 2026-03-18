import { IToDoStats } from '../../../../hooks/useHomeData/types'
import { IBirthdayItem } from '../../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../../types/mealPlan'
import { ITodoItem } from '../../../../api/toDoList/retrieve/types'

export interface ITodayMealItem extends IMealPlan {
  imagePath?: string
}

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  birthdays: IBirthdayItem[]
  todayMeals: ITodayMealItem[]
  isLoading: boolean
  onStepToggle: (todoId: string, stepId: string, isDone: boolean) => void
  onCardClick: (item: ITodoItem) => void
  onMealClick?: (meal: ITodayMealItem) => void
}
