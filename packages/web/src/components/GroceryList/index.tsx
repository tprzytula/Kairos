import { useGroceryListContext } from '../../providers/GroceryListProvider'

export const GroceryList = () => {
  const { groceryList } = useGroceryListContext()

  return (
    <ul> 
      {groceryList.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}

export default GroceryList
