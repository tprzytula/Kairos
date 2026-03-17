import React from 'react'
import { Collapse } from '@mui/material'
import { IBirthdayItem } from '../../../../../../api/birthdays/retrieve/types'
import { BirthdayRow, BirthdayName, DaysUntil, BirthdaySubLine, MoreCount } from './index.styled'

interface IUpcomingBirthdaysCardProps {
  birthdays: IBirthdayItem[]
  isExpanded?: boolean
}

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

type SortedBirthday = IBirthdayItem & { nextDate: Date }

const BirthdayEntry: React.FC<{ b: SortedBirthday; showDetails: boolean }> = ({ b, showDetails }) => {
  const { label, isToday } = getDaysUntilLabel(b.nextDate)
  const subLine = b.notes ?? ''

  return (
    <div>
      <BirthdayRow>
        <BirthdayName>{b.name}</BirthdayName>
        <DaysUntil $isToday={isToday}>{label}</DaysUntil>
      </BirthdayRow>
      {showDetails && subLine && <BirthdaySubLine>{subLine}</BirthdaySubLine>}
    </div>
  )
}

export const UpcomingBirthdaysCard: React.FC<IUpcomingBirthdaysCardProps> = ({ birthdays, isExpanded = false }) => {
  if (birthdays.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No birthdays saved</span>
  }

  const sorted = [...birthdays]
    .map(b => ({ ...b, nextDate: getNextBirthdayDate(b) }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  return (
    <>
      {top3.map(b => (
        <BirthdayEntry key={b.id} b={b} showDetails={isExpanded} />
      ))}
      {rest.length > 0 && (
        <>
          <Collapse in={isExpanded} timeout={150} unmountOnExit>
            {rest.map(b => (
              <BirthdayEntry key={b.id} b={b} showDetails={isExpanded} />
            ))}
          </Collapse>
          {!isExpanded && <MoreCount>+{rest.length} more</MoreCount>}
        </>
      )}
    </>
  )
}

export default UpcomingBirthdaysCard
