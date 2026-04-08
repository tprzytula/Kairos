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
} from '../utils/timeGrouping'
import { SectionIcon } from '../../CollapsibleSection/types'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IAdventure } from '../../../types/adventure'
import { IBirthdayWithNextDate } from '../utils/timeGrouping'
import { IOfficeAttendance } from '../../../types/officeAttendance'

const TIME_GROUP_ICON_MAP: Record<TimeGroup, SectionIcon> = {
  [TimeGroup.OVERDUE]: {
    emoji: '⚠️',
    backgroundColor: '#fef2f2',
    foregroundColor: '#dc2626',
  },
  [TimeGroup.TODAY]: {
    emoji: '📅',
    backgroundColor: '#ecfdf5',
    foregroundColor: '#059669',
  },
  [TimeGroup.TOMORROW]: {
    emoji: '📌',
    backgroundColor: '#eff6ff',
    foregroundColor: '#2563eb',
  },
  [TimeGroup.THIS_WEEK]: {
    emoji: '📆',
    backgroundColor: '#fefce8',
    foregroundColor: '#ca8a04',
  },
  [TimeGroup.NEXT_WEEK]: {
    emoji: '🗓️',
    backgroundColor: '#f0f9ff',
    foregroundColor: '#0284c7',
  },
  [TimeGroup.LATER]: {
    emoji: '⏳',
    backgroundColor: '#f8fafc',
    foregroundColor: '#64748b',
  },
  [TimeGroup.NO_DUE_DATE]: {
    emoji: '📝',
    backgroundColor: '#f5f5f5',
    foregroundColor: '#6b7280',
  },
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

const getUnifiedGroupLabel = (group: TimeGroup, totalCount: number): string => {
  switch (group) {
    case TimeGroup.OVERDUE:
      return totalCount === 1 ? 'Overdue' : `Overdue (${totalCount})`
    case TimeGroup.TODAY:
      return 'Today'
    case TimeGroup.TOMORROW:
      return 'Tomorrow'
    case TimeGroup.THIS_WEEK:
      return 'This Week'
    case TimeGroup.NEXT_WEEK:
      return 'Next Week'
    case TimeGroup.LATER:
      return 'Later'
    case TimeGroup.NO_DUE_DATE:
      return 'No Due Date'
    default:
      return 'Unknown'
  }
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
