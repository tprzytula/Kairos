import { Routes, Route } from 'react-router'
import { ApplicationContainer, Content } from './App.styled'
import GroceryListRoute from './routes/GroceryListRoute'
import AddGroceryItemRoute from './routes/AddGroceryItemRoute'
import EditGroceryItemRoute from './routes/EditGroceryItemRoute'
import AlertContainer from './components/AlertContainer'
import PWAUpdateNotification from './components/PWAUpdateNotification'
import ConnectivityNotification from './components/ConnectivityNotification'
import { Route as RouteEnum } from './enums/route'
import NoiseTrackingRoute from './routes/NoiseTrackingRoute'
import ToDoListRoute from './routes/ToDoListRoute'
import AddToDoItemRoute from './routes/AddToDoItemRoute'
import EditToDoItemRoute from './routes/EditToDoItemRoute'
import HomeRoute from './routes/HomeRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from './components/AuthCallback'
import SilentCallback from './components/SilentCallback'

export const App = () => {
  return (
    <ApplicationContainer>
      <Routes>
        {/* Auth routes - full viewport, no Content wrapper constraints */}
        <Route path={RouteEnum.AuthCallback} element={<AuthCallback />} />
        <Route path={RouteEnum.SilentCallback} element={<SilentCallback />} />
        
        {/* App routes - wrapped in Content for proper layout */}
        <Route path={RouteEnum.Home} element={
          <Content>
            <ProtectedRoute><HomeRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.GroceryList} element={
          <Content>
            <ProtectedRoute><GroceryListRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.AddGroceryItem} element={
          <Content>
            <ProtectedRoute><AddGroceryItemRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.EditGroceryItem} element={
          <Content>
            <ProtectedRoute><EditGroceryItemRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.NoiseTracking} element={
          <Content>
            <ProtectedRoute><NoiseTrackingRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.ToDoList} element={
          <Content>
            <ProtectedRoute><ToDoListRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.AddToDoItem} element={
          <Content>
            <ProtectedRoute><AddToDoItemRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
        <Route path={RouteEnum.EditToDoItem} element={
          <Content>
            <ProtectedRoute><EditToDoItemRoute /></ProtectedRoute>
            <AlertContainer />
            <PWAUpdateNotification />
            <ConnectivityNotification />
          </Content>
        } />
      </Routes>
    </ApplicationContainer>
  )
}
