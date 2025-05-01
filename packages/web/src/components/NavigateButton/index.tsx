import AddIcon from '@mui/icons-material/AddCircleOutline'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import { INavigateButtonProps } from './types'

const NavigateButton = ({ ariaLabel, route }: INavigateButtonProps) => {
  const navigate = useNavigate()

  const navigateToRoute = useCallback(() => {
    navigate(route)
  }, [navigate, route])

  return (
    <IconButton onClick={navigateToRoute} aria-label={ariaLabel}>
      <AddIcon sx={{ fontSize: '3em' }} />
    </IconButton>
  )
}

export default NavigateButton;
