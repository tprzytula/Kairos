import React, { useState } from 'react'
import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import StandardLayout from '../../layout/standardLayout'
import AppInfoCard from '../../components/AppInfoCard'
import DashboardHeader from '../../components/DashboardHeader'
import GroceryItemPreviewPopup from '../../components/GroceryItemPreviewPopup'
import HomeGroceryItemPlaceholder from './components/HomeGroceryItemPlaceholder'
import HomeToDoItemPlaceholder from './components/HomeToDoItemPlaceholder'
import HomeNoiseItemPlaceholder from './components/HomeNoiseItemPlaceholder'
import HomeGroceryItem from './components/HomeGroceryItem'
import HomeToDoItem from './components/HomeToDoItem'
import HomeNoiseItem from './components/HomeNoiseItem'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { formatTimeElapsed, formatTimestamp } from './utils'

const formatDueDateRelative = (dueDate?: number): string => {
  if (!dueDate) return ''
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    const absDays = Math.abs(diffDays)
    if (absDays === 1) return 'overdue by 1 day'
    return `overdue by ${absDays} days`
  } else if (diffDays === 0) {
    return 'due today'
  } else if (diffDays === 1) {
    return 'due tomorrow'
  } else if (diffDays <= 7) {
    return `in ${diffDays} days`
  } else if (diffDays <= 30) {
    const weeks = Math.ceil(diffDays / 7)
    return weeks === 1 ? 'in 1 week' : `in ${weeks} weeks`
  } else {
    const months = Math.ceil(diffDays / 30)
    return months === 1 ? 'in 1 month' : `in ${months} months`
  }
}

const getDueDateClass = (dueDate?: number): string => {
  if (!dueDate) return ''
  
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'soon'
  return ''
}

const formatNoiseTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)
  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)
  
  if (dateOnly.getTime() === today.getTime()) {
    return {
      date: 'Today',
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  } else if (dateOnly.getTime() === yesterday.getTime()) {
    return {
      date: 'Yesterday',
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  } else {
    return {
      date: date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}

const getNoiseViewTitle = (view: 'overview' | 'today' | 'last7days' | 'last30days'): string => {
  switch (view) {
    case 'today': return 'Today\'s Recordings'
    case 'last7days': return 'Last 7 Days'
    case 'last30days': return 'Last 30 Days'
    default: return 'Recordings'
  }
}

import {
  Container,
  FullWidthSection,
  SectionCard,
  SectionHeader,
  SectionContent,
  ItemList,
  EmptyState,
  GroceryStats,
  StatItem,
  GroceryImagesGrid,
  GroceryImageItem,
  GroceryImageOverflow,
  MoreItemsIndicator,
  NoiseStats,
  NoiseStatBlock,
  NoiseStatLabel,
  NoiseStatCount,
  NoiseDetailHeader,
  NoiseDetailTitle,
  NoiseBackButton,
  NoiseDetailList,
  NoiseDetailItem,
  NoiseDetailDate,
  NoiseDetailTime,
  NoiseDetailEmpty,
  CompactItemList,
  CompactItemText,
  CompactItemContent,
  CompactItemMeta,
  CompactDescription,
  DueDateText
} from './index.styled'

const HomeDataContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading } = useToDoListContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { state: { purchasedItems } } = useAppState()
  const [selectedGroceryItem, setSelectedGroceryItem] = useState<IGroceryItem | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number; arrowOffset?: number } | undefined>(undefined)
  const [isToDoItemsExpanded, setIsToDoItemsExpanded] = useState(false)
  const [noiseView, setNoiseView] = useState<'overview' | 'today' | 'last7days' | 'last30days'>('overview')

  const handleGroceryItemClick = (item: IGroceryItem, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const bubbleMaxWidth = 240 // Max width from styled component
    const bubbleMinWidth = 180 // Min width from styled component
    // Use max width for safe positioning calculation
    const bubbleWidth = bubbleMaxWidth
    const viewportWidth = window.innerWidth
    const padding = 16 // Minimum padding from edge
    
    // Calculate ideal center position (center of clicked icon)
    const idealCenterX = rect.left + rect.width / 2 + window.scrollX
    
    // Calculate bounds for bubble center position (accounting for bubble being centered via transform)
    const minCenterX = window.scrollX + padding + bubbleWidth / 2
    const maxCenterX = window.scrollX + viewportWidth - padding - bubbleWidth / 2
    
    // Clamp bubble center position within safe viewport bounds
    const adjustedCenterX = Math.max(minCenterX, Math.min(maxCenterX, idealCenterX))
    
    // Calculate arrow offset (how far the arrow should move from bubble center to point to icon center)
    const arrowOffset = idealCenterX - adjustedCenterX
    
    const position = {
      top: rect.bottom + window.scrollY + 8,
      left: adjustedCenterX, // This will be the center point, styled component will translate -50%
      arrowOffset: arrowOffset,
    }
    
    setSelectedGroceryItem(item)
    setAnchorPosition(position)
    setIsPopupOpen(true)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
    setSelectedGroceryItem(null)
    setAnchorPosition(undefined)
  }

  const handleToggleToDoItems = () => {
    setIsToDoItemsExpanded(!isToDoItemsExpanded)
  }

  const handleNoiseViewChange = (view: 'overview' | 'today' | 'last7days' | 'last30days') => {
    setNoiseView(view)
  }

  const getFilteredNoiseItems = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (noiseView) {
      case 'today':
        return noiseTrackingItems.filter(item => {
          const itemDate = new Date(item.timestamp)
          return itemDate >= today
        })
      case 'last7days':
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return noiseTrackingItems.filter(item => {
          const itemDate = new Date(item.timestamp)
          return itemDate >= sevenDaysAgo
        })
      case 'last30days':
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return noiseTrackingItems.filter(item => {
          const itemDate = new Date(item.timestamp)
          return itemDate >= thirtyDaysAgo
        })
      default:
        return []
    }
  }
  
  const unpurchasedItems = groceryList.filter(item => !purchasedItems.has(item.id))
  const groceryStats = {
    totalItems: groceryList.length,
    unpurchasedItems,
    displayItems: unpurchasedItems.length > 10 ? unpurchasedItems.slice(0, 9) : unpurchasedItems,
    hasOverflow: unpurchasedItems.length > 10
  }
  
  const pendingToDoItems = toDoList.filter(item => !item.isDone)
  
  const sortedToDoItems = pendingToDoItems.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate - b.dueDate
  })
  
  const displayedToDoItems = isToDoItemsExpanded ? sortedToDoItems : sortedToDoItems.slice(0, 3)
  const hasMoreToDoItems = pendingToDoItems.length > 3
  
  const calculateNoiseCounts = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const todayCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= today
    }).length
    
    const last7DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= sevenDaysAgo
    }).length
    
    const last30DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= thirtyDaysAgo
    }).length
    
    return { todayCount, last7DaysCount, last30DaysCount }
  }
  
  const { todayCount, last7DaysCount, last30DaysCount } = calculateNoiseCounts()
  const totalNoiseItems = noiseTrackingItems.length
  
  return (
    <>
      <Container>
        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <div className="header-content">
                <ShoppingCartIcon />
                Grocery List
              </div>
              <span className="item-count">{groceryStats.totalItems}</span>
            </SectionHeader>
            {isGroceryLoading ? (
              <HomeGroceryItemPlaceholder />
            ) : (
              <GroceryStats>
                {groceryStats.totalItems > 0 ? (
                  <GroceryImagesGrid itemCount={groceryStats.displayItems.length}>
                    {groceryStats.displayItems.map((item) => (
                      <GroceryImageItem
                        key={item.id}
                        style={{
                          backgroundImage: item.imagePath ? `url(${item.imagePath})` : 'none'
                        }}
                        title={`${item.name} (${item.quantity} ${item.unit})`}
                        onClick={(event) => handleGroceryItemClick(item, event)}
                      >
                        {!item.imagePath && item.name.charAt(0).toUpperCase()}
                      </GroceryImageItem>
                    ))}
                    {groceryStats.hasOverflow && (
                      <GroceryImageOverflow title={`+${groceryStats.unpurchasedItems.length - 9} more items`}>
                        +{groceryStats.unpurchasedItems.length - 9}
                      </GroceryImageOverflow>
                    )}
                  </GroceryImagesGrid>
                ) : (
                  <EmptyState>No grocery items found</EmptyState>
                )}
              </GroceryStats>
            )}
          </SectionContent>
        </SectionCard>

        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <div className="header-content">
                <VolumeUpIcon />
                Noise Recordings
              </div>
              <span className="item-count">{totalNoiseItems}</span>
            </SectionHeader>
            {isNoiseLoading ? (
              <NoiseStats>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HomeNoiseItemPlaceholder key={index} />
                ))}
              </NoiseStats>
            ) : (
              <>
                {noiseView === 'overview' ? (
                  // Stats Overview
                  totalNoiseItems > 0 ? (
                    <NoiseStats>
                      <NoiseStatBlock onClick={() => handleNoiseViewChange('today')}>
                        <NoiseStatCount>{todayCount}</NoiseStatCount>
                        <NoiseStatLabel>Today</NoiseStatLabel>
                      </NoiseStatBlock>
                      <NoiseStatBlock onClick={() => handleNoiseViewChange('last7days')}>
                        <NoiseStatCount>{last7DaysCount}</NoiseStatCount>
                        <NoiseStatLabel>Last 7 days</NoiseStatLabel>
                      </NoiseStatBlock>
                      <NoiseStatBlock onClick={() => handleNoiseViewChange('last30days')}>
                        <NoiseStatCount>{last30DaysCount}</NoiseStatCount>
                        <NoiseStatLabel>Last 30 days</NoiseStatLabel>
                      </NoiseStatBlock>
                    </NoiseStats>
                  ) : (
                    <EmptyState>No noise recordings found</EmptyState>
                  )
                ) : (
                  // Detail View
                  <div>
                    <NoiseDetailHeader>
                      <NoiseDetailTitle>{getNoiseViewTitle(noiseView)}</NoiseDetailTitle>
                      <NoiseBackButton onClick={() => handleNoiseViewChange('overview')}>
                        <ArrowBackIcon fontSize="small" />
                        Back
                      </NoiseBackButton>
                    </NoiseDetailHeader>
                    
                    {(() => {
                      const filteredItems = getFilteredNoiseItems()
                      const sortedItems = filteredItems.sort((a, b) => b.timestamp - a.timestamp)
                      
                      return sortedItems.length > 0 ? (
                        <NoiseDetailList>
                          {sortedItems.map((item, index) => {
                            const { date, time } = formatNoiseTimestamp(item.timestamp)
                            return (
                              <NoiseDetailItem key={`${item.timestamp}-${index}`}>
                                <NoiseDetailDate>{date}</NoiseDetailDate>
                                <NoiseDetailTime>{time}</NoiseDetailTime>
                              </NoiseDetailItem>
                            )
                          })}
                        </NoiseDetailList>
                      ) : (
                        <NoiseDetailEmpty>
                          No recordings found for {getNoiseViewTitle(noiseView).toLowerCase()}
                        </NoiseDetailEmpty>
                      )
                    })()}
                  </div>
                )}
              </>
            )}
          </SectionContent>
        </SectionCard>

        <FullWidthSection>
          <SectionCard>
            <SectionContent>
              <SectionHeader>
                <div className="header-content">
                  <ChecklistIcon />
                  To-Do Items
                </div>
                <span className="item-count">{pendingToDoItems.length}</span>
              </SectionHeader>
              {isToDoLoading ? (
              <CompactItemList>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HomeToDoItemPlaceholder key={index} />
                ))}
              </CompactItemList>
            ) : (
              <CompactItemList>
                {displayedToDoItems.length > 0 ? (
                  displayedToDoItems.map((item) => {
                    const dueDateText = formatDueDateRelative(item.dueDate)
                    const dueDateClass = getDueDateClass(item.dueDate)
                    
                    return (
                      <CompactItemText key={item.id}>
                        <CompactItemContent>
                          {item.name}
                          {item.description && (
                            <CompactDescription>
                              {item.description}
                            </CompactDescription>
                          )}
                        </CompactItemContent>
                        {dueDateText && (
                          <CompactItemMeta>
                            <DueDateText className={dueDateClass}>
                              {dueDateText}
                            </DueDateText>
                          </CompactItemMeta>
                        )}
                      </CompactItemText>
                    )
                  })
                ) : (
                  <EmptyState>No pending to-do items found</EmptyState>
                )}
                {hasMoreToDoItems && (
                  <MoreItemsIndicator onClick={handleToggleToDoItems}>
                    {isToDoItemsExpanded 
                      ? 'Show less'
                      : `+${pendingToDoItems.length - 3} more items`
                    }
                  </MoreItemsIndicator>
                )}
              </CompactItemList>
              )}
            </SectionContent>
          </SectionCard>
        </FullWidthSection>
      </Container>
      
      <GroceryItemPreviewPopup
        open={isPopupOpen}
        onClose={handlePopupClose}
        item={selectedGroceryItem}
        anchorPosition={anchorPosition}
      />
    </>
  )
}

const HomeContent = () => {
  const { currentProject } = useProjectContext()
  
  return (
    <StandardLayout>
      <AppInfoCard />
      <DashboardHeader />
      <GroceryListProvider key={`grocery-${currentProject?.id || 'no-project'}`}>
        <ToDoListProvider key={`todo-${currentProject?.id || 'no-project'}`}>
          <NoiseTrackingProvider key={`noise-${currentProject?.id || 'no-project'}`}>
            <HomeDataContent />
          </NoiseTrackingProvider>
        </ToDoListProvider>
      </GroceryListProvider>
    </StandardLayout>
  )
}

export const HomeRoute = () => {
  return <HomeContent />
}

export default HomeRoute 