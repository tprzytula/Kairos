import React from 'react'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { IToDoSectionProps } from './types'
import TodayMealCard from './components/TodayMealCard'
import TaskList from './components/TaskList'
import SectionCard from '../../../../components/SectionCard'
import { SECTION_GRADIENTS } from '../../../../constants/sectionColors'
import { MiniCardsGrid, MiniCard } from './index.styled'

export const PlannerSection: React.FC<IToDoSectionProps> = ({
  toDoStats,
  todayMeals,
  isLoading,
  onStepToggle,
  onCardClick,
  onMealClick,
}) => {
  return (
    <>
      {(isLoading || todayMeals.length > 0) && (
        <MiniCardsGrid>
          <MiniCard sx={{ gridColumn: '1 / 3', gridRow: 1, minHeight: 'unset' }}>
            <TodayMealCard todayMeals={todayMeals} isLoading={isLoading} onMealClick={onMealClick} />
          </MiniCard>
        </MiniCardsGrid>
      )}

      <SectionCard
        icon={ChecklistIcon}
        title="Tasks"
        count={toDoStats.pendingItems.length}
        accentGradient={SECTION_GRADIENTS.planner}
        accentBadgeColor="rgba(99, 102, 241, 0.12)"
      >
        <TaskList
          items={toDoStats.sortedItems}
          onStepToggle={onStepToggle}
          onCardClick={onCardClick}
        />
      </SectionCard>
    </>
  )
}

export default PlannerSection
