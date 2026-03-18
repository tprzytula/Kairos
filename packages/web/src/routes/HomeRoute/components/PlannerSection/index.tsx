import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box } from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CakeIcon from '@mui/icons-material/Cake'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IToDoSectionProps } from './types'
import TodayTasksCard from './components/TodayTasksCard'
import WeekTasksCard from './components/WeekTasksCard'
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
  TaskCarouselWrapper,
  TaskCarouselTrack,
  TaskCarouselSlide,
  TaskCarouselDots,
  TaskCarouselDot,
} from './index.styled'

const AUTO_SCROLL_MS = 7000

export const PlannerSection: React.FC<IToDoSectionProps> = ({
  toDoStats,
  birthdays,
  todayMeals,
  isLoading,
  onMealClick,
}) => {
  const [isBirthdaysExpanded, setIsBirthdaysExpanded] = useState(false)
  const [isTodayTasksExpanded, setIsTodayTasksExpanded] = useState(false)
  const [activeTaskSlide, setActiveTaskSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveTaskSlide(s => (s + 1) % 2)
    }, AUTO_SCROLL_MS)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const handleTaskTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTaskTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      setActiveTaskSlide(s => diff > 0 ? (s + 1) % 2 : (s - 1 + 2) % 2)
      resetTimer()
    }
  }

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setActiveTaskSlide(index)
    resetTimer()
  }

  return (
    <MiniCardsGrid>
      <MiniCard sx={{ gridColumn: '1 / 3', gridRow: 1, minHeight: 'unset' }}>
        <TodayMealCard todayMeals={todayMeals} isLoading={isLoading} onMealClick={onMealClick} />
      </MiniCard>

      <MiniCard
        sx={{ gridColumn: 1, gridRow: 2, cursor: 'pointer' }}
        onClick={() => setIsTodayTasksExpanded(v => !v)}
        onTouchStart={handleTaskTouchStart}
        onTouchEnd={handleTaskTouchEnd}
      >
        <MiniCardContent>
          <MiniCardHeader>
            <MiniCardIcon><ChecklistIcon /></MiniCardIcon>
            <MiniCardTitle>{activeTaskSlide === 0 ? "Today's Tasks" : 'This Week'}</MiniCardTitle>
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
          <TaskCarouselWrapper>
            <TaskCarouselTrack $offset={activeTaskSlide}>
              <TaskCarouselSlide data-testid="today-tasks-slide">
                <TodayTasksCard sortedItems={toDoStats.sortedItems} isExpanded={isTodayTasksExpanded} />
              </TaskCarouselSlide>
              <TaskCarouselSlide>
                <WeekTasksCard sortedItems={toDoStats.sortedItems} />
              </TaskCarouselSlide>
            </TaskCarouselTrack>
          </TaskCarouselWrapper>
          <TaskCarouselDots>
            {[0, 1].map(i => (
              <TaskCarouselDot key={i} $active={i === activeTaskSlide} onClick={e => handleDotClick(e, i)} />
            ))}
          </TaskCarouselDots>
        </MiniCardContent>
      </MiniCard>

      <MiniCard
        sx={{ gridColumn: 2, gridRow: 2, cursor: 'pointer' }}
        onClick={() => setIsBirthdaysExpanded(v => !v)}
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
