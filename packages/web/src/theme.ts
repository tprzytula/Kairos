import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      background?: string
      light?: string
    }
  }

  interface PaletteOptions {
    custom?: {
      background?: string
      light?: string
    }
  }
}

const theme = createTheme({
  shape: {
    borderRadius: 30,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: 'none',
        },
      },
    },
  },
  typography: {
    subtitle1: {
      fontSize: '2.5em',
      lineHeight: '1.25em',
      paddingBottom: '0.25em',
      color: '#32525F',
      fontWeight: '600',
    },
    subtitle2: {
      fontSize: '1.5em',
      lineHeight: '1.25em',
      paddingBottom: '0.25em',
      color: '#32525F',
      fontWeight: '500',
    },
    body1: {
      fontSize: '1em',
      color: '#32525F',
      fontWeight: '400',
    },
    button: {
      color: '#FDEEF1',
    },
  },
  palette: {
    primary: {
      main: '#E63E5D',
    },
    secondary: {
      main: '#FFBD48',
    },
    custom: {
      background: '#F5E1C2',
      light: '#7784F6',
    },
  },
})

export default theme
