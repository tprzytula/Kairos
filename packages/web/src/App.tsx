import { Routes, Route, Navigate } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryList from './routes/GroceryList'
import AddGroceryItem from './routes/AddGroceryItem'
import StartingScreen from './routes/StartingScreen'

export const App = () => {
  return (
    <ApplicationContainer>
      <Content>
        <Routes>
          <Route path="/" element={<StartingScreen />} />
          <Route path="/groceries" element={<GroceryList />} />
          <Route path="/groceries/add" element={<AddGroceryItem />} />
        </Routes>
      </Content>
    </ApplicationContainer>
  )
}
