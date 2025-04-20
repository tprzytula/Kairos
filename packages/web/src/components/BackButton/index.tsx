import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { IconButton } from '@mui/material'
import { IBackButtonProps } from './types'

import AddIcon from '@mui/icons-material/ArrowCircleLeftOutlined'

const BackButton = ({ route }: IBackButtonProps) => {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    if (route) {
      navigate(route)
    }
  }, [navigate, route])

  return (
    <IconButton
      onClick={goBack}
      aria-label={'Back Button'}
      sx={{ visibility: route ? 'visible' : 'hidden' }}
    >
      <AddIcon sx={{ fontSize: '3em' }} />
    </IconButton>
  )
}

export default BackButton
