import { IToDoStats } from '../../../../hooks/useHomeData/types'
import { IBirthdayItem } from '../../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../../types/mealPlan'

export interface ITodayMealItem extends IMealPlan {
  imagePath?: string
}

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  birthdays: IBirthdayItem[]
  todayMeals: ITodayMealItem[]
  isLoading: boolean
  isExpanded: boolean
  onToggleExpansion: () => void
  onItemToggle: (id: string) => void
  expandedItems: Set<string>
  onMealClick?: (meal: ITodayMealItem) => void
}
