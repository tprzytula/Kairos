import { useMemo } from 'react'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { GroceryViewMode, GroceryCategory, CategoryOrder, GroceryCategoryLabelMap } from '../../enums/groceryCategory'
import { getCategoryFromItemOrDefault } from '../../utils/grocery/categoryMatcher'
import { ICategorizedGroceryGroup, IUseGroceryCategoriesResult } from './types'

export const useGroceryCategories = (
  groceryList: IGroceryItem[],
  viewMode: GroceryViewMode
): IUseGroceryCategoriesResult => {
  const categorizedGroups = useMemo(() => {
    if (viewMode === GroceryViewMode.UNCATEGORIZED) {
      return null
    }

    const itemsByCategory = new Map<GroceryCategory, IGroceryItem[]>()

    groceryList.forEach(item => {
      const category = getCategoryFromItemOrDefault(item.name, item.category)
      const existingItems = itemsByCategory.get(category) || []
      itemsByCategory.set(category, [...existingItems, item])
    })

    if (viewMode === GroceryViewMode.ALPHABETICAL) {
      const allItems = Array.from(itemsByCategory.values()).flat()
      const sortedItems = allItems.sort((a, b) => a.name.localeCompare(b.name))
      
      return [{
        category: GroceryCategory.OTHER,
        items: sortedItems,
        label: 'All Items (A-Z)'
      }]
    }

    const groups: ICategorizedGroceryGroup[] = CategoryOrder
      .filter(category => itemsByCategory.has(category))
      .map(category => ({
        category,
        items: itemsByCategory.get(category)!.sort((a, b) => a.name.localeCompare(b.name)),
        label: GroceryCategoryLabelMap[category]
      }))

    return groups

  }, [groceryList, viewMode])

  return {
    categorizedGroups,
    isUncategorized: viewMode === GroceryViewMode.UNCATEGORIZED
  }
}

export default useGroceryCategories