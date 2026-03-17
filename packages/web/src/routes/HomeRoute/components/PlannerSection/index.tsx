import React, { useState } from 'react'
import { Box } from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CakeIcon from '@mui/icons-material/Cake'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IToDoSectionProps } from './types'
import TodayTasksCard from './components/TodayTasksCard'
import TodayMealCard from './components/TodayMealCard'
import UpcomingBirthdaysCard from './components/UpcomingBirthdaysCard'
import {
  MiniCardsGrid,
  MiniCard,
  MiniCardContent,
  MiniCardHeader,
  MiniCardIcon,
  MiniCardTitle,
  MiniCardBody,
} from './index.styled'


export const PlannerSection: React.FC<IToDoSectionProps> = ({
  toDoStats,
  birthdays,
  todayMeals,
  isLoading,
  onMealClick,
}) => {
  const [expandedCard, setExpandedCard] = useState<'tasks' | 'birthdays' | null>(null)

  const isTodayTasksExpanded = expandedCard === 'tasks'
  const isBirthdaysExpanded = expandedCard === 'birthdays'

  const toggleTasks = () => setExpandedCard(v => (v === 'tasks' ? null : 'tasks'))
  const toggleBirthdays = () => setExpandedCard(v => (v === 'birthdays' ? null : 'birthdays'))

  const tasksGridColumn = isTodayTasksExpanded ? '1 / 3' : 1
  const tasksGridRow = isBirthdaysExpanded ? 3 : 2
  const birthdaysGridColumn = isBirthdaysExpanded ? '1 / 3' : 2
  const birthdaysGridRow = isTodayTasksExpanded ? 3 : 2

  return (
    <MiniCardsGrid>
      <MiniCard sx={{ gridColumn: '1 / 3', gridRow: 1, minHeight: 'unset' }}>
        <TodayMealCard todayMeals={todayMeals} isLoading={isLoading} onMealClick={onMealClick} />
      </MiniCard>

      <MiniCard
        sx={{ gridColumn: tasksGridColumn, gridRow: tasksGridRow, cursor: 'pointer' }}
        onClick={toggleTasks}
      >
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><ChecklistIcon /></MiniCardIcon>
            <MiniCardTitle>Today's Tasks</MiniCardTitle>
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 150ms ease',
                transform: isTodayTasksExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: 0.6,
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />
            </Box>
          </MiniCardHeader>
          <MiniCardBody>
            <TodayTasksCard sortedItems={toDoStats.sortedItems} isExpanded={isTodayTasksExpanded} />
          </MiniCardBody>
        </MiniCardContent>
      </MiniCard>

      <MiniCard
        sx={{ gridColumn: birthdaysGridColumn, gridRow: birthdaysGridRow, cursor: 'pointer' }}
        onClick={toggleBirthdays}
      >
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><CakeIcon /></MiniCardIcon>
            <MiniCardTitle>Birthdays</MiniCardTitle>
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 150ms ease',
                transform: isBirthdaysExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: 0.6,
              }}
            >
              <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />
            </Box>
          </MiniCardHeader>
          <MiniCardBody>
            <UpcomingBirthdaysCard birthdays={birthdays} isExpanded={isBirthdaysExpanded} />
          </MiniCardBody>
        </MiniCardContent>
      </MiniCard>
    </MiniCardsGrid>
  )
}

export default PlannerSection
