import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column',
})

export const StyledButton = styled('div')<{ color?: 'primary' | 'secondary' | 'success' | 'info' }>(({ theme, color = 'primary' }) => {
  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    info: theme.palette.info,
  }

  const selectedColor = colorMap[color]

  return {
    margin: '0.5em',
    padding: '1em 1.5em',
    width: '12em',
    height: '2.5em',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: selectedColor.main,
    color: selectedColor.contrastText,
    borderRadius: '0.5em',
    cursor: 'pointer',
    fontSize: '1.2em',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    '& svg': {
      fontSize: '1.5em',
      minWidth: '1.5em',
      marginRight: '0.75em',
    },
    '& span': {
      flex: 1,
      textAlign: 'left',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
      backgroundColor: selectedColor.dark,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }
  }
})

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
