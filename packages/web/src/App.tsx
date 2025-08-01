import { Routes, Route } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import AlertContainer from './components/AlertContainer'
import { Route as RouteEnum } from './enums/route'
import NoiseTrackingRoute from './routes/NoiseTrackingRoute'
import ToDoListRoute from './routes/ToDoListRoute'
import AddToDoItemRoute from './routes/AddToDoItemRoute'
import HomeRoute from './routes/HomeRoute'

export const App = () => {
  return (
    <ApplicationContainer>
      <Content>
        <Routes>
          <Route path={RouteEnum.Home} element={<HomeRoute />} />
          <Route path={RouteEnum.GroceryList} element={<GroceryListRoute />} />
          <Route path={RouteEnum.AddGroceryItem} element={<AddGroceryItemRoute />} />
          <Route path={RouteEnum.NoiseTracking} element={<NoiseTrackingRoute />} />
          <Route path={RouteEnum.ToDoList} element={<ToDoListRoute />} />
          <Route path={RouteEnum.AddToDoItem} element={<AddToDoItemRoute />} />
        </Routes>
        <AlertContainer />
      </Content>
    </ApplicationContainer>
  )
}
