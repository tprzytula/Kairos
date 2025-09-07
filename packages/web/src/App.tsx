import { Routes, Route } from 'react-router'
import { ApplicationContainer } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import EditGroceryItemRoute from './routes/EditGroceryItemRoute'
import ShopListRoute from './routes/ShopListRoute'
import { Route as RouteEnum } from './enums/route'
import NoiseTrackingRoute from './routes/NoiseTrackingRoute'
import ToDoListRoute from './routes/ToDoListRoute'
import AddToDoItemRoute from './routes/AddToDoItemRoute'
import EditToDoItemRoute from './routes/EditToDoItemRoute'
import HomeRoute from './routes/HomeRoute'
import AuthCallback from './components/AuthCallback'
import SilentCallback from './components/SilentCallback'
import ProtectedContent from './components/ProtectedContent'

export const App = () => {
  return (
    <ApplicationContainer>
      <Routes>
        {/* Auth routes - full viewport, no Content wrapper constraints */}
        <Route path={RouteEnum.AuthCallback} element={<AuthCallback />} />
        <Route path={RouteEnum.SilentCallback} element={<SilentCallback />} />
        
        {/* App routes - wrapped in ProtectedContent for consistent layout */}
        <Route path={RouteEnum.Home} element={
          <ProtectedContent>
            <HomeRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.Shops} element={
          <ProtectedContent>
            <ShopListRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.GroceryList} element={
          <ProtectedContent>
            <GroceryListRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.AddGroceryItem} element={
          <ProtectedContent>
            <AddGroceryItemRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.EditGroceryItem} element={
          <ProtectedContent>
            <EditGroceryItemRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.NoiseTracking} element={
          <ProtectedContent>
            <NoiseTrackingRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.ToDoList} element={
          <ProtectedContent>
            <ToDoListRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.AddToDoItem} element={
          <ProtectedContent>
            <AddToDoItemRoute />
          </ProtectedContent>
        } />
        <Route path={RouteEnum.EditToDoItem} element={
          <ProtectedContent>
            <EditToDoItemRoute />
          </ProtectedContent>
        } />
      </Routes>
    </ApplicationContainer>
  )
}
