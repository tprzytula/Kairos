import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useAppState } from '../../providers/AppStateProvider'
import StandardLayout from '../../layout/standardLayout'
import HomeGroceryItemPlaceholder from './components/HomeGroceryItemPlaceholder'
import HomeToDoItemPlaceholder from './components/HomeToDoItemPlaceholder'
import HomeNoiseItemPlaceholder from './components/HomeNoiseItemPlaceholder'
import HomeGroceryItem from './components/HomeGroceryItem'
import HomeToDoItem from './components/HomeToDoItem'
import HomeNoiseItem from './components/HomeNoiseItem'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

import { formatTimeElapsed, formatTimestamp } from './utils'
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
  NoiseStatItem,
  NoiseStatLabel,
  NoiseStatCount
} from './index.styled'

const HomeContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading } = useToDoListContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { state: { purchasedItems } } = useAppState()
  
  const groceryStats = {
    totalItems: groceryList.length,
    unpurchasedItems: groceryList.filter(item => !purchasedItems.has(item.id)),
    displayItems: groceryList.filter(item => !purchasedItems.has(item.id)).slice(0, 9),
    hasOverflow: groceryList.filter(item => !purchasedItems.has(item.id)).length >= 11
  }
  
  const pendingToDoItems = toDoList.filter(item => !item.isDone)
  const lastThreeToDoItems = pendingToDoItems.slice(-3).reverse()
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
    <StandardLayout title="Home">
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
                    <NoiseStatItem>
                      <NoiseStatLabel>Today</NoiseStatLabel>
                      <NoiseStatCount>{todayCount}</NoiseStatCount>
                    </NoiseStatItem>
                    <NoiseStatItem>
                      <NoiseStatLabel>Last 7 days</NoiseStatLabel>
                      <NoiseStatCount>{last7DaysCount}</NoiseStatCount>
                    </NoiseStatItem>
                    <NoiseStatItem>
                      <NoiseStatLabel>Last 30 days</NoiseStatLabel>
                      <NoiseStatCount>{last30DaysCount}</NoiseStatCount>
                    </NoiseStatItem>
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
              <ItemList>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HomeToDoItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {lastThreeToDoItems.length > 0 ? (
                  lastThreeToDoItems.map((item) => (
                    <HomeToDoItem key={item.id} item={item} />
                  ))
                ) : (
                  <EmptyState>No pending to-do items found</EmptyState>
                )}
                {hasMoreToDoItems && (
                  <MoreItemsIndicator>
                    +{pendingToDoItems.length - 3} more items
                  </MoreItemsIndicator>
                )}
              </ItemList>
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