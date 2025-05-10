import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import ToDoListRoute from '.'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

describe('Given the ToDoListRoute component', () => {
  it('should have the correct title', async () => {
    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('To Do List')).toBeVisible()
  })
})

const renderComponent = () => {
  jest.mocked(useAppState).mockReturnValue({
    state: initialState,
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <ToDoListRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
