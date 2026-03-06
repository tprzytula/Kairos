import { IRecipe, IRecipeIngredient } from '../../types/recipe'

export interface IState {
  recipes: IRecipe[]
  isLoading: boolean
  fetchRecipes: () => Promise<void>
  addRecipe: (name: string, ingredients: IRecipeIngredient[], imagePath?: string, instructions?: string[]) => Promise<void>
  updateRecipe: (id: string, fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string }) => Promise<void>
  removeRecipe: (id: string) => Promise<void>
}

export interface IRecipeProviderProps {
  children: React.ReactNode
}
