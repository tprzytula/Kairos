import { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { IMealPlan } from '../../types/mealPlan'
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
  const [mealPlans, setMealPlans] = useState<IMealPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMealPlans = useCallback(async () => {
    if (!currentProject) return

    try {
      setIsLoading(true)
      const items = await getMealPlans(currentProject.id)
      setMealPlans(items)
    } catch (error) {
      console.error('Failed to fetch meal plans:', error)
      setMealPlans([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject])

  const addMealPlan = useCallback(async (date: string, recipeName: string, recipeId?: string) => {
    if (!currentProject) return

    const result = await addMealPlanApi({ date, recipeName, recipeId }, currentProject.id)
    const newMealPlan: IMealPlan = {
      ...result,
      date,
      recipeName,
      recipeId,
      projectId: currentProject.id,
    }
    setMealPlans((prev) => [...prev, newMealPlan])
  }, [currentProject])

  const updateMealPlan = useCallback(async (id: string, fields: { date?: string; recipeName?: string; recipeId?: string | null }) => {
    if (!currentProject) return

    await updateMealPlanApi(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    ) as Partial<IMealPlan>
    setMealPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, ...definedFields } : plan
      )
    )
  }, [currentProject])

  const removeMealPlan = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteMealPlan(id, currentProject.id)
    setMealPlans((prev) => prev.filter((plan) => plan.id !== id))
  }, [currentProject])

  useLayoutEffect(() => {
    if (currentProject) {
      fetchMealPlans()
    } else {
      setMealPlans([])
    }
  }, [currentProject, fetchMealPlans])

  const value = useMemo(
    () => ({
      mealPlans,
      isLoading,
      fetchMealPlans,
      addMealPlan,
      updateMealPlan,
      removeMealPlan,
    }),
    [mealPlans, isLoading, fetchMealPlans, addMealPlan, updateMealPlan, removeMealPlan]
  )

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  )
}
