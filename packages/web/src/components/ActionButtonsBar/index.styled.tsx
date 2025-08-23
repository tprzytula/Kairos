import { styled } from '@mui/system'
import { Button } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  minHeight: '48px',
})

export const LeftSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: '48px',
})

export const CenterSection = styled('div')({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '1rem',
  paddingRight: '1rem',
})

export const RightSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: '48px',
  justifyContent: 'flex-end',
})

export const ActionButton = styled(Button)({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
})

export const StatusText = styled('div')(({ theme }) => ({
  color: theme?.palette?.text?.secondary || 'rgba(0, 0, 0, 0.6)',
  fontSize: '0.875rem',
  textAlign: 'center',
  fontWeight: 400,
}))
