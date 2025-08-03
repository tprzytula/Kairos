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
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
          '&:active': {
            transform: 'scale(0.95)',
          },
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
        text: {
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.9)',
          },
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '16px',
            WebkitAppearance: 'none',
            borderRadius: 0,
          },
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:focus-within': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)',
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
      background: '#f5f6fa',
      light: '#7784F6',
    },
  },
})

export default theme
