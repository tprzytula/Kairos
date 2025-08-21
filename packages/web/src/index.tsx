import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { App } from './App'
import theme from './theme'
import { AppStateProvider } from './providers/AppStateProvider'
import { BrowserRouter } from 'react-router'
import AuthProvider from './providers/AuthProvider'

const container = document.getElementById('app')

if (container) {
  const root = createRoot(container)

  root.render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppStateProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppStateProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
