import React, { useState, useEffect, useRef, useCallback } from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { ITodayMealItem } from '../../types'
import { MEAL_TYPE_ORDER } from '../../../../../../enums/mealType'
import {
  CarouselContainer,
  CarouselTrack,
  CarouselSlide,
  CarouselDots,
  CarouselDot,
  MealPlanBadge,
  HeroWrapper,
  HeroImage,
  HeroPlaceholder,
  HeroPlaceholderInitial,
  HeroOverlay,
  HeroLabel,
  HeroTitle,
  EmptyState,
} from './index.styled'

const AUTO_SCROLL_MS = 4000

interface ITodayMealCardProps {
  todayMeals: ITodayMealItem[]
  onMealClick?: (meal: ITodayMealItem) => void
}

const sortedMeals = (meals: ITodayMealItem[]): ITodayMealItem[] =>
  [...meals].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    const ai = a.mealType ? MEAL_TYPE_ORDER.indexOf(a.mealType) : MEAL_TYPE_ORDER.length
    const bi = b.mealType ? MEAL_TYPE_ORDER.indexOf(b.mealType) : MEAL_TYPE_ORDER.length
    return ai - bi
  })

const getTodayString = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const getDayLabel = (dateStr: string): string => {
  const todayStr = getTodayString()
  if (dateStr === todayStr) return 'Today'
  const diff = Math.round(
    (new Date(`${dateStr}T00:00:00`).getTime() - new Date(`${todayStr}T00:00:00`).getTime()) /
    86400000
  )
  if (diff === 1) return 'Tomorrow'
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' })
}

export const TodayMealCard: React.FC<ITodayMealCardProps> = ({ todayMeals, onMealClick }) => {
  const meals = sortedMeals(todayMeals)
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const didSwipe = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % meals.length)
  }, [meals.length])

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + meals.length) % meals.length)
  }, [meals.length])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (meals.length > 1) {
      timerRef.current = setInterval(next, AUTO_SCROLL_MS)
    }
  }, [meals.length, next])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  // Reset index when meal list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [meals.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
      resetTimer()
      didSwipe.current = true
    } else {
      didSwipe.current = false
    }
  }

  const handleMealClick = (meal: ITodayMealItem) => {
    if (didSwipe.current) {
      didSwipe.current = false
      return
    }
    onMealClick?.(meal)
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    resetTimer()
  }

  if (meals.length === 0) {
    return <EmptyState>No meal planned</EmptyState>
  }

  return (
    <CarouselContainer
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <MealPlanBadge>
        <CalendarTodayIcon />
        Meal Plan
      </MealPlanBadge>

      <CarouselTrack offset={activeIndex}>
        {meals.map((meal) => {
          const seed = meal.recipeName.charCodeAt(0)
          const dayLabel = getDayLabel(meal.date)
          return (
            <CarouselSlide key={meal.id}>
              <HeroWrapper
                onClick={() => handleMealClick(meal)}
                sx={meal.recipeId ? { cursor: 'pointer' } : undefined}
              >
                {meal.imagePath
                  ? <HeroImage src={meal.imagePath} alt={meal.recipeName} />
                  : (
                    <HeroPlaceholder seed={seed}>
                      <HeroPlaceholderInitial>{meal.recipeName.charAt(0).toUpperCase()}</HeroPlaceholderInitial>
                    </HeroPlaceholder>
                  )
                }
                <HeroOverlay>
                  <HeroLabel>
                    <RestaurantIcon />
                    {dayLabel}{meal.mealType ? ` · ${meal.mealType}` : ''}
                  </HeroLabel>
                  <HeroTitle>{meal.recipeName}</HeroTitle>
                </HeroOverlay>
              </HeroWrapper>
            </CarouselSlide>
          )
        })}
      </CarouselTrack>

      {meals.length > 1 && (
        <CarouselDots>
          {meals.map((_, i) => (
            <CarouselDot
              key={i}
              active={i === activeIndex}
              onClick={() => handleDotClick(i)}
            />
          ))}
        </CarouselDots>
      )}
    </CarouselContainer>
  )
}

export default TodayMealCard
