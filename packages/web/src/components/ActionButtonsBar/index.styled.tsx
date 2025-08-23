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
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '2em',
  marginBottom: '0.25em',
})

export const RightSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: '48px',
  justifyContent: 'flex-end',
})

export const ActionButton = styled(Button)({
  width: '100%',
  minHeight: '2em',
  marginBottom: '0.25em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.75em',
  padding: '0.5em 1em',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  textTransform: 'none',
  letterSpacing: '0.01em',
  boxSizing: 'border-box',
})

export const StatusText = styled('div')({
  width: '100%',
  minHeight: '2em',
  marginBottom: '0.25em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  fontSize: '0.75em',
  fontWeight: 600,
  padding: '0.5em 1em',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  color: '#6b7280',
  letterSpacing: '0.01em',
  textAlign: 'center',
  backgroundColor: '#f8f9fa',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
