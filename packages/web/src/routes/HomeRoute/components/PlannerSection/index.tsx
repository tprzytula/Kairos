import React from 'react'
import ChecklistIcon from '@mui/icons-material/Checklist'
import RestaurantIcon from '@mui/icons-material/Restaurant'
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
}) => {
  return (
    <MiniCardsGrid>
      <MiniCard sx={{ gridColumn: 1, gridRow: '1 / 3' }}>
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><RestaurantIcon /></MiniCardIcon>
            <MiniCardTitle>Dinner Tonight</MiniCardTitle>
          </MiniCardHeader>
          <MiniCardBody>
            <TodayMealCard todayMeals={todayMeals} />
          </MiniCardBody>
        </MiniCardContent>
      </MiniCard>

      <MiniCard sx={{ gridColumn: 2, gridRow: 1 }}>
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
