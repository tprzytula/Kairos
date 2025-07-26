import { formatTimeElapsed, formatTimestamp } from './utils'

describe('formatTimeElapsed', () => {
  it('should return "First recording" when no previous timestamp', () => {
    const result = formatTimeElapsed(1000000)
    expect(result).toBe('First recording')
  })

  it('should return "Just now" for very small differences', () => {
    const current = 1000000
    const previous = 999950
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('Just now')
  })

  it('should format minutes correctly', () => {
    const current = 1000000
    const previous = 1000000 - (5 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('5 minutes later')
  })

  it('should format single minute correctly', () => {
    const current = 1000000
    const previous = 1000000 - (1 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('1 minute later')
  })

  it('should format hours correctly', () => {
    const current = 1000000
    const previous = 1000000 - (2 * 60 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('2 hours later')
  })

  it('should format hours and minutes correctly', () => {
    const current = 1000000
    const previous = 1000000 - (2 * 60 * 60 * 1000 + 30 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('2h 30m later')
  })

  it('should format days correctly', () => {
    const current = 1000000
    const previous = 1000000 - (3 * 24 * 60 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('3 days later')
  })

  it('should format single day correctly', () => {
    const current = 1000000
    const previous = 1000000 - (1 * 24 * 60 * 60 * 1000)
    const result = formatTimeElapsed(current, previous)
    expect(result).toBe('1 day later')
  })
})

describe('formatTimestamp', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T10:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should format today time correctly', () => {
    const today = new Date('2024-01-15T08:30:00Z').getTime()
    const result = formatTimestamp(today)
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('should format yesterday correctly', () => {
    const yesterday = new Date('2024-01-14T10:00:00Z').getTime()
    const result = formatTimestamp(yesterday)
    expect(result).toBe('Yesterday')
  })

  it('should format days ago correctly', () => {
    const threeDaysAgo = new Date('2024-01-12T10:00:00Z').getTime()
    const result = formatTimestamp(threeDaysAgo)
    expect(result).toBe('3 days ago')
  })

  it('should format older dates with full date', () => {
    const tenDaysAgo = new Date('2024-01-05T14:30:00Z').getTime()
    const result = formatTimestamp(tenDaysAgo)
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })
}) 