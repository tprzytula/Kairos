import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IToDoStats } from '../../../../hooks/useHomeData/types'

export interface IToDoSectionProps {
  toDoStats: IToDoStats
  isLoading: boolean
  isExpanded: boolean
  onToggleExpansion: () => void
  onItemToggle: (id: string) => void
  expandedItems: Set<string>
}
