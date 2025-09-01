import { Routes, Route } from 'react-router'
import { ApplicationContainer } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import EditGroceryItemRoute from './routes/EditGroceryItemRoute'
import { Route as RouteEnum } from './enums/route'
import NoiseTrackingRoute from './routes/NoiseTrackingRoute'
import ToDoListRoute from './routes/ToDoListRoute'
import AddToDoItemRoute from './routes/AddToDoItemRoute'
import EditToDoItemRoute from './routes/EditToDoItemRoute'
import HomeRoute from './routes/HomeRoute'
import AuthCallback from './components/AuthCallback'
import SilentCallback from './components/SilentCallback'
import ProtectedAppRoute from './components/ProtectedAppRoute'

export const App = () => {
  return (
    <ApplicationContainer>
      <Routes>
        {/* Auth routes - full viewport, no Content wrapper constraints */}
        <Route path={RouteEnum.AuthCallback} element={<AuthCallback />} />
        <Route path={RouteEnum.SilentCallback} element={<SilentCallback />} />
        
        {/* App routes - wrapped in ProtectedAppRoute for consistent layout */}
        <Route path={RouteEnum.Home} element={
          <ProtectedAppRoute>
            <HomeRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.GroceryList} element={
          <ProtectedAppRoute>
            <GroceryListRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.AddGroceryItem} element={
          <ProtectedAppRoute>
            <AddGroceryItemRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.EditGroceryItem} element={
          <ProtectedAppRoute>
            <EditGroceryItemRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.NoiseTracking} element={
          <ProtectedAppRoute>
            <NoiseTrackingRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.ToDoList} element={
          <ProtectedAppRoute>
            <ToDoListRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.AddToDoItem} element={
          <ProtectedAppRoute>
            <AddToDoItemRoute />
          </ProtectedAppRoute>
        } />
        <Route path={RouteEnum.EditToDoItem} element={
          <ProtectedAppRoute>
            <EditToDoItemRoute />
          </ProtectedAppRoute>
        } />
      </Routes>
    </ApplicationContainer>
  )
}
