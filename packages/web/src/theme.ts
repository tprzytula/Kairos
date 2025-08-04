import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      background?: string
      light?: string
      surfaces?: {
        primary?: string
        secondary?: string
        disabled?: string
        hover?: string
      }
      hover?: {
        primary?: string
        secondary?: string
      }
    }
  }

  interface PaletteOptions {
    custom?: {
      background?: string
      light?: string
      surfaces?: {
        primary?: string
        secondary?: string
        disabled?: string
        hover?: string
      }
      hover?: {
        primary?: string
        secondary?: string
      }
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
          transition: 'all 200ms ease-in-out',
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
          transition: 'all 200ms ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
        text: {
          textTransform: 'none',
          transition: 'all 200ms ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms ease-in-out',
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
            transition: 'all 200ms ease-in-out',
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
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    subtitle1: {
      fontSize: '2.5em',
      lineHeight: '1.25em',
      paddingBottom: '0.25em',
      fontWeight: '600',
      letterSpacing: '-0.02em',
    },
    subtitle2: {
      fontSize: '1.5em',
      lineHeight: '1.25em',
      paddingBottom: '0.25em',
      fontWeight: '500',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1em',
      fontWeight: '400',
      letterSpacing: '-0.005em',
    },
    button: {
      color: '#FDEEF1',
      fontWeight: '500',
      letterSpacing: '-0.005em',
    },
  },
  palette: {
    primary: {
      main: '#10b981',
    },
    secondary: {
      main: '#3b82f6',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    text: {
      primary: '#374151',
      secondary: '#6b7280',
    },
    custom: {
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      light: '#3b82f6',
      surfaces: {
        primary: '#f8fafc',
        secondary: '#f1f5f9', 
        disabled: '#f1f5f9',
        hover: '#f8fafc',
      },
      hover: {
        primary: '#059669',
        secondary: '#2563eb',
      },
    },
  },
})

export default theme
