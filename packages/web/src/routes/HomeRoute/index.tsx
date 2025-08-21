import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useAuth } from 'react-oidc-context'
import StandardLayout from '../../layout/standardLayout'
import DashboardHeader from '../../components/DashboardHeader'
import HomeGroceryItemPlaceholder from './components/HomeGroceryItemPlaceholder'
import HomeToDoItemPlaceholder from './components/HomeToDoItemPlaceholder'
import HomeNoiseItemPlaceholder from './components/HomeNoiseItemPlaceholder'
import HomeGroceryItem from './components/HomeGroceryItem'
import HomeToDoItem from './components/HomeToDoItem'
import HomeNoiseItem from './components/HomeNoiseItem'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import PersonIcon from '@mui/icons-material/Person'

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
  CompactItemList,
  CompactItemText,
  CompactItemContent,
  CompactItemMeta,
  CompactDescription,
  DueDateText,
  UserProfileCard,
  UserProfileContent,
  UserName,
  UserEmail,
  WelcomeText
} from './index.styled'

const HomeContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading } = useToDoListContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { state: { purchasedItems } } = useAppState()
  const auth = useAuth()
  
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
  
  const topThreeToDoItems = sortedToDoItems.slice(0, 3)
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
    <StandardLayout>
      <DashboardHeader />
      <Container>
        {auth.user && (
          <UserProfileCard>
            <UserProfileContent>
              <div className="user-info">
                <PersonIcon />
                <div className="user-details">
                  <WelcomeText>Welcome back!</WelcomeText>
                  <UserName>{auth.user.given_name || auth.user.family_name || auth.user.name || auth.user.preferred_username || 'User'}</UserName>
                  <UserEmail>{auth.user.email}</UserEmail>
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem' }}>
                      Debug: {JSON.stringify(auth.user, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            </UserProfileContent>
          </UserProfileCard>
        )}
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
                  <GroceryImagesGrid>
                    {groceryStats.displayItems.map((item) => (
                      <GroceryImageItem
                        key={item.id}
                        style={{
                          backgroundImage: item.imagePath ? `url(${item.imagePath})` : 'none'
                        }}
                        title={`${item.name} (${item.quantity} ${item.unit})`}
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
              <NoiseStats>
                {totalNoiseItems > 0 ? (
                  <>
                    <NoiseStatBlock>
                      <NoiseStatCount>{todayCount}</NoiseStatCount>
                      <NoiseStatLabel>Today</NoiseStatLabel>
                    </NoiseStatBlock>
                    <NoiseStatBlock>
                      <NoiseStatCount>{last7DaysCount}</NoiseStatCount>
                      <NoiseStatLabel>Last 7 days</NoiseStatLabel>
                    </NoiseStatBlock>
                    <NoiseStatBlock>
                      <NoiseStatCount>{last30DaysCount}</NoiseStatCount>
                      <NoiseStatLabel>Last 30 days</NoiseStatLabel>
                    </NoiseStatBlock>
                  </>
                ) : (
                  <EmptyState>No noise recordings found</EmptyState>
                )}
              </NoiseStats>
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
                {topThreeToDoItems.length > 0 ? (
                  topThreeToDoItems.map((item) => {
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
                  <MoreItemsIndicator>
                    +{pendingToDoItems.length - 3} more items
                  </MoreItemsIndicator>
                )}
              </CompactItemList>
              )}
            </SectionContent>
          </SectionCard>
        </FullWidthSection>
      </Container>
    </StandardLayout>
  )
}

export const HomeRoute = () => {
  return (
    <GroceryListProvider>
      <ToDoListProvider>
        <NoiseTrackingProvider>
          <HomeContent />
        </NoiseTrackingProvider>
      </ToDoListProvider>
    </GroceryListProvider>
  )
}

export default HomeRoute 