import { IToDoStats } from '../../../../hooks/useHomeData/types'
import { IBirthdayItem } from '../../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../../types/mealPlan'

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  birthdays: IBirthdayItem[]
  todayMeals: IMealPlan[]
  isLoading: boolean
  isExpanded: boolean
  onToggleExpansion: () => void
  onItemToggle: (id: string) => void
  expandedItems: Set<string>
}
