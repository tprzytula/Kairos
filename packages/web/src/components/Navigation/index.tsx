import { Box } from '@mui/material'
import BackButton from '../BackButton'
import NavigateButton from '../NavigateButton'
import { INavigationProps } from './types'

const Navigation = ({ previousRoute, nextRoute }: INavigationProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: '5em',
        padding: '1em',
      }}
    >
      <BackButton route={previousRoute} />
      <NavigateButton route={nextRoute} />
    </Box>
  )
}

export default Navigation;