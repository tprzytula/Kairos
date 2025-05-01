import React, { useCallback, useEffect, useState } from 'react'
import { retrieveGroceryList } from '../../api'
import { GroceryItem } from '../../providers/AppStateProvider/types'
import { Container } from './index.styled'

const Root: React.FC = () => {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([])

  const fetchGroceryList = useCallback(async () => {
    try {
      const list = await retrieveGroceryList()
      setGroceryList(list)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList([])
    }
  }, [setGroceryList])

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  return (
    <Container>
      <h1>Grocery List</h1>
      <ul>
        {groceryList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </Container>
  )
}

export default Root
