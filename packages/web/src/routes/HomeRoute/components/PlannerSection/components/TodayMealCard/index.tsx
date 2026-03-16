import React from 'react'
import { IMealPlan } from '../../../../../../types/mealPlan'
import { MealName, AdditionalMeals } from './index.styled'

interface ITodayMealCardProps {
  todayMeals: IMealPlan[]
}

export const TodayMealCard: React.FC<ITodayMealCardProps> = ({ todayMeals }) => {
  if (todayMeals.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No meal planned</span>
  }

  const [first, ...rest] = todayMeals

  return (
    <>
      <MealName>{first.recipeName}</MealName>
      {rest.length > 0 && (
        <AdditionalMeals>+{rest.length} more</AdditionalMeals>
      )}
    </>
  )
}

export default TodayMealCard
