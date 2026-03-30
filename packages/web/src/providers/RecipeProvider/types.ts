import { MealType } from '../../enums/mealType'
import { RecipeDishType } from '../../enums/recipeDishType'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'

export interface IState {
  recipes: IRecipe[]
  isLoading: boolean
  fetchRecipes: () => Promise<void>
  addRecipe: (name: string, ingredients: IRecipeIngredient[], imagePath?: string, instructions?: string[], externalLink?: string, mealTypes?: MealType[], dishTypes?: RecipeDishType[], isPrivate?: boolean) => Promise<void>
  updateRecipe: (id: string, fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string; externalLink?: string; mealTypes?: MealType[]; dishTypes?: RecipeDishType[]; isPrivate?: boolean }) => Promise<void>
  removeRecipe: (id: string) => Promise<void>
}

export interface IRecipeProviderProps {
  children: React.ReactNode
}
