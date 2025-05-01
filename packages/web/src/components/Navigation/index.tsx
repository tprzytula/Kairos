import { Box } from '@mui/material'
import BackButton from '../BackButton'
import { ReactNode } from 'react'

type NavigationProps = {
  previousRoute: string
  actionButton?: ReactNode
}

const Navigation = ({ actionButton, previousRoute }: NavigationProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <BackButton route={previousRoute} />
      {actionButton}
    </Box>
  )
}

export default Navigation;