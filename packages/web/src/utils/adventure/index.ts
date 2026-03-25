import dayjs from 'dayjs'
import { IAdventure } from '../../types/adventure'

export type AdventurePosition = 'single' | 'start' | 'middle' | 'end'

export const buildAdventuresByDay = (adventures: IAdventure[]): Map<string, IAdventure[]> => {
  const map = new Map<string, IAdventure[]>()
  for (const adventure of adventures) {
    let current = dayjs(adventure.date)
    const end = adventure.endDate ? dayjs(adventure.endDate) : current
    while (!current.isAfter(end, 'day')) {
      const key = current.format('YYYY-MM-DD')
      const existing = map.get(key)
      if (existing) {
        existing.push(adventure)
      } else {
        map.set(key, [adventure])
      }
      current = current.add(1, 'day')
    }
  }
  return map
}

export const getAdventurePosition = (adventure: IAdventure, dayKey: string): AdventurePosition => {
  const isStart = adventure.date === dayKey
  const isEnd = !adventure.endDate || adventure.endDate === dayKey
  if (isStart && isEnd) return 'single'
  if (isStart) return 'start'
  if (isEnd) return 'end'
  return 'middle'
}
