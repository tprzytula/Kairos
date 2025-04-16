import AddIcon from '@mui/icons-material/AddCircleOutline'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router'
import { useCallback } from 'react'
import { IAddItemButtonProps } from './types'

const AddItemButton = ({ ariaLabel, route }: IAddItemButtonProps) => {
  const navigate = useNavigate()

  const enterAddItemView = useCallback(() => {
    navigate(route)
  }, [navigate, route])

  return (
    <IconButton onClick={enterAddItemView} aria-label={ariaLabel}>
      <AddIcon sx={{ fontSize: '3em' }} />
    </IconButton>
  )
}

export default AddItemButton;
