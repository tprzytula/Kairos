import React from 'react'
import { IBirthdayItem } from '../../../../../../api/birthdays/retrieve/types'
import { BirthdayRow, BirthdayName, DaysUntil } from './index.styled'

interface IUpcomingBirthdaysCardProps {
  birthdays: IBirthdayItem[]
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

export const UpcomingBirthdaysCard: React.FC<IUpcomingBirthdaysCardProps> = ({ birthdays }) => {
  if (birthdays.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No birthdays saved</span>
  }

  const sorted = [...birthdays]
    .map(b => ({ ...b, nextDate: getNextBirthdayDate(b) }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 3)

  return (
    <>
      {sorted.map(b => {
        const { label, isToday } = getDaysUntilLabel(b.nextDate)
        return (
          <BirthdayRow key={b.id}>
            <BirthdayName>{b.name}</BirthdayName>
            <DaysUntil $isToday={isToday}>{label}</DaysUntil>
          </BirthdayRow>
        )
      })}
    </>
  )
}

export default UpcomingBirthdaysCard
