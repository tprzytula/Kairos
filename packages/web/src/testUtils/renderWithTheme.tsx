import { render } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

export const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}
