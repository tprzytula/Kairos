import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'

export const UserButton = styled(Button)({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  minWidth: 'auto',
  
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.05)',
  },
})

export const UserAvatar = styled('img')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  objectFit: 'cover',
})

export const DropdownOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
})

export const UserDropdown = styled(Box)({
  position: 'absolute',
  top: '100%',
  right: 0,
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  padding: '16px',
  minWidth: '200px',
  zIndex: 1000,
  marginTop: '8px',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-6px',
    right: '12px',
    width: '12px',
    height: '12px',
    background: 'white',
    transform: 'rotate(45deg)',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
  },
})

export const UserInfo = styled(Box)({
  paddingBottom: '12px',
  borderBottom: '1px solid #f0f0f0',
  marginBottom: '12px',
})

export const UserName = styled(Typography)({
  fontWeight: 600,
  fontSize: '14px',
  color: '#1f2937',
  marginBottom: '4px',
})

export const UserEmail = styled(Typography)({
  fontSize: '12px',
  color: '#6b7280',
})

export const LogoutButton = styled(Button)({
  width: '100%',
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#374151',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textTransform: 'none',
  
  '&:hover': {
    background: '#f3f4f6',
    borderColor: '#d1d5db',
  },
})
