import { ReactNode } from 'react'
import { Button, SxProps, Theme } from '@mui/material'

interface DrawerActionButtonProps {
  gradient?: string
  icon?: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'contained' | 'outlined'
  color?: 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'warning'
  sx?: SxProps<Theme>
}

const DrawerActionButton = ({
  gradient,
  icon,
  label,
  onClick,
  disabled,
  variant = 'contained',
  color,
  sx,
}: DrawerActionButtonProps) => {
  const containedSx: SxProps<Theme> = gradient
    ? {
        background: gradient,
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none', opacity: 0.9 },
        '&:disabled': { background: 'rgba(0,0,0,0.12)' },
      }
    : {}

  return (
    <Button
      variant={variant}
      fullWidth
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      color={color}
      sx={{
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 600,
        py: 1.25,
        ...containedSx,
        ...sx as Record<string, unknown>,
      }}
    >
      {label}
    </Button>
  )
}

export default DrawerActionButton
