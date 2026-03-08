import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { usePlannerContext, PlannerProvider } from '../../providers/PlannerProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { AgentChatProvider } from '../../providers/AgentChatProvider'
import { updateToDoItems } from '../../api/toDoList'
import { showAlert } from '../../utils/alert'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import AppInfoCard from '../../components/AppInfoCard'
import DashboardHeader from '../../components/DashboardHeader'
import AgentChatDrawer from '../../components/AgentChatDrawer'
import AgentMessageButton from '../../components/AgentMessageButton'
import GroceryItemPreviewPopup from '../../components/GroceryItemPreviewPopup'
import ToDoItemPreviewDrawer from '../../components/ToDoItemPreviewDrawer'
import GrocerySection from './components/GrocerySection'
import NoiseSection from './components/NoiseSection'
import PlannerSection from './components/PlannerSection'
import { useHomeData } from '../../hooks/useHomeData'
import { useHomeInteractions } from '../../hooks/useHomeInteractions'

import { Container } from './index.styled'

const HomeDataContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading, removeFromToDoList, updateToDoItemFields } = usePlannerContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { state: { purchasedItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()

  const interactions = useHomeInteractions()

  const homeData = useHomeData({
    groceryList,
    toDoList,
    noiseTrackingItems,
    purchasedItems,
    isToDoItemsExpanded: interactions.isToDoItemsExpanded
  })

  const handleMarkDone = useCallback(async (id: string) => {
    try {
      await updateToDoItems([{ id, isDone: true }], currentProject!.id)
      removeFromToDoList(id)
      interactions.handleToDoItemDeselect()
    } catch (error) {
      console.error('Failed to mark to do item as done:', error)
      showAlert({ description: 'Failed to mark task as done', severity: 'error' }, dispatch)
    }
  }, [currentProject, removeFromToDoList, interactions.handleToDoItemDeselect, dispatch])

  const handleEditTask = useCallback((id: string) => {
    navigate(Route.EditPlannerItem.replace(':id', id))
  }, [navigate])

  const handleStepToggle = useCallback(async (todoId: string, stepId: string, isDone: boolean) => {
    const item = toDoList.find(t => t.id === todoId)
    if (!item?.steps) return
    const updatedSteps = item.steps.map(s => s.id === stepId ? { ...s, isDone } : s)
    interactions.handleToDoItemSelect({ ...item, steps: updatedSteps })
    try {
      await updateToDoItemFields(todoId, { steps: updatedSteps })
    } catch (error) {
      console.error('Failed to update step:', error)
      showAlert({ description: 'Failed to update step', severity: 'error' }, dispatch)
    }
  }, [toDoList, updateToDoItemFields, interactions.handleToDoItemSelect, dispatch])

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

        <PlannerSection
          toDoStats={homeData.toDoStats}
          isLoading={isToDoLoading}
          isExpanded={interactions.isToDoItemsExpanded}
          onToggleExpansion={interactions.handleToggleToDoItems}
          onItemToggle={interactions.handleToDoItemToggle}
          expandedItems={interactions.expandedToDoItems}
        />

        <AgentMessageButton />
      </Container>

      <GroceryItemPreviewPopup
        open={interactions.isPopupOpen}
        onClose={interactions.handlePopupClose}
        item={interactions.selectedGroceryItem}
        anchorPosition={interactions.anchorPosition}
      />

      <ToDoItemPreviewDrawer
        item={interactions.selectedToDoItem}
        onClose={interactions.handleToDoItemDeselect}
        onEdit={handleEditTask}
        onMarkDone={handleMarkDone}
        onStepToggle={handleStepToggle}
      />
    </>
  )
}

const HomeContent = () => {
  const { currentProject } = useProjectContext()

  return (
    <AgentChatProvider>
      <StandardLayout>
        <AppInfoCard />
        <DashboardHeader />
        <GroceryListProvider key={`grocery-${currentProject?.id || 'no-project'}`}>
          <PlannerProvider key={`planner-${currentProject?.id || 'no-project'}`}>
            <NoiseTrackingProvider key={`noise-${currentProject?.id || 'no-project'}`}>
              <HomeDataContent />
            </NoiseTrackingProvider>
          </PlannerProvider>
        </GroceryListProvider>
      </StandardLayout>
      <AgentChatDrawer />
    </AgentChatProvider>
  )
}

export const HomeRoute = () => {
  return <HomeContent />
}

export default HomeRoute
