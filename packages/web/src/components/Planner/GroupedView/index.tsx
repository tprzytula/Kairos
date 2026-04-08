import { useMemo } from 'react'
import ToDoItem from '../../ToDoItem'
import CollapsibleSection from '../../CollapsibleSection'
import SwipeableList from '../../SwipeableList'
import AdventureGroupedItem from './AdventureGroupedItem'
import BirthdayGroupedItem from './BirthdayGroupedItem'
import OfficeAttendanceGroup from './OfficeAttendanceGroup'
import { Container, TypeDivider, TaskCountBadge } from './index.styled'
import { IGroupedViewProps } from './types'
import {
  TimeGroup,
  TIME_GROUP_META,
  IGroupedTodoItem,
  IGroupedAdventureItem,
  IGroupedBirthdayItem,
  IGroupedOfficeAttendanceItem,
  IBirthdayWithNextDate,
  getUnifiedGroupLabel,
} from '../utils/timeGrouping'
import { SectionIcon } from '../../CollapsibleSection/types'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IAdventure } from '../../../types/adventure'
import { IOfficeAttendance } from '../../../types/officeAttendance'

const toSectionIcon = (meta: {
  emoji: string
  bg: string
  fg: string
}): SectionIcon => ({
  emoji: meta.emoji,
  backgroundColor: meta.bg,
  foregroundColor: meta.fg,
})

const TIME_GROUP_ICON_MAP: Record<TimeGroup, SectionIcon> = {
  [TimeGroup.OVERDUE]: toSectionIcon(TIME_GROUP_META[TimeGroup.OVERDUE]),
  [TimeGroup.TODAY]: toSectionIcon(TIME_GROUP_META[TimeGroup.TODAY]),
  [TimeGroup.TOMORROW]: toSectionIcon(TIME_GROUP_META[TimeGroup.TOMORROW]),
  [TimeGroup.THIS_WEEK]: toSectionIcon(TIME_GROUP_META[TimeGroup.THIS_WEEK]),
  [TimeGroup.NEXT_WEEK]: toSectionIcon(TIME_GROUP_META[TimeGroup.NEXT_WEEK]),
  [TimeGroup.LATER]: toSectionIcon(TIME_GROUP_META[TimeGroup.LATER]),
  [TimeGroup.NO_DUE_DATE]: toSectionIcon(
    TIME_GROUP_META[TimeGroup.NO_DUE_DATE]
  ),
}

interface IUnifiedGroup {
  group: TimeGroup
  label: string
  priority: number
  todos: ITodoItem[]
  adventures: IAdventure[]
  birthdays: IBirthdayWithNextDate[]
  attendance: IOfficeAttendance[]
}

const buildUnifiedGroups = (
  groupedTodos: IGroupedTodoItem[],
  groupedAdventures: IGroupedAdventureItem[],
  groupedBirthdays: IGroupedBirthdayItem[],
  groupedAttendance: IGroupedOfficeAttendanceItem[]
): IUnifiedGroup[] => {
  const map = new Map<TimeGroup, IUnifiedGroup>()

  const getOrCreate = (group: TimeGroup): IUnifiedGroup => {
    const existing = map.get(group)
    if (existing) return existing
    const entry: IUnifiedGroup = {
      group,
      label: '',
      priority: TIME_GROUP_META[group].priority,
      todos: [],
      adventures: [],
      birthdays: [],
      attendance: [],
    }
    map.set(group, entry)
    return entry
  }

  for (const { group, items } of groupedTodos) {
    getOrCreate(group).todos = items
  }

  for (const { group, items } of groupedAdventures) {
    getOrCreate(group).adventures = items
  }

  for (const { group, items } of groupedBirthdays) {
    getOrCreate(group).birthdays = items
  }

  for (const { group, items } of groupedAttendance) {
    getOrCreate(group).attendance = items
  }

  const result = Array.from(map.values())

  for (const entry of result) {
    const total =
      entry.todos.length +
      entry.adventures.length +
      entry.birthdays.length +
      entry.attendance.length
    entry.label = getUnifiedGroupLabel(entry.group, total)
  }

  result.sort((a, b) => a.priority - b.priority)

  return result
}

const GroupedView = ({
  groupedToDoItems,
  groupedAdventures,
  groupedBirthdays,
  groupedOfficeAttendance,
  onSwipeAction,
  onEditAction,
  onAdventureClick,
  onBirthdayClick,
}: IGroupedViewProps) => {
  const unifiedGroups = useMemo(
    () =>
      buildUnifiedGroups(
        groupedToDoItems,
        groupedAdventures,
        groupedBirthdays,
        groupedOfficeAttendance
      ),
    [
      groupedToDoItems,
      groupedAdventures,
      groupedBirthdays,
      groupedOfficeAttendance,
    ]
  )

  return (
    <Container>
      {unifiedGroups.map(
        ({ group, label, todos, adventures, birthdays, attendance }) => {
          const allItems = [
            ...todos,
            ...adventures,
            ...birthdays,
            ...attendance,
          ]
          const hasMultipleTypes =
            [todos, adventures, birthdays, attendance].filter(
              (arr) => arr.length > 0
            ).length > 1
          const showTaskBadge = todos.length > 0 && hasMultipleTypes

          return (
            <CollapsibleSection
              key={group}
              title={label}
              icon={TIME_GROUP_ICON_MAP[group]}
              items={allItems}
              headerRightContent={
                showTaskBadge ? (
                  <TaskCountBadge
                    label={`${todos.length} ${todos.length === 1 ? 'task' : 'tasks'}`}
                    size="small"
                  />
                ) : undefined
              }
            >
              {todos.length > 0 && (
                <SwipeableList
                  component={ToDoItem}
                  list={todos}
                  onSwipeAction={onSwipeAction}
                  onEditAction={onEditAction}
                  threshold={0.3}
                />
              )}
              {adventures.length > 0 && (
                <>
                  {todos.length > 0 && <TypeDivider />}
                  {adventures.map((adventure) => (
                    <AdventureGroupedItem
                      key={adventure.id}
                      adventure={adventure}
                      onClick={onAdventureClick}
                    />
                  ))}
                </>
              )}
              {birthdays.length > 0 && (
                <>
                  {(todos.length > 0 || adventures.length > 0) && (
                    <TypeDivider />
                  )}
                  {birthdays.map((birthday) => (
                    <BirthdayGroupedItem
                      key={birthday.id}
                      birthday={birthday}
                      onClick={onBirthdayClick}
                    />
                  ))}
                </>
              )}
              {attendance.length > 0 && (
                <>
                  {(todos.length > 0 ||
                    adventures.length > 0 ||
                    birthdays.length > 0) && <TypeDivider />}
                  <OfficeAttendanceGroup entries={attendance} />
                </>
              )}
            </CollapsibleSection>
          )
        }
      )}
    </Container>
  )
}

export default GroupedView
