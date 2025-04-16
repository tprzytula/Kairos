import { useCallback, useEffect, useState } from 'react'
import { retrieveGroceryList } from '../../api'
import { GroceryItem } from '../../providers/AppStateProvider/types'
import { Container, Header } from './index.styled'
import Navigation from '../../components/Navigation'
import AddItemButton from '../../components/AddItemButton'

export const GroceryList = () => {
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
      <Header>
        Grocery List
      </Header>
      <ul>
        {groceryList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Navigation previousRoute="/" actionButton={<AddItemButton ariaLabel="Add Item" route="/groceries/add" />} />
    </Container>
  )
}

export default GroceryList;
