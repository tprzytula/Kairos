import React, { useState, useEffect, useRef, useCallback } from 'react'
import ExploreIcon from '@mui/icons-material/Explore'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { IAdventure } from '../../../../../../types/adventure'
import { getLocationLink } from '../../../../../../utils/location'
import {
  CarouselContainer,
  CarouselTrack,
  CarouselSlide,
  CarouselDots,
  CarouselDot,
  HeroWrapper,
  HeroGradient,
  HeroImage,
  HeroInitial,
  HeroOverlay,
  HeroLabel,
  HeroTitle,
  HeroMeta,
  AdventureBadge,
  SkeletonContainer,
  SkeletonBadge,
  SkeletonOverlay,
  SkeletonLine,
  SkeletonTitle,
} from './index.styled'

const AUTO_SCROLL_MS = 5000

const getTodayString = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const getDayLabel = (dateStr: string, endDateStr?: string): string => {
  const todayStr = getTodayString()
  const diff = Math.round(
    (new Date(`${dateStr}T00:00:00`).getTime() - new Date(`${todayStr}T00:00:00`).getTime()) /
    86400000
  )

  const formatDateLabel = (dStr: string, dDiff: number): string => {
    if (dStr === todayStr) return 'Today'
    if (dDiff === 1) return 'Tomorrow'
    if (dDiff <= 6) return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(`${dStr}T00:00:00`))
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(`${dStr}T00:00:00`))
  }

  const startLabel = formatDateLabel(dateStr, diff)

  if (!endDateStr || endDateStr === dateStr) return startLabel

  const endDiff = Math.round(
    (new Date(`${endDateStr}T00:00:00`).getTime() - new Date(`${todayStr}T00:00:00`).getTime()) /
    86400000
  )
  const endLabel = formatDateLabel(endDateStr, endDiff)

  return `${startLabel} – ${endLabel}`
}

const sortedAdventures = (adventures: IAdventure[]): IAdventure[] =>
  [...adventures].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    if (a.time && b.time) return a.time.localeCompare(b.time)
    if (a.time) return -1
    if (b.time) return 1
    return 0
  })

interface IUpcomingAdventureCardProps {
  adventures: IAdventure[]
  isLoading?: boolean
  onAdventureClick?: (adventure: IAdventure) => void
}

export const UpcomingAdventureCard: React.FC<IUpcomingAdventureCardProps> = ({ adventures, isLoading, onAdventureClick }) => {
  const items = sortedAdventures(adventures)
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(0)
  const didSwipe = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + items.length) % items.length)
  }, [items.length])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (items.length > 1) {
      timerRef.current = setInterval(next, AUTO_SCROLL_MS)
    }
  }, [items.length, next])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  useEffect(() => {
    setActiveIndex(0)
  }, [items.length])

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

  const handleAdventureClick = (adventure: IAdventure) => {
    if (didSwipe.current) {
      didSwipe.current = false
      return
    }
    onAdventureClick?.(adventure)
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    resetTimer()
  }

  if (isLoading) {
    return (
      <SkeletonContainer>
        <SkeletonBadge />
        <SkeletonOverlay>
          <SkeletonLine sx={{ width: '45%' }} />
          <SkeletonTitle sx={{ width: '70%' }} />
        </SkeletonOverlay>
      </SkeletonContainer>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <CarouselContainer
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AdventureBadge>
        <ExploreIcon />
        Adventure
      </AdventureBadge>

      <CarouselTrack offset={activeIndex}>
        {items.map((adventure) => {
          const seed = adventure.name.charCodeAt(0)
          const dayLabel = getDayLabel(adventure.date, adventure.endDate)
          return (
            <CarouselSlide key={adventure.id}>
              <HeroWrapper
                onClick={() => handleAdventureClick(adventure)}
                sx={{ cursor: 'pointer' }}
              >
                <HeroGradient seed={seed}>
                  {!adventure.imagePath && <HeroInitial>{adventure.name.charAt(0).toUpperCase()}</HeroInitial>}
                </HeroGradient>
                {adventure.imagePath && (
                  <HeroImage src={adventure.imagePath} alt={adventure.name} />
                )}
                <HeroOverlay>
                  <HeroLabel>
                    <ExploreIcon />
                    {dayLabel}
                  </HeroLabel>
                  <HeroTitle>{adventure.name}</HeroTitle>
                  {(adventure.time || adventure.location) && (
                    <HeroMeta>
                      {adventure.time && (
                        <>
                          <AccessTimeIcon />
                          {adventure.time}
                        </>
                      )}
                      {adventure.location && (() => {
                        const { label, href } = getLocationLink(adventure.location)
                        return (
                          <>
                            {adventure.time && <span>·</span>}
                            <LocationOnIcon />
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: 'inherit', textDecoration: 'underline' }}
                            >
                              {label}
                            </a>
                          </>
                        )
                      })()}
                    </HeroMeta>
                  )}
                </HeroOverlay>
              </HeroWrapper>
            </CarouselSlide>
          )
        })}
      </CarouselTrack>

      {items.length > 1 && (
        <CarouselDots>
          {items.map((_, i) => (
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

export default UpcomingAdventureCard
