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
  GroceryImageOverflow
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
  
  const lastFourToDoItems = toDoList.filter(item => !item.isDone).slice(-4).reverse()
  
  const sortedNoiseItems = noiseTrackingItems.sort((a, b) => a.timestamp - b.timestamp)
  const lastFiveNoiseItems = sortedNoiseItems.slice(-5).reverse()
  
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
                Recent Noise Recordings
              </div>
              <span className="item-count">{lastFiveNoiseItems.length}</span>
            </SectionHeader>
            {isNoiseLoading ? (
              <ItemList>
                {Array.from({ length: 5 }).map((_, index) => (
                  <HomeNoiseItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {lastFiveNoiseItems.length > 0 ? (
                  lastFiveNoiseItems.map((item) => {
                    const currentIndex = sortedNoiseItems.findIndex(sortedItem => sortedItem.timestamp === item.timestamp)
                    const previousItem = currentIndex > 0 ? sortedNoiseItems[currentIndex - 1] : undefined
                    const timeElapsed = formatTimeElapsed(item.timestamp, previousItem?.timestamp)
                    const timeFormatted = formatTimestamp(item.timestamp)
                    
                    return (
                      <HomeNoiseItem 
                        key={item.timestamp} 
                        item={item} 
                        timeFormatted={timeFormatted} 
                        timeElapsed={timeElapsed} 
                      />
                    )
                  })
                ) : (
                  <EmptyState>No noise recordings found</EmptyState>
                )}
              </ItemList>
            )}
          </SectionContent>
        </SectionCard>

        <FullWidthSection>
          <SectionCard>
            <SectionContent>
              <SectionHeader>
                <div className="header-content">
                  <ChecklistIcon />
                  Recent To-Do Items
                </div>
                <span className="item-count">{lastFourToDoItems.length}</span>
              </SectionHeader>
              {isToDoLoading ? (
              <ItemList>
                {Array.from({ length: 4 }).map((_, index) => (
                  <HomeToDoItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {lastFourToDoItems.length > 0 ? (
                  lastFourToDoItems.map((item) => (
                    <HomeToDoItem key={item.id} item={item} />
                  ))
                ) : (
                  <EmptyState>No pending to-do items found</EmptyState>
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