import { Routes, Route } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import StartingScreenRoute from './routes/StartingScreenRoute'
import AlertContainer from './components/AlertContainer'
import { Route as RouteEnum } from './enums/route'
import NoiseTrackingRoute from './routes/NoiseTrackingRoute'

export const App = () => {
  return (
    <ApplicationContainer>
      <Content>
        <Routes>
          <Route path={RouteEnum.Home} element={<StartingScreenRoute />} />
          <Route path={RouteEnum.GroceryList} element={<GroceryListRoute />} />
          <Route path={RouteEnum.AddGroceryItem} element={<AddGroceryItemRoute />} />
          <Route path={RouteEnum.NoiseTracking} element={<NoiseTrackingRoute />} />
        </Routes>
        <AlertContainer />
      </Content>
    </ApplicationContainer>
  )
}
