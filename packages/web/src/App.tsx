import './App.module.scss'

import { Routes, Route } from 'react-router-dom'
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
