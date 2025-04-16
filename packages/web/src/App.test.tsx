import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from './providers/AppStateProvider'
import theme from './theme'
import { App } from './App'

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
  it('should render the root route when rendered', () => {
    renderApp()
    expect(screen.getByText('Kairos')).toBeVisible()
  })
})
