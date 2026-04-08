import {
  IGroupedTodoItem,
  IGroupedAdventureItem,
  IGroupedBirthdayItem,
  IGroupedOfficeAttendanceItem,
} from '../utils/timeGrouping'

export interface IGroupedViewProps {
  groupedToDoItems: IGroupedTodoItem[]
  groupedAdventures: IGroupedAdventureItem[]
  groupedBirthdays: IGroupedBirthdayItem[]
  groupedOfficeAttendance: IGroupedOfficeAttendanceItem[]
  onSwipeAction: (id: string) => void
  onEditAction: (id: string) => void
  onAdventureClick: (id: string) => void
  onBirthdayClick: (id: string) => void
}
