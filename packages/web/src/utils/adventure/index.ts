import dayjs from 'dayjs'
import { IAdventure } from '../../types/adventure'

export enum AdventurePosition {
  Single = 'single',
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

const sortAdventuresByTime = (adventures: IAdventure[]): IAdventure[] =>
  adventures.sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time)
    if (a.time) return -1
    if (b.time) return 1
    return 0
  })

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
  for (const [, dayAdventures] of map) {
    sortAdventuresByTime(dayAdventures)
  }
  return map
}

export const getAdventurePosition = (adventure: IAdventure, dayKey: string): AdventurePosition => {
  const isStart = adventure.date === dayKey
  const isEnd = !adventure.endDate || adventure.endDate === dayKey
  if (isStart && isEnd) return AdventurePosition.Single
  if (isStart) return AdventurePosition.Start
  if (isEnd) return AdventurePosition.End
  return AdventurePosition.Middle
}
