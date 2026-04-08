import { createContext, useContext, useCallback, useMemo } from 'react'
import { IMealPlan } from '../../types/mealPlan'
import { MealType } from '../../enums/mealType'
import { getMealPlans, addMealPlan as addMealPlanApi, updateMealPlan as updateMealPlanApi, deleteMealPlan } from '../../api/mealPlans'
import { IState, IMealPlanProviderProps } from './types'
import { useEntityCrud } from '../../hooks/useEntityCrud'

const initialState: IState = {
  mealPlans: [],
  isLoading: false,
  isError: false,
  fetchMealPlans: async () => {},
  addMealPlan: async () => {},
  updateMealPlan: async () => {},
  removeMealPlan: async () => {},
}

export const MealPlanContext = createContext<IState>(initialState)

export const useMealPlanContext = () => useContext(MealPlanContext)

export const MealPlanProvider = ({ children }: IMealPlanProviderProps) => {
  const { items: mealPlans, isLoading, isError, currentProject, refetch, addToCache, update, remove } = useEntityCrud<IMealPlan>({
    queryKeyPrefix: 'mealPlans',
    fetchFn: getMealPlans,
    updateFn: (id, fields, projectId) => updateMealPlanApi(id, fields, projectId),
    deleteFn: deleteMealPlan,
  })

  const addMealPlan = useCallback(async (date: string, recipeName: string, recipeId?: string, mealType?: MealType, imagePath?: string, isPrivate?: boolean) => {
    if (!currentProject) return

    const result = await addMealPlanApi({ date, recipeName, recipeId, mealType, imagePath }, currentProject.id, isPrivate)
    addToCache({
      ...result,
      date,
      recipeName,
      recipeId,
      mealType,
      imagePath,
      projectId: currentProject.id,
      ...(isPrivate && { visibility: 'private' as const }),
    })
  }, [currentProject, addToCache])

  const value = useMemo(
    () => ({
      mealPlans,
      isLoading,
      isError,
      fetchMealPlans: refetch,
      addMealPlan,
      updateMealPlan: update,
      removeMealPlan: remove,
    }),
    [mealPlans, isLoading, isError, refetch, addMealPlan, update, remove]
  )

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  )
}
