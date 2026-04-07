import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import CircularProgress from '@mui/material/CircularProgress'
import { ApplicationContainer } from './App.styled'
import { Route as RouteEnum } from './enums/route'
import HomeRoute from './routes/HomeRoute'
import AuthCallback from './components/AuthCallback'
import SilentCallback from './components/SilentCallback'
import ProtectedContent from './components/ProtectedContent'

const GroceryListRoute = lazy(() => import('./routes/GroceryListRoute'))
const AddGroceryItemRoute = lazy(() => import('./routes/AddGroceryItemRoute'))
const EditGroceryItemRoute = lazy(() => import('./routes/EditGroceryItemRoute'))
const ShopListRoute = lazy(() => import('./routes/ShopListRoute'))
const NoiseTrackingRoute = lazy(() => import('./routes/NoiseTrackingRoute'))
const PlannerRoute = lazy(() => import('./routes/PlannerRoute'))
const AddPlannerItemRoute = lazy(() => import('./routes/AddPlannerItemRoute'))
const EditPlannerItemRoute = lazy(() => import('./routes/EditPlannerItemRoute'))
const EditAdventureRoute = lazy(() => import('./routes/EditAdventureRoute'))
const RecipesRoute = lazy(() => import('./routes/RecipesRoute'))

const LazyFallback = () => (
  <CircularProgress size={32} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
)

export const App = () => {
  return (
    <ApplicationContainer>
      <Suspense fallback={<LazyFallback />}>
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
          <Route path={RouteEnum.Recipes} element={
            <ProtectedContent>
              <RecipesRoute />
            </ProtectedContent>
          } />
          <Route path={RouteEnum.Planner} element={
            <ProtectedContent>
              <PlannerRoute />
            </ProtectedContent>
          } />
          <Route path={RouteEnum.AddPlannerItem} element={
            <ProtectedContent>
              <AddPlannerItemRoute />
            </ProtectedContent>
          } />
          <Route path={RouteEnum.EditPlannerItem} element={
            <ProtectedContent>
              <EditPlannerItemRoute />
            </ProtectedContent>
          } />
          <Route path={RouteEnum.EditAdventure} element={
            <ProtectedContent>
              <EditAdventureRoute />
            </ProtectedContent>
          } />
        </Routes>
      </Suspense>
    </ApplicationContainer>
  )
}
