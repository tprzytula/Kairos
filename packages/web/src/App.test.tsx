import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { StateComponent } from './state'
import theme from './theme'
import { App } from './App'

const renderApp = () => {
  render(
    <ThemeProvider theme={theme}>
      <StateComponent>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StateComponent>
    </ThemeProvider>
  )
}

describe('Given the App component', () => {
  it('should render the root route when rendered', () => {
    renderApp()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
