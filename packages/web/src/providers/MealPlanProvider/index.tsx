import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IMealPlan } from '../../types/mealPlan'
import { MealType } from '../../enums/mealType'
import { getMealPlans, addMealPlan as addMealPlanApi, updateMealPlan as updateMealPlanApi, deleteMealPlan } from '../../api/mealPlans'
import { IState, IMealPlanProviderProps } from './types'
import { useProjectContext } from '../ProjectProvider'

const initialState: IState = {
  mealPlans: [],
  isLoading: false,
  fetchMealPlans: async () => {},
  addMealPlan: async () => {},
  updateMealPlan: async () => {},
  removeMealPlan: async () => {},
}

export const MealPlanContext = createContext<IState>(initialState)

export const useMealPlanContext = () => useContext(MealPlanContext)

export const MealPlanProvider = ({ children }: IMealPlanProviderProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['mealPlans', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => getMealPlans(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch meal plans:', query.error)
    }
  }, [query.error])

  const mealPlans = query.data ?? []

  const fetchMealPlans = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addMealPlan = useCallback(async (date: string, recipeName: string, recipeId?: string, mealType?: MealType, imagePath?: string, isPrivate?: boolean) => {
    if (!currentProject) return

    const result = await addMealPlanApi({ date, recipeName, recipeId, mealType, imagePath }, currentProject.id, isPrivate)
    const newMealPlan: IMealPlan = {
      ...result,
      date,
      recipeName,
      recipeId,
      mealType,
      imagePath,
      projectId: currentProject.id,
      ...(isPrivate && { visibility: "private" as const }),
    }
    queryClient.setQueryData<IMealPlan[]>(queryKey, (prev = []) => [...prev, newMealPlan])
  }, [currentProject, queryClient])

  const updateMealPlan = useCallback(async (id: string, fields: { date?: string; recipeName?: string; recipeId?: string | null; mealType?: MealType | null; imagePath?: string | null }) => {
    if (!currentProject) return

    await updateMealPlanApi(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    ) as Partial<IMealPlan>
    queryClient.setQueryData<IMealPlan[]>(queryKey, (prev = []) =>
      prev.map((plan) => plan.id === id ? { ...plan, ...definedFields } : plan)
    )
  }, [currentProject, queryClient])

  const removeMealPlan = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteMealPlan(id, currentProject.id)
    queryClient.setQueryData<IMealPlan[]>(queryKey, (prev = []) =>
      prev.filter((plan) => plan.id !== id)
    )
  }, [currentProject, queryClient])

  const value = useMemo(
    () => ({
      mealPlans,
      isLoading: query.isLoading,
      fetchMealPlans,
      addMealPlan,
      updateMealPlan,
      removeMealPlan,
    }),
    [mealPlans, query.isLoading, fetchMealPlans, addMealPlan, updateMealPlan, removeMealPlan]
  )

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  )
}
