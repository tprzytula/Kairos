import { IconButton, Typography } from '@mui/material'  
import { useTheme } from '@mui/material/styles'
import { memo, useMemo } from 'react'
import { IActionButtonProps } from './types'

export const ActionButton = memo(({
    ariaLabel,
    icon,
    onClick,
    text,
    sx,
    disabled = false
}: IActionButtonProps) => {
  const theme = useTheme()
  
  const memoizedSx = useMemo(() => ({
    width: '32px',
    height: '32px',
    backgroundColor: disabled ? theme.palette.custom?.surfaces?.disabled : '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '6px',
    color: disabled ? theme.palette.text.secondary : theme.palette.text.primary,
    transition: 'all 200ms ease-in-out',
    '&:hover': {
      backgroundColor: disabled ? theme.palette.custom?.surfaces?.disabled : theme.palette.custom?.surfaces?.hover,
      borderColor: disabled ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.2)',
      transform: disabled ? 'none' : 'scale(1.05)',
    },
    '&:active': {
      transform: disabled ? 'none' : 'scale(0.95)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '16px',
    },
    ...sx
  }), [disabled, theme, sx])
  
  return (
    <IconButton 
      onClick={onClick} 
      aria-label={ariaLabel} 
      disabled={disabled}
      sx={memoizedSx}
    >
      {icon}
      {text && <Typography>{text}</Typography>}
    </IconButton>
  )
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;
