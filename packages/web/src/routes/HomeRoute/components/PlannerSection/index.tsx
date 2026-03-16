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
      <MiniCard>
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

      <MiniCard>
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

      <MiniCard>
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
