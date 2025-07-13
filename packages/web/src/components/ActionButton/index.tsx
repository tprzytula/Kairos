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
    <IconButton onClick={onClick} aria-label={ariaLabel} sx={sx} disabled={disabled}>
      {icon}
      {text && <Typography>{text}</Typography>}
    </IconButton>
  )
}

export default ActionButton;
