import React from 'react'
import { Collapse } from '@mui/material'
import { IBirthdayItem } from '../../../../../../api/birthdays/retrieve/types'
import {
  BirthdayList,
  BirthdayRow,
  BirthdayAvatar,
  BirthdayInfo,
  BirthdayName,
  BirthdayDate,
  DaysUntilBadge,
  DaysUrgency,
  MoreCount,
} from './index.styled'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
]

const getAvatarGradient = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
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

const getDaysUntilInfo = (nextDate: Date): { label: string; urgency: DaysUrgency } => {
  const today = new Date()
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.round((nextDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { label: 'Today!', urgency: 'today' }
  if (diffDays === 1) return { label: 'Tomorrow', urgency: 'soon' }
  if (diffDays <= 7) return { label: `in ${diffDays}d`, urgency: 'week' }
  return { label: `in ${diffDays}d`, urgency: 'later' }
}

type SortedBirthday = IBirthdayItem & { nextDate: Date }

const BirthdayEntry: React.FC<{ b: SortedBirthday }> = ({ b }) => {
  const { label, urgency } = getDaysUntilInfo(b.nextDate)
  const exactDay = `${MONTH_SHORT[b.month - 1]} ${b.day}`
  const currentYear = new Date().getFullYear()
  const age = b.birthYear ? currentYear - b.birthYear : null
  const dateLabel = age !== null ? `${exactDay} · turns ${age}` : exactDay

  return (
    <BirthdayRow>
      <BirthdayAvatar $gradient={getAvatarGradient(b.name)}>
        {b.name.charAt(0).toUpperCase()}
      </BirthdayAvatar>
      <BirthdayInfo>
        <BirthdayName>{b.name}</BirthdayName>
        <BirthdayDate>{dateLabel}</BirthdayDate>
      </BirthdayInfo>
      <DaysUntilBadge $urgency={urgency}>{label}</DaysUntilBadge>
    </BirthdayRow>
  )
}

interface IUpcomingBirthdaysCardProps {
  birthdays: IBirthdayItem[]
  isExpanded?: boolean
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
    <BirthdayList>
      {top3.map(b => (
        <BirthdayEntry key={b.id} b={b} />
      ))}
      {rest.length > 0 && (
        <>
          <Collapse in={isExpanded} timeout={150} unmountOnExit>
            <BirthdayList>
              {rest.map(b => (
                <BirthdayEntry key={b.id} b={b} />
              ))}
            </BirthdayList>
          </Collapse>
          {!isExpanded && <MoreCount>+{rest.length} more</MoreCount>}
        </>
      )}
    </BirthdayList>
  )
}

export default UpcomingBirthdaysCard
