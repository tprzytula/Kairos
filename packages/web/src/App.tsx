import { Routes, Route } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryList from './routes/GroceryList'

export function App() {
  return (
    <ApplicationContainer>
      <Content>
          <Routes>
            <Route path="/" element={<GroceryList />} />
          </Routes>
      </Content>
    </ApplicationContainer>
  )
}
