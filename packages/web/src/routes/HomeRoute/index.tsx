import React from 'react'
import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { useToDoListContext, ToDoListProvider } from '../../providers/ToDoListProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import StandardLayout from '../../layout/standardLayout'
import AppInfoCard from '../../components/AppInfoCard'
import DashboardHeader from '../../components/DashboardHeader'
import GroceryItemPreviewPopup from '../../components/GroceryItemPreviewPopup'
import GrocerySection from './components/GrocerySection'
import NoiseSection from './components/NoiseSection'
import ToDoSection from './components/ToDoSection'
import { useHomeData } from '../../hooks/useHomeData'
import { useHomeInteractions } from '../../hooks/useHomeInteractions'

import { Container } from './index.styled'

const HomeDataContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading } = useToDoListContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { state: { purchasedItems } } = useAppState()

  const interactions = useHomeInteractions()
  
  const homeData = useHomeData({
    groceryList,
    toDoList,
    noiseTrackingItems,
    purchasedItems,
    isToDoItemsExpanded: interactions.isToDoItemsExpanded
  })
  
  return (
    <>
      <Container>
        <GrocerySection
          groceryStats={homeData.groceryStats}
          isLoading={isGroceryLoading}
          onGroceryItemClick={interactions.handleGroceryItemClick}
        />

        <NoiseSection
          noiseTrackingItems={noiseTrackingItems}
          noiseCounts={homeData.noiseCounts}
          isLoading={isNoiseLoading}
          noiseView={interactions.noiseView}
          onNoiseViewChange={interactions.handleNoiseViewChange}
        />

        <ToDoSection
          toDoStats={homeData.toDoStats}
          isLoading={isToDoLoading}
          isExpanded={interactions.isToDoItemsExpanded}
          expandedItems={interactions.expandedToDoItems}
          onToggleExpansion={interactions.handleToggleToDoItems}
          onItemToggle={interactions.handleToDoItemToggle}
        />
      </Container>
      
      <GroceryItemPreviewPopup
        open={interactions.isPopupOpen}
        onClose={interactions.handlePopupClose}
        item={interactions.selectedGroceryItem}
        anchorPosition={interactions.anchorPosition}
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