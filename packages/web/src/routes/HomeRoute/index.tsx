import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import StandardLayout from '../../layout/standardLayout'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useTheme } from '@mui/material/styles'
import { formatTimeElapsed, formatTimestamp } from './utils'
import {
  Container,
  SectionCard,
  SectionHeader,
  SectionContent,
  ItemList,
  ItemText,
  EmptyState,
  NoiseItem,
  TimeElapsed
} from './index.styled'

const HomeContent = () => {
  const theme = useTheme()
  const { groceryList } = useGroceryListContext()
  const { toDoList } = useToDoListContext()
  const { noiseTrackingItems } = useNoiseTrackingContext()
  
  const lastThreeGroceryItems = groceryList.slice(-3).reverse()
  const lastThreeToDoItems = toDoList.filter(item => !item.isDone).slice(-3).reverse()
  
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
            {lastThreeGroceryItems.length > 0 ? (
              <ItemList>
                {lastThreeGroceryItems.map((item) => (
                  <ItemText key={item.id}>{item.name}</ItemText>
                ))}
              </ItemList>
            ) : (
              <EmptyState>No grocery items found</EmptyState>
            )}
          </SectionContent>
        </SectionCard>

        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <ChecklistIcon />
              Recent To-Do Items
            </SectionHeader>
            {lastThreeToDoItems.length > 0 ? (
              <ItemList>
                {lastThreeToDoItems.map((item) => (
                  <ItemText key={item.id}>
                    {item.name}
                    {item.description && (
                      <div style={{ fontSize: '0.85rem', color: theme.palette.text.secondary, marginTop: '0.25rem' }}>
                        {item.description}
                      </div>
                    )}
                  </ItemText>
                ))}
              </ItemList>
            ) : (
              <EmptyState>No pending to-do items found</EmptyState>
            )}
          </SectionContent>
        </SectionCard>

        <SectionCard>
          <SectionContent>
            <SectionHeader>
              <VolumeUpIcon />
              Recent Noise Recordings
            </SectionHeader>
            {lastThreeNoiseItems.length > 0 ? (
              <ItemList>
                {lastThreeNoiseItems.map((item) => {
                  const currentIndex = sortedNoiseItems.findIndex(sortedItem => sortedItem.timestamp === item.timestamp)
                  const previousItem = currentIndex > 0 ? sortedNoiseItems[currentIndex - 1] : undefined
                  const timeElapsed = formatTimeElapsed(item.timestamp, previousItem?.timestamp)
                  const timeFormatted = formatTimestamp(item.timestamp)
                  
                  return (
                    <NoiseItem key={item.timestamp}>
                      <span>{timeFormatted}</span>
                      <TimeElapsed>{timeElapsed}</TimeElapsed>
                    </NoiseItem>
                  )
                })}
              </ItemList>
            ) : (
              <EmptyState>No noise recordings found</EmptyState>
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