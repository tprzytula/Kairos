import { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import { getRecipes, addRecipe as addRecipeApi, updateRecipe as updateRecipeApi, deleteRecipe } from '../../api/recipes'
import { IState, IRecipeProviderProps } from './types'
import { useProjectContext } from '../ProjectProvider'

const initialState: IState = {
  recipes: [],
  isLoading: false,
  fetchRecipes: async () => {},
  addRecipe: async (_name, _ingredients, _imagePath?, _instructions?) => {},
  updateRecipe: async (_id, _fields) => {},
  removeRecipe: async () => {},
}

export const RecipeContext = createContext<IState>(initialState)

export const useRecipeContext = () => useContext(RecipeContext)

export const RecipeProvider = ({ children }: IRecipeProviderProps) => {
  const { currentProject } = useProjectContext()
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRecipes = useCallback(async () => {
    if (!currentProject) return

    try {
      setIsLoading(true)
      const items = await getRecipes(currentProject.id)
      setRecipes(items)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject])

  const addRecipe = useCallback(async (name: string, ingredients: IRecipeIngredient[], imagePath?: string, instructions?: string[]) => {
    if (!currentProject) return

    const result = await addRecipeApi({ name, ingredients, imagePath, instructions }, currentProject.id)
    const newRecipe: IRecipe = {
      ...result,
      name,
      ingredients,
      imagePath,
      instructions,
      projectId: currentProject.id,
    }
    setRecipes((prev) => [...prev, newRecipe])
  }, [currentProject])

  const updateRecipe = useCallback(async (id: string, fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string }) => {
    if (!currentProject) return

    await updateRecipeApi(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    ) as Partial<IRecipe>
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...definedFields } : recipe
      )
    )
  }, [currentProject])

  const removeRecipe = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteRecipe(id, currentProject.id)
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
  }, [currentProject])

  useLayoutEffect(() => {
    if (currentProject) {
      fetchRecipes()
    } else {
      setRecipes([])
    }
  }, [currentProject, fetchRecipes])

  const value = useMemo(
    () => ({
      recipes,
      isLoading,
      fetchRecipes,
      addRecipe,
      updateRecipe,
      removeRecipe,
    }),
    [recipes, isLoading, fetchRecipes, addRecipe, updateRecipe, removeRecipe]
  )

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}
