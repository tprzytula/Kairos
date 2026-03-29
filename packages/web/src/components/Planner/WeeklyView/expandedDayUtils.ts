import dayjs from 'dayjs'
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import { IAdventure } from '../../../types/adventure'
import { MealType } from '../../../enums/mealType'

export const HOUR_START = 6
export const HOUR_END = 22
export const HOUR_SLOTS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i)

export type ExpandedItemType = 'todo' | 'completedTodo' | 'overdueTodo' | 'birthday' | 'meal' | 'adventure'

export interface IExpandedItem {
  type: ExpandedItemType
  id: string
  label: string
  isPrivate: boolean
  time?: string
  raw: ITodoItem | IBirthdayItem | IMealPlan | IAdventure
}

const MEAL_TYPE_HOUR: Partial<Record<MealType, number>> = {
  [MealType.Breakfast]: 8,
  [MealType.Brunch]: 10,
  [MealType.Lunch]: 12,
  [MealType.Snack]: 15,
  [MealType.Dinner]: 19,
}

export interface ITimeSlotResult {
  allDay: IExpandedItem[]
  hourly: Map<number, IExpandedItem[]>
}

export const buildTimeSlots = (
  pendingTodos: ITodoItem[],
  completedTodos: ITodoItem[],
  birthdays: IBirthdayItem[],
  meals: IMealPlan[],
  adventures: IAdventure[],
  isOverdue: boolean,
): ITimeSlotResult => {
  const allDay: IExpandedItem[] = []
  const hourly = new Map<number, IExpandedItem[]>()

  const addToHour = (hour: number, item: IExpandedItem) => {
    const existing = hourly.get(hour)
    if (existing) {
      existing.push(item)
    } else {
      hourly.set(hour, [item])
    }
  }

  const categorizeTodo = (todo: ITodoItem, type: ExpandedItemType) => {
    const item: IExpandedItem = {
      type,
      id: todo.id,
      label: todo.name,
      isPrivate: todo.visibility === 'private',
      raw: todo,
    }

    if (todo.dueDate) {
      const d = dayjs(todo.dueDate)
      const hour = d.hour()
      const minute = d.minute()
      // Midnight (00:00) likely means no specific time was set
      if (hour === 0 && minute === 0) {
        allDay.push(item)
      } else if (hour >= HOUR_START && hour <= HOUR_END) {
        item.time = d.format('h:mm A')
        addToHour(hour, item)
      } else {
        allDay.push(item)
      }
    } else {
      allDay.push(item)
    }
  }

  for (const todo of pendingTodos) {
    categorizeTodo(todo, isOverdue ? 'overdueTodo' : 'todo')
  }

  for (const todo of completedTodos) {
    categorizeTodo(todo, 'completedTodo')
  }

  for (const birthday of birthdays) {
    allDay.push({
      type: 'birthday',
      id: birthday.id,
      label: birthday.name,
      isPrivate: birthday.visibility === 'private',
      raw: birthday,
    })
  }

  for (const meal of meals) {
    const item: IExpandedItem = {
      type: 'meal',
      id: meal.id,
      label: meal.recipeName,
      isPrivate: meal.visibility === 'private',
      raw: meal,
    }
    const mealHour = meal.mealType ? MEAL_TYPE_HOUR[meal.mealType] : undefined
    if (mealHour !== undefined && mealHour >= HOUR_START && mealHour <= HOUR_END) {
      item.time = meal.mealType
      addToHour(mealHour, item)
    } else {
      allDay.push(item)
    }
  }

  for (const adventure of adventures) {
    const item: IExpandedItem = {
      type: 'adventure',
      id: adventure.id,
      label: adventure.name,
      isPrivate: adventure.visibility === 'private',
      raw: adventure,
    }
    if (adventure.time) {
      const hour = parseInt(adventure.time.split(':')[0], 10)
      if (!isNaN(hour) && hour >= HOUR_START && hour <= HOUR_END) {
        item.time = dayjs(`2000-01-01 ${adventure.time}`).format('h:mm A')
        addToHour(hour, item)
      } else {
        allDay.push(item)
      }
    } else {
      allDay.push(item)
    }
  }

  return { allDay, hourly }
}

export const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}
