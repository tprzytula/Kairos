import { createContext, useContext, useCallback, useMemo } from 'react'
import { MealType } from '../../enums/mealType'
import { RecipeDishType } from '../../enums/recipeDishType'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import { getRecipes, addRecipe as addRecipeApi, updateRecipe as updateRecipeApi, deleteRecipe } from '../../api/recipes'
import { IState, IRecipeProviderProps } from './types'
import { useEntityCrud } from '../../hooks/useEntityCrud'

const initialState: IState = {
  recipes: [],
  isLoading: false,
  fetchRecipes: async () => {},
  addRecipe: async (_name, _ingredients, _imagePath?, _instructions?, _externalLink?, _mealTypes?, _dishTypes?, _isPrivate?) => {},
  updateRecipe: async (_id, _fields) => {},
  removeRecipe: async () => {},
}

export const RecipeContext = createContext<IState>(initialState)

export const useRecipeContext = () => useContext(RecipeContext)

export const RecipeProvider = ({ children }: IRecipeProviderProps) => {
  const { items: recipes, isLoading, currentProject, refetch, addToCache, update, remove } = useEntityCrud<IRecipe>({
    queryKey: 'recipes',
    fetchFn: getRecipes,
    updateFn: (id, fields, projectId) => updateRecipeApi(id, fields, projectId),
    deleteFn: deleteRecipe,
  })

  const addRecipe = useCallback(async (name: string, ingredients: IRecipeIngredient[], imagePath?: string, instructions?: string[], externalLink?: string, mealTypes?: MealType[], dishTypes?: RecipeDishType[], isPrivate?: boolean) => {
    if (!currentProject) return

    const result = await addRecipeApi({ name, ingredients, imagePath, instructions, externalLink, mealTypes, dishTypes }, currentProject.id, isPrivate)
    addToCache({
      ...result,
      name,
      ingredients,
      imagePath,
      instructions,
      externalLink,
      mealTypes,
      dishTypes,
      projectId: currentProject.id,
      ...(isPrivate && { visibility: 'private' as const }),
    })
  }, [currentProject, addToCache])

  const value = useMemo(
    () => ({
      recipes,
      isLoading,
      fetchRecipes: refetch,
      addRecipe,
      updateRecipe: update,
      removeRecipe: remove,
    }),
    [recipes, isLoading, refetch, addRecipe, update, remove]
  )

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}
