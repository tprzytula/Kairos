import { formatDueDateRelative, getDueDateClass, formatNoiseTimestamp } from './index'

describe('formatDueDateRelative', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    const mockDate = new Date('2024-01-15T12:00:00Z')
    jest.setSystemTime(mockDate)
  })

  describe('when dueDate is undefined', () => {
    it('should return empty string', () => {
      const result = formatDueDateRelative()
      
      expect(result).toBe('')
    })
  })

  describe('when task is overdue', () => {
    it('should return "overdue by 1 day" for 1 day overdue', () => {
      const yesterday = new Date('2024-01-14T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(yesterday)
      
      expect(result).toBe('overdue by 1 day')
    })

    it('should return "overdue by X days" for multiple days overdue', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(threeDaysAgo)
      
      expect(result).toBe('overdue by 3 days')
    })
  })

  describe('when task is due today', () => {
    it('should return "due today"', () => {
      const today = new Date('2024-01-15T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(today)
      
      expect(result).toBe('due today')
    })
  })

  describe('when task is due tomorrow', () => {
    it('should return "due tomorrow"', () => {
      const tomorrow = new Date('2024-01-16T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(tomorrow)
      
      expect(result).toBe('due tomorrow')
    })
  })

  describe('when task is due within a week', () => {
    it('should return "in X days" for multiple days', () => {
      const threeDaysFromNow = new Date('2024-01-18T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(threeDaysFromNow)
      
      expect(result).toBe('in 3 days')
    })

    it('should return "in 7 days" for exactly one week', () => {
      const oneWeekFromNow = new Date('2024-01-22T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(oneWeekFromNow)
      
      expect(result).toBe('in 7 days')
    })
  })

  describe('when task is due within a month', () => {
    it('should return "in 1 week" for 8-14 days', () => {
      const eightDaysFromNow = new Date('2024-01-23T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(eightDaysFromNow)
      
      expect(result).toBe('in 2 weeks')
    })

    it('should return "in X weeks" for multiple weeks', () => {
      const threeWeeksFromNow = new Date('2024-02-05T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(threeWeeksFromNow)
      
      expect(result).toBe('in 3 weeks')
    })
  })

  describe('when task is due more than a month away', () => {
    it('should return "in 2 months" for February 15th', () => {
      const oneMonthFromNow = new Date('2024-02-15T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(oneMonthFromNow)
      
      expect(result).toBe('in 2 months')
    })

    it('should return "in 4 months" for April 15th', () => {
      const threeMonthsFromNow = new Date('2024-04-15T12:00:00Z').getTime()
      
      const result = formatDueDateRelative(threeMonthsFromNow)
      
      expect(result).toBe('in 4 months')
    })
  })
})

describe('getDueDateClass', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    const mockDate = new Date('2024-01-15T12:00:00Z')
    jest.setSystemTime(mockDate)
  })

  describe('when dueDate is undefined', () => {
    it('should return empty string', () => {
      const result = getDueDateClass()
      
      expect(result).toBe('')
    })
  })

  describe('when task is overdue', () => {
    it('should return "overdue"', () => {
      const yesterday = new Date('2024-01-14T12:00:00Z').getTime()
      
      const result = getDueDateClass(yesterday)
      
      expect(result).toBe('overdue')
    })
  })

  describe('when task is due today', () => {
    it('should return "today"', () => {
      const today = new Date('2024-01-15T12:00:00Z').getTime()
      
      const result = getDueDateClass(today)
      
      expect(result).toBe('today')
    })
  })

  describe('when task is due soon (within 3 days)', () => {
    it('should return "soon" for tomorrow', () => {
      const tomorrow = new Date('2024-01-16T12:00:00Z').getTime()
      
      const result = getDueDateClass(tomorrow)
      
      expect(result).toBe('soon')
    })

    it('should return "soon" for 3 days from now', () => {
      const threeDaysFromNow = new Date('2024-01-18T12:00:00Z').getTime()
      
      const result = getDueDateClass(threeDaysFromNow)
      
      expect(result).toBe('soon')
    })
  })

  describe('when task is due later', () => {
    it('should return empty string for more than 3 days away', () => {
      const fourDaysFromNow = new Date('2024-01-19T12:00:00Z').getTime()
      
      const result = getDueDateClass(fourDaysFromNow)
      
      expect(result).toBe('')
    })
  })
})

describe('formatNoiseTimestamp', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    const mockDate = new Date('2024-01-15T12:00:00Z')
    jest.setSystemTime(mockDate)
  })

  describe('when timestamp is today', () => {
    it('should return "Today" with formatted time', () => {
      const todayTimestamp = new Date('2024-01-15T14:30:00Z').getTime()
      
      const result = formatNoiseTimestamp(todayTimestamp)
      
      expect(result.date).toBe('Today')
      expect(result.time).toBe('02:30 PM')
    })
  })

  describe('when timestamp is yesterday', () => {
    it('should return "Yesterday" with formatted time', () => {
      const yesterdayTimestamp = new Date('2024-01-14T09:15:00Z').getTime()
      
      const result = formatNoiseTimestamp(yesterdayTimestamp)
      
      expect(result.date).toBe('Yesterday')
      expect(result.time).toBe('09:15 AM')
    })
  })

  describe('when timestamp is older than yesterday', () => {
    it('should return formatted date with time', () => {
      const olderTimestamp = new Date('2024-01-12T16:45:00Z').getTime()
      
      const result = formatNoiseTimestamp(olderTimestamp)
      
      expect(result.date).toBe('Fri, Jan 12')
      expect(result.time).toBe('04:45 PM')
    })
  })

  describe('when timestamp is from different year', () => {
    it('should return formatted date with time', () => {
      const differentYearTimestamp = new Date('2023-12-25T10:00:00Z').getTime()
      
      const result = formatNoiseTimestamp(differentYearTimestamp)
      
      expect(result.date).toBe('Mon, Dec 25')
      expect(result.time).toBe('10:00 AM')
    })
  })
})
