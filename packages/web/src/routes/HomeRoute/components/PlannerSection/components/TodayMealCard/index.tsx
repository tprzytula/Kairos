import React from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { ITodayMealItem } from '../../types'
import {
  HeroWrapper,
  HeroImage,
  HeroPlaceholder,
  HeroPlaceholderInitial,
  HeroOverlay,
  HeroLabel,
  HeroTitle,
  AdditionalMeals,
  AdditionalMealPill,
  EmptyState,
} from './index.styled'

interface ITodayMealCardProps {
  todayMeals: ITodayMealItem[]
}

export const TodayMealCard: React.FC<ITodayMealCardProps> = ({ todayMeals }) => {
  if (todayMeals.length === 0) {
    return <EmptyState>No meal planned for today</EmptyState>
  }

  const [first, ...rest] = todayMeals
  const seed = first.recipeName.charCodeAt(0)

  return (
    <HeroWrapper>
      {first.imagePath
        ? <HeroImage src={first.imagePath} alt={first.recipeName} />
        : (
          <HeroPlaceholder seed={seed}>
            <HeroPlaceholderInitial>{first.recipeName.charAt(0).toUpperCase()}</HeroPlaceholderInitial>
          </HeroPlaceholder>
        )
      }
      <HeroOverlay>
        <HeroLabel>
          <RestaurantIcon />
          Dinner Tonight
        </HeroLabel>
        <HeroTitle>{first.recipeName}</HeroTitle>
        {rest.length > 0 && (
          <AdditionalMeals>
            {rest.map((meal) => (
              <AdditionalMealPill key={meal.id}>{meal.recipeName}</AdditionalMealPill>
            ))}
          </AdditionalMeals>
        )}
      </HeroOverlay>
    </HeroWrapper>
  )
}

export default TodayMealCard
