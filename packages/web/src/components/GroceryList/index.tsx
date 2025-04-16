import { IGroceryListProps } from './types'

export const GroceryList = ({ groceryList }: IGroceryListProps) => {
  return (
    <ul> 
      {groceryList.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}

export default GroceryList
