import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IToDoStats } from '../../../../hooks/useHomeData/types'

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  isLoading: boolean
  isExpanded: boolean
  expandedItems: Set<string>
  onToggleExpansion: () => void
  onItemToggle: (itemId: string) => void
}
