import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { TimeGroup } from '../ToDoList/utils/timeGrouping'

export interface IToDoTimeSectionProps {
  group: TimeGroup | string
  groupLabel: string
  items: ITodoItem[]
  onSwipeAction: (id: string) => void
  onEditAction: (id: string) => void
  expandTo?: boolean | null
  expandKey?: string | number
}
