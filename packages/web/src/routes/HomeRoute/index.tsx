import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { usePlannerContext, PlannerProvider } from '../../providers/PlannerProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useBirthdayContext, BirthdayProvider } from '../../providers/BirthdayProvider'
import { useMealPlanContext, MealPlanProvider } from '../../providers/MealPlanProvider'
import { useRecipeContext, RecipeProvider } from '../../providers/RecipeProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { AgentChatProvider } from '../../providers/AgentChatProvider'
import { IRecipe } from '../../types/recipe'
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
import RecipeDetailDrawer from '../../components/RecipeDetailDrawer'
import GrocerySection from './components/GrocerySection'
import NoiseSection from './components/NoiseSection'
import PlannerSection from './components/PlannerSection'
import { useHomeData } from '../../hooks/useHomeData'
import { useHomeInteractions } from '../../hooks/useHomeInteractions'

import { Container } from './index.styled'

const toDateString = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getUpcomingDateStrings = (days = 7): string[] => {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() + i)
    return toDateString(d)
  })
}

const HomeDataContent = () => {
  const { groceryList, isLoading: isGroceryLoading } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading, removeFromToDoList, updateToDoItemFields } = usePlannerContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading } = useNoiseTrackingContext()
  const { birthdays } = useBirthdayContext()
  const { mealPlans } = useMealPlanContext()
  const { recipes } = useRecipeContext()
  const { state: { purchasedItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const navigate = useNavigate()

  const interactions = useHomeInteractions()
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null)

  const homeData = useHomeData({
    groceryList,
    toDoList,
    noiseTrackingItems,
    purchasedItems,
    isToDoItemsExpanded: interactions.isToDoItemsExpanded
  })

  const upcomingDates = new Set(getUpcomingDateStrings())
  const todayMeals = mealPlans
    .filter(plan => upcomingDates.has(plan.date))
    .map(plan => {
      const recipe = plan.recipeId ? recipes.find(r => r.id === plan.recipeId) : undefined
      return { ...plan, imagePath: recipe?.imagePath }
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

  const handleMealClick = useCallback((meal: { recipeId?: string }) => {
    if (!meal.recipeId) return
    const recipe = recipes.find(r => r.id === meal.recipeId)
    if (recipe) setSelectedRecipe(recipe)
  }, [recipes])

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
        <PlannerSection
          toDoStats={homeData.toDoStats}
          birthdays={birthdays}
          todayMeals={todayMeals}
          isLoading={isToDoLoading}
          isExpanded={interactions.isToDoItemsExpanded}
          onToggleExpansion={interactions.handleToggleToDoItems}
          onItemToggle={interactions.handleToDoItemToggle}
          expandedItems={interactions.expandedToDoItems}
          onMealClick={handleMealClick}
        />

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

      <RecipeDetailDrawer
        open={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
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
              <BirthdayProvider key={`birthday-${currentProject?.id || 'no-project'}`}>
                <MealPlanProvider key={`meal-${currentProject?.id || 'no-project'}`}>
                  <RecipeProvider>
                    <HomeDataContent />
                  </RecipeProvider>
                </MealPlanProvider>
              </BirthdayProvider>
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
