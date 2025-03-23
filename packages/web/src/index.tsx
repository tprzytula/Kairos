import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { App } from './App'
import theme from './theme'
import { StateComponent } from './state'
import { HashRouter } from 'react-router-dom'

const container = document.getElementById('app')

if (container) {
  const root = createRoot(container)
  root.render(
    <ThemeProvider theme={theme}>
      <StateComponent>
        <HashRouter>
          <App />
        </HashRouter>
      </StateComponent>
    </ThemeProvider>
  )
}
