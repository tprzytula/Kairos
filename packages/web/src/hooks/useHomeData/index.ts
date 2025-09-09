import { useMemo } from 'react'
import { IUseHomeDataProps, IHomeData, IGroceryStats, IToDoStats, INoiseCounts } from './types'

export const useHomeData = ({
  groceryList,
  toDoList,
  noiseTrackingItems,
  purchasedItems,
  isToDoItemsExpanded
}: IUseHomeDataProps): IHomeData => {
  const groceryStats: IGroceryStats = useMemo(() => {
    const unpurchasedItems = groceryList.filter(item => !purchasedItems.has(item.id))
    
    return {
      totalItems: groceryList.length,
      unpurchasedItems,
      displayItems: unpurchasedItems.length > 10 ? unpurchasedItems.slice(0, 9) : unpurchasedItems,
      hasOverflow: unpurchasedItems.length > 10
    }
  }, [groceryList, purchasedItems])

  const toDoStats: IToDoStats = useMemo(() => {
    const pendingItems = toDoList.filter(item => !item.isDone)
    
    const sortedItems = pendingItems.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate - b.dueDate
    })
    
    const displayedItems = isToDoItemsExpanded ? sortedItems : sortedItems.slice(0, 3)
    
    return {
      pendingItems,
      sortedItems,
      displayedItems,
      hasMoreItems: pendingItems.length > 3
    }
  }, [toDoList, isToDoItemsExpanded])

  const noiseCounts: INoiseCounts = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const todayCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= today
    }).length
    
    const last7DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= sevenDaysAgo
    }).length
    
    const last30DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= thirtyDaysAgo
    }).length
    
    return {
      todayCount,
      last7DaysCount,
      last30DaysCount,
      totalCount: noiseTrackingItems.length
    }
  }, [noiseTrackingItems])

  return {
    groceryStats,
    toDoStats,
    noiseCounts
  }
}

export default useHomeData
