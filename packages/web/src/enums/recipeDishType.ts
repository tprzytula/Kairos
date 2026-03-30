import { RecipeDishType } from '@kairos/shared'
export { RecipeDishType }

export const RecipeDishTypeLabelMap: Record<RecipeDishType, string> = {
  [RecipeDishType.PASTA]: 'Pasta',
  [RecipeDishType.SOUP]: 'Soup',
  [RecipeDishType.SALAD]: 'Salad',
  [RecipeDishType.BAKED_GOODS]: 'Baked Goods',
  [RecipeDishType.RICE]: 'Rice',
  [RecipeDishType.STEW]: 'Stew',
  [RecipeDishType.STIR_FRY]: 'Stir Fry',
  [RecipeDishType.SANDWICH]: 'Sandwich',
}

export const RecipeDishTypeOrder: RecipeDishType[] = [
  RecipeDishType.PASTA,
  RecipeDishType.SOUP,
  RecipeDishType.SALAD,
  RecipeDishType.BAKED_GOODS,
  RecipeDishType.RICE,
  RecipeDishType.STEW,
  RecipeDishType.STIR_FRY,
  RecipeDishType.SANDWICH,
]
