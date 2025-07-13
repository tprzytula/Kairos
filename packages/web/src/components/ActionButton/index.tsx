import { IconButton, Typography } from '@mui/material'  
import { IActionButtonProps } from './types'

export const ActionButton = ({
    ariaLabel,
    icon,
    onClick,
    text,
    sx,
    disabled = false
}: IActionButtonProps) => {
  return (
    <IconButton 
      onClick={onClick} 
      aria-label={ariaLabel} 
      disabled={disabled}
      sx={{
        width: '32px',
        height: '32px',
        backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '6px',
        color: disabled ? '#9ca3af' : '#374151',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: disabled ? '#f5f5f5' : '#f8f9fa',
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
      }}
    >
      {icon}
      {text && <Typography>{text}</Typography>}
    </IconButton>
  )
}

export default ActionButton;
