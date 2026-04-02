import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useGroceryListContext, GroceryListProvider } from '../../providers/GroceryListProvider'
import { usePlannerContext, PlannerProvider } from '../../providers/PlannerProvider'
import { useNoiseTrackingContext, NoiseTrackingProvider } from '../../providers/NoiseTrackingProvider'
import { useBirthdayContext, BirthdayProvider } from '../../providers/BirthdayProvider'
import { useMealPlanContext, MealPlanProvider } from '../../providers/MealPlanProvider'
import { useAdventureContext, AdventureProvider } from '../../providers/AdventureProvider'
import { useRecipeContext, RecipeProvider } from '../../providers/RecipeProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { IRecipe } from '../../types/recipe'
import { IAdventure } from '../../types/adventure'
import { updateToDoItems } from '../../api/toDoList'
import { showAlert } from '../../utils/alert'
import { Route } from '../../enums/route'
import StandardLayout from '../../layout/standardLayout'
import HomeHeader from '../../components/HomeHeader'
import GroceryItemPreviewPopup from '../../components/GroceryItemPreviewPopup'
import ToDoItemPreviewDrawer from '../../components/ToDoItemPreviewDrawer'
import RecipeViewDrawer from '../../components/RecipeViewDrawer'
import AdventurePreviewDrawer from '../../components/AdventurePreviewDrawer'
import GrocerySection from './components/GrocerySection'
import NoiseSection from './components/NoiseSection'
import PlannerSection from './components/PlannerSection'
import UpcomingBirthdaysCard from './components/PlannerSection/components/UpcomingBirthdaysCard'
import {
  MiniCardContent,
  MiniCardHeader,
  MiniCardTitle,
  MiniCardBody,
  BirthdayCard,
  BirthdayCardIcon,
} from './components/PlannerSection/index.styled'
import { useHomeData } from '../../hooks/useHomeData'
import { useHomeInteractions } from '../../hooks/useHomeInteractions'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'

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
  const { groceryList, isLoading: isGroceryLoading, isError: isGroceryError } = useGroceryListContext()
  const { toDoList, isLoading: isToDoLoading, isError: isToDoError, removeFromToDoList, updateToDoItemFields } = usePlannerContext()
  const { noiseTrackingItems, isLoading: isNoiseLoading, isError: isNoiseError } = useNoiseTrackingContext()
  const { birthdays, isError: isBirthdayError } = useBirthdayContext()
  const { mealPlans, isLoading: isMealLoading } = useMealPlanContext()
  const { adventures, isLoading: isAdventureLoading, removeAdventure } = useAdventureContext()
  const { recipes } = useRecipeContext()
  const { state: { purchasedItems }, dispatch } = useAppState()
  const { currentProject } = useProjectContext()
  const { currentShop, shops } = useShopContext()
  const navigate = useNavigate()
  const { defaults } = useItemDefaults({ fetchMethod: retrieveGroceryListDefaults })

  const interactions = useHomeInteractions()
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null)
  const [selectedAdventure, setSelectedAdventure] = useState<IAdventure | null>(null)
  const [isBirthdaysExpanded, setIsBirthdaysExpanded] = useState(false)

  const homeData = useHomeData({
    groceryList,
    toDoList,
    noiseTrackingItems,
    purchasedItems,
    isToDoItemsExpanded: interactions.isToDoItemsExpanded
  })

  const upcomingDates = new Set(getUpcomingDateStrings())

  const today = toDateString(new Date())
  const upcomingAdventures = adventures
    .filter(a => (a.endDate ?? a.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''))
    .slice(0, 5)

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

  const handleAdventureClick = useCallback((adventure: IAdventure) => {
    setSelectedAdventure(adventure)
  }, [])

  const handleAdventureDelete = useCallback(async (id: string) => {
    await removeAdventure(id)
    setSelectedAdventure(null)
  }, [removeAdventure])

  const handleMealClick = useCallback((meal: { recipeId?: string }) => {
    if (!meal.recipeId) return
    const recipe = recipes.find(r => r.id === meal.recipeId)
    if (recipe) setSelectedRecipe(recipe)
  }, [recipes])

  const handleEditTask = useCallback((id: string) => {
    navigate(Route.EditPlannerItem.replace(':id', id))
  }, [navigate])

  const handleGroceryNavigate = useCallback(() => {
    if (currentShop) {
      navigate(Route.GroceryList.replace(':shopId', currentShop.id))
    } else {
      navigate(Route.Shops)
    }
  }, [currentShop, navigate])

  const handleNoiseNavigate = useCallback(() => {
    navigate(Route.NoiseTracking)
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
          todayMeals={todayMeals}
          upcomingAdventures={upcomingAdventures}
          isLoading={isToDoLoading || isMealLoading || isAdventureLoading}
          isError={isToDoError}
          onStepToggle={handleStepToggle}
          onCardClick={interactions.handleToDoItemSelect}
          onMarkDone={handleMarkDone}
          onMealClick={handleMealClick}
          onAdventureClick={handleAdventureClick}
        />

        <GrocerySection
          groceryStats={homeData.groceryStats}
          shops={shops}
          isLoading={isGroceryLoading}
          isError={isGroceryError}
          onGroceryItemClick={interactions.handleGroceryItemClick}
          onNavigate={handleGroceryNavigate}
        />

        <BirthdayCard
          onClick={() => setIsBirthdaysExpanded(v => !v)}
        >
          <MiniCardContent>
            <MiniCardHeader>
              <BirthdayCardIcon><CakeIcon /></BirthdayCardIcon>
              <MiniCardTitle>Birthdays</MiniCardTitle>
              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 150ms ease',
                  transform: isBirthdaysExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: 0.6,
                }}
              >
                <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />
              </Box>
            </MiniCardHeader>
            <MiniCardBody>
              <UpcomingBirthdaysCard birthdays={birthdays} isExpanded={isBirthdaysExpanded} isError={isBirthdayError} />
            </MiniCardBody>
          </MiniCardContent>
        </BirthdayCard>

        <NoiseSection
          noiseTrackingItems={noiseTrackingItems}
          noiseCounts={homeData.noiseCounts}
          isLoading={isNoiseLoading}
          isError={isNoiseError}
          noiseView={interactions.noiseView}
          onNoiseViewChange={interactions.handleNoiseViewChange}
          onNavigate={handleNoiseNavigate}
        />

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

      <RecipeViewDrawer
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={() => {}}
        defaults={defaults}
      />

      <AdventurePreviewDrawer
        item={selectedAdventure}
        onClose={() => setSelectedAdventure(null)}
        onEdit={(adventure) => navigate(Route.EditAdventure.replace(':id', adventure.id))}
        onDelete={handleAdventureDelete}
      />
    </>
  )
}

const HomeContent = () => {
  const { currentProject } = useProjectContext()

  return (
    <StandardLayout>
      <HomeHeader />
      <GroceryListProvider key={`grocery-${currentProject?.id || 'no-project'}`}>
        <PlannerProvider key={`planner-${currentProject?.id || 'no-project'}`}>
          <NoiseTrackingProvider key={`noise-${currentProject?.id || 'no-project'}`}>
            <BirthdayProvider key={`birthday-${currentProject?.id || 'no-project'}`}>
              <MealPlanProvider key={`meal-${currentProject?.id || 'no-project'}`}>
                <AdventureProvider key={`adventure-${currentProject?.id || 'no-project'}`}>
                  <RecipeProvider>
                    <HomeDataContent />
                  </RecipeProvider>
                </AdventureProvider>
              </MealPlanProvider>
            </BirthdayProvider>
          </NoiseTrackingProvider>
        </PlannerProvider>
      </GroceryListProvider>
    </StandardLayout>
  )
}

export const HomeRoute = () => {
  return <HomeContent />
}

export default HomeRoute
