import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../providers/AppStateProvider'
import theme from '../theme'
import { BrowserRouter } from 'react-router-dom'
import Root from './Root'

const renderRoot = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}

describe('Given the Root component', () => {
  it('should have the correct title', () => {
    renderRoot()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
