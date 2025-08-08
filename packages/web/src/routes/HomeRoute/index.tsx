import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
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
  SectionCard,
  SectionHeader,
  SectionContent,
  ItemList,
  EmptyState
} from './index.styled'

const HomeContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading } = useToDoListContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  
  const lastThreeGroceryItems = groceryList.slice(-3).reverse()
  const lastTwoToDoItems = toDoList.filter(item => !item.isDone).slice(-2).reverse()
  
  const sortedNoiseItems = noiseTrackingItems.sort((a, b) => a.timestamp - b.timestamp)
  const lastThreeNoiseItems = sortedNoiseItems.slice(-3).reverse()
  
  return (
    <StandardLayout title="Home">
      <Container>
        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <ShoppingCartIcon />
              Recent Grocery Items
            </SectionHeader>
            {isGroceryLoading ? (
              <ItemList>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HomeGroceryItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {Array.from({ length: 3 }).map((_, index) => {
                  const item = lastThreeGroceryItems[index]
                  return item ? (
                    <HomeGroceryItem key={item.id} item={item} />
                  ) : (
                    <div key={`empty-${index}`} style={{ height: '3.2rem' }} />
                  )
                })}
                {lastThreeGroceryItems.length === 0 && (
                  <EmptyState>No grocery items found</EmptyState>
                )}
              </ItemList>
            )}
          </SectionContent>
        </SectionCard>

        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <VolumeUpIcon />
              Recent Noise Recordings
            </SectionHeader>
            {isNoiseLoading ? (
              <ItemList>
                {Array.from({ length: 3 }).map((_, index) => (
                  <HomeNoiseItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {Array.from({ length: 3 }).map((_, index) => {
                  const item = lastThreeNoiseItems[index]
                  if (item) {
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
                  } else {
                    return <div key={`empty-${index}`} style={{ height: '3.2rem' }} />
                  }
                })}
                {lastThreeNoiseItems.length === 0 && (
                  <EmptyState>No noise recordings found</EmptyState>
                )}
              </ItemList>
            )}
          </SectionContent>
        </SectionCard>

        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <ChecklistIcon />
              Recent To-Do Items
            </SectionHeader>
            {isToDoLoading ? (
              <ItemList>
                {Array.from({ length: 2 }).map((_, index) => (
                  <HomeToDoItemPlaceholder key={index} />
                ))}
              </ItemList>
            ) : (
              <ItemList>
                {Array.from({ length: 2 }).map((_, index) => {
                  const item = lastTwoToDoItems[index]
                  return item ? (
                    <HomeToDoItem key={item.id} item={item} />
                  ) : (
                    <div key={`empty-${index}`} style={{ height: '3.2rem' }} />
                  )
                })}
                {lastTwoToDoItems.length === 0 && (
                  <EmptyState>No pending to-do items found</EmptyState>
                )}
              </ItemList>
            )}
          </SectionContent>
        </SectionCard>
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