import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppStateProvider } from './providers/AppStateProvider'
import theme from './theme'
import { App } from './App'

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

// Mock the auth context
vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    error: null,
    user: { profile: { name: 'Test User' } }
  }),
}))

const renderApp = () => {
  const queryClient = createTestQueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppStateProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppStateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('Given the App component', () => {
  it('should render the grocery list route when rendered', () => {
    renderApp()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
