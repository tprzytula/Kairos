import React from 'react'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CakeIcon from '@mui/icons-material/Cake'
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
  return (
    <MiniCardsGrid>
      <MiniCard sx={{ gridColumn: '1 / 3', gridRow: 1, minHeight: 'unset' }}>
        <TodayMealCard todayMeals={todayMeals} isLoading={isLoading} onMealClick={onMealClick} />
      </MiniCard>

      <MiniCard sx={{ gridColumn: 1, gridRow: 2 }}>
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><ChecklistIcon /></MiniCardIcon>
            <MiniCardTitle>Today's Tasks</MiniCardTitle>
          </MiniCardHeader>
          <MiniCardBody>
            <TodayTasksCard sortedItems={toDoStats.sortedItems} />
          </MiniCardBody>
        </MiniCardContent>
      </MiniCard>

      <MiniCard sx={{ gridColumn: 2, gridRow: 2 }}>
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><CakeIcon /></MiniCardIcon>
            <MiniCardTitle>Birthdays</MiniCardTitle>
          </MiniCardHeader>
          <MiniCardBody>
            <UpcomingBirthdaysCard birthdays={birthdays} />
          </MiniCardBody>
        </MiniCardContent>
      </MiniCard>
    </MiniCardsGrid>
  )
}

export default PlannerSection
