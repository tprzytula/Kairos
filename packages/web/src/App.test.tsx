import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from './providers/AppStateProvider'
import theme from './theme'
import { App } from './App'

// Mock the auth context
jest.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    error: null,
    user: { profile: { name: 'Test User' } }
  }),
}))

const renderApp = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}

describe('Given the App component', () => {
  it('should render the grocery list route when rendered', () => {
    renderApp()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
