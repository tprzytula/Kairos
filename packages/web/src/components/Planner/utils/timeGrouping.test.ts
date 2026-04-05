import { groupAdventuresByTime, TimeGroup } from './timeGrouping'
import { IAdventure } from '../../../types/adventure'

const createAdventure = (overrides: Partial<IAdventure> = {}): IAdventure => ({
  id: 'adv-1',
  projectId: 'project-1',
  name: 'Test Adventure',
  date: '2026-04-05',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
})

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('Given the groupAdventuresByTime utility', () => {
  describe('When grouping adventures by time', () => {
    it('should group an adventure happening today into the TODAY group', () => {
      const today = formatDate(new Date())
      const adventure = createAdventure({ id: 'today-adv', date: today })

      const result = groupAdventuresByTime([adventure])

      expect(result).toHaveLength(1)
      expect(result[0].group).toBe(TimeGroup.TODAY)
      expect(result[0].items).toHaveLength(1)
      expect(result[0].items[0].id).toBe('today-adv')
    })

    it('should group an adventure happening tomorrow into the TOMORROW group', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const adventure = createAdventure({ id: 'tmr-adv', date: formatDate(tomorrow) })

      const result = groupAdventuresByTime([adventure])

      expect(result).toHaveLength(1)
      expect(result[0].group).toBe(TimeGroup.TOMORROW)
    })

    it('should exclude past adventures', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const adventure = createAdventure({ date: formatDate(yesterday) })

      const result = groupAdventuresByTime([adventure])

      expect(result).toHaveLength(0)
    })

    it('should group a far-future adventure into the LATER group', () => {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 3)
      const adventure = createAdventure({ date: formatDate(futureDate) })

      const result = groupAdventuresByTime([adventure])

      expect(result).toHaveLength(1)
      expect(result[0].group).toBe(TimeGroup.LATER)
    })

    it('should sort groups by priority', () => {
      const today = formatDate(new Date())
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 3)

      const adventures = [
        createAdventure({ id: 'later', date: formatDate(futureDate) }),
        createAdventure({ id: 'today', date: today }),
      ]

      const result = groupAdventuresByTime(adventures)

      expect(result[0].group).toBe(TimeGroup.TODAY)
      expect(result[1].group).toBe(TimeGroup.LATER)
    })

    it('should sort adventures within a group by date', () => {
      const futureDate1 = new Date()
      futureDate1.setMonth(futureDate1.getMonth() + 3)
      const futureDate2 = new Date()
      futureDate2.setMonth(futureDate2.getMonth() + 4)

      const adventures = [
        createAdventure({ id: 'later-2', date: formatDate(futureDate2) }),
        createAdventure({ id: 'later-1', date: formatDate(futureDate1) }),
      ]

      const result = groupAdventuresByTime(adventures)

      expect(result[0].items[0].id).toBe('later-1')
      expect(result[0].items[1].id).toBe('later-2')
    })

    it('should return an empty array when there are no adventures', () => {
      const result = groupAdventuresByTime([])

      expect(result).toHaveLength(0)
    })

    it('should include the item count in the group label when there are multiple items', () => {
      const today = formatDate(new Date())
      const adventures = [
        createAdventure({ id: 'adv-1', date: today }),
        createAdventure({ id: 'adv-2', date: today }),
      ]

      const result = groupAdventuresByTime(adventures)

      expect(result[0].groupLabel).toBe('Today (2)')
    })

    it('should not include count in the group label for a single item', () => {
      const today = formatDate(new Date())
      const adventure = createAdventure({ date: today })

      const result = groupAdventuresByTime([adventure])

      expect(result[0].groupLabel).toBe('Today')
    })
  })
})
