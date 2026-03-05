import { IRecipe, IRecipeIngredient } from '../../types/recipe'

export interface IState {
  recipes: IRecipe[]
  isLoading: boolean
  fetchRecipes: () => Promise<void>
  addRecipe: (name: string, ingredients: IRecipeIngredient[]) => Promise<void>
  updateRecipe: (id: string, fields: { name?: string; ingredients?: IRecipeIngredient[] }) => Promise<void>
  removeRecipe: (id: string) => Promise<void>
}

export interface IRecipeProviderProps {
  children: React.ReactNode
}
