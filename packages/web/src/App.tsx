import { Routes, Route } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import StartingScreenRoute from './routes/StartingScreenRoute'

export const App = () => {
  return (
    <ApplicationContainer>
      <Content>
        <Routes>
          <Route path="/" element={<StartingScreenRoute />} />
          <Route path="/groceries" element={<GroceryListRoute />} />
          <Route path="/groceries/add" element={<AddGroceryItemRoute />} />
        </Routes>
      </Content>
    </ApplicationContainer>
  )
}
