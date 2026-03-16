import React from 'react'
import { ITodayMealItem } from '../../types'
import { MealRow, MealThumbnail, MealThumbnailPlaceholder, MealName, AdditionalMeals } from './index.styled'

interface ITodayMealCardProps {
  todayMeals: ITodayMealItem[]
}

export const TodayMealCard: React.FC<ITodayMealCardProps> = ({ todayMeals }) => {
  if (todayMeals.length === 0) {
    return <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #888)' }}>No meal planned</span>
  }

  const [first, ...rest] = todayMeals

  return (
    <>
      <MealRow>
        {first.imagePath
          ? <MealThumbnail src={first.imagePath} alt={first.recipeName} />
          : <MealThumbnailPlaceholder seed={first.recipeName.charCodeAt(0)}>
              {first.recipeName.charAt(0).toUpperCase()}
            </MealThumbnailPlaceholder>
        }
        <MealName>{first.recipeName}</MealName>
      </MealRow>
      {rest.length > 0 && (
        <AdditionalMeals>+{rest.length} more</AdditionalMeals>
      )}
    </>
  )
}

export default TodayMealCard
