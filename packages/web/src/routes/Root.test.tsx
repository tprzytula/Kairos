import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { StateComponent } from '../state'
import theme from '../theme'
import { BrowserRouter } from 'react-router-dom'
import Root from './Root'

const renderRoot = () => {
  render(
    <ThemeProvider theme={theme}>
      <StateComponent>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </StateComponent>
    </ThemeProvider>
  )
}

describe('Given the Root component', () => {
  it('should have the correct title', () => {
    renderRoot()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
