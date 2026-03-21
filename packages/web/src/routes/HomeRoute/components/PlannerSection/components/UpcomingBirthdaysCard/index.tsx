import React from 'react'
import { Collapse } from '@mui/material'
import { IBirthdayItem } from '../../../../../../api/birthdays/retrieve/types'
import {
  BirthdayList,
  BirthdayEntryContainer,
  DateBadge,
  DateBadgeMonth,
  DateBadgeDay,
  DateBadgeWeekday,
  BirthdayInfo,
  BirthdayName,
  DaysUntil,
  BirthdaySubLine,
  MoreCount,
  CollapseGrid,
} from './index.styled'

interface IUpcomingBirthdaysCardProps {
  birthdays: IBirthdayItem[]
  isExpanded?: boolean
}

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

const getNextBirthdayDate = (birthday: IBirthdayItem): Date => {
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const thisYear = today.getFullYear()
  const candidate = new Date(thisYear, birthday.month - 1, birthday.day)
  if (candidate.getTime() < todayMidnight.getTime()) {
    return new Date(thisYear + 1, birthday.month - 1, birthday.day)
  }
  return candidate
}

const getDaysUntilLabel = (nextDate: Date): { label: string; isToday: boolean } => {
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.round((nextDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { label: 'Today!', isToday: true }
  if (diffDays === 1) return { label: 'Tomorrow', isToday: false }
  return { label: `in ${diffDays}d`, isToday: false }
}

const getDateParts = (nextDate: Date): { month: string; day: number; weekday: string } => ({
  month: monthFormatter.format(nextDate),
  day: nextDate.getDate(),
  weekday: weekdayFormatter.format(nextDate),
})

type SortedBirthday = IBirthdayItem & { nextDate: Date }

const BirthdayEntry: React.FC<{ b: SortedBirthday; showDetails: boolean }> = ({ b, showDetails }) => {
  const { label, isToday } = getDaysUntilLabel(b.nextDate)
  const { month, day, weekday } = getDateParts(b.nextDate)
  const subLine = b.notes ?? ''

  return (
    <BirthdayEntryContainer $isToday={isToday}>
      <DateBadge $isToday={isToday}>
        <DateBadgeMonth $isToday={isToday}>{month}</DateBadgeMonth>
        <DateBadgeDay $isToday={isToday}>{day}</DateBadgeDay>
        <DateBadgeWeekday $isToday={isToday}>{weekday}</DateBadgeWeekday>
      </DateBadge>
      <BirthdayInfo>
        <BirthdayName>{b.name}</BirthdayName>
        {showDetails && subLine && <BirthdaySubLine>{subLine}</BirthdaySubLine>}
      </BirthdayInfo>
      <DaysUntil $isToday={isToday}>{label}</DaysUntil>
    </BirthdayEntryContainer>
  )
}

export const UpcomingBirthdaysCard: React.FC<IUpcomingBirthdaysCardProps> = ({ birthdays, isExpanded = false }) => {
  if (birthdays.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No birthdays saved</span>
  }

  const sorted = [...birthdays]
    .map(b => ({ ...b, nextDate: getNextBirthdayDate(b) }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())

  const INITIAL_COUNT = 2
  const topN = sorted.slice(0, INITIAL_COUNT)
  const rest = sorted.slice(INITIAL_COUNT)

  return (
    <BirthdayList>
      {topN.map(b => (
        <BirthdayEntry key={b.id} b={b} showDetails={isExpanded} />
      ))}
      {rest.length > 0 && (
        <>
          <Collapse in={isExpanded} timeout={150} unmountOnExit sx={{ gridColumn: '1 / -1' }}>
            <CollapseGrid>
              {rest.map(b => (
                <BirthdayEntry key={b.id} b={b} showDetails={isExpanded} />
              ))}
            </CollapseGrid>
          </Collapse>
          {!isExpanded && <MoreCount>+{rest.length} more</MoreCount>}
        </>
      )}
    </BirthdayList>
  )
}

export default UpcomingBirthdaysCard
