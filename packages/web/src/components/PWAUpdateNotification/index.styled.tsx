import { styled } from '@mui/material/styles'
import { Snackbar, Alert, Button, Box } from '@mui/material'

export const UpdateSnackbar = styled(Snackbar)(({ theme }) => ({
  top: theme.spacing(2),
  zIndex: 9999,
  [theme.breakpoints.up('sm')]: {
    top: theme.spacing(3),
  },
}))

export const UpdateAlert = styled(Alert)({
  width: '100%',
  maxWidth: '500px',
})

export const UpdateButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
})

export const DismissButton = styled(Button)({
  minWidth: 'auto',
  padding: 8,
})

export const OfflineNotice = styled(Box)({
  marginTop: 8,
  fontSize: '0.875rem',
  opacity: 0.8,
})
