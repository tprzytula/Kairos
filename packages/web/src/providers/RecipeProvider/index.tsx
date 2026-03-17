import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import { getRecipes, addRecipe as addRecipeApi, updateRecipe as updateRecipeApi, deleteRecipe } from '../../api/recipes'
import { IState, IRecipeProviderProps } from './types'
import { useProjectContext } from '../ProjectProvider'

const initialState: IState = {
  recipes: [],
  isLoading: false,
  fetchRecipes: async () => {},
  addRecipe: async (_name, _ingredients, _imagePath?, _instructions?, _externalLink?) => {},
  updateRecipe: async (_id, _fields) => {},
  removeRecipe: async () => {},
}

export const RecipeContext = createContext<IState>(initialState)

export const useRecipeContext = () => useContext(RecipeContext)

export const RecipeProvider = ({ children }: IRecipeProviderProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['recipes', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => getRecipes(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch recipes:', query.error)
    }
  }, [query.error])

  const recipes = query.data ?? []

  const fetchRecipes = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addRecipe = useCallback(async (name: string, ingredients: IRecipeIngredient[], imagePath?: string, instructions?: string[], externalLink?: string) => {
    if (!currentProject) return

    const result = await addRecipeApi({ name, ingredients, imagePath, instructions, externalLink }, currentProject.id)
    const newRecipe: IRecipe = {
      ...result,
      name,
      ingredients,
      imagePath,
      instructions,
      externalLink,
      projectId: currentProject.id,
    }
    queryClient.setQueryData<IRecipe[]>(queryKey, (prev = []) => [...prev, newRecipe])
  }, [currentProject, queryClient])

  const updateRecipe = useCallback(async (id: string, fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string; externalLink?: string }) => {
    if (!currentProject) return

    await updateRecipeApi(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    ) as Partial<IRecipe>
    queryClient.setQueryData<IRecipe[]>(queryKey, (prev = []) =>
      prev.map((recipe) => recipe.id === id ? { ...recipe, ...definedFields } : recipe)
    )
  }, [currentProject, queryClient])

  const removeRecipe = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteRecipe(id, currentProject.id)
    queryClient.setQueryData<IRecipe[]>(queryKey, (prev = []) =>
      prev.filter((recipe) => recipe.id !== id)
    )
  }, [currentProject, queryClient])

  const value = useMemo(
    () => ({
      recipes,
      isLoading: query.isLoading,
      fetchRecipes,
      addRecipe,
      updateRecipe,
      removeRecipe,
    }),
    [recipes, query.isLoading, fetchRecipes, addRecipe, updateRecipe, removeRecipe]
  )

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}
