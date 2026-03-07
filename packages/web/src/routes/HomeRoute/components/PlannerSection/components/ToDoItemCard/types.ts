import { ITodoItem } from '../../../../../../api/toDoList/retrieve/types'
import { DueDateClass } from '../../../../../../utils/dateTime/types'

export interface IToDoItemCardProps {
  item: ITodoItem
  dueDateText: string
  dueDateClass: DueDateClass
  isExpanded: boolean
  onToggle: () => void
}
