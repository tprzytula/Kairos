import { styled } from '@mui/system'
import { Avatar, Chip } from '@mui/material'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '12px',
  backgroundColor: theme?.palette?.action?.hover || '#f8fafc',
  margin: '2px 0',
}))

export const OfficeIcon = styled(BusinessOutlinedIcon)(({ theme }) => ({
  fontSize: '20px',
  color: theme?.palette?.text?.secondary || '#64748b',
  flexShrink: 0,
}))

export const AvatarRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
})

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: theme?.palette?.action?.selected || '#e2e8f0',
  color: theme?.palette?.text?.secondary || '#475569',
}))

export const OverflowChip = styled(Chip)(({ theme }) => ({
  height: '24px',
  fontSize: '0.7rem',
  fontWeight: 600,
  backgroundColor: theme?.palette?.action?.selected || '#e2e8f0',
  color: theme?.palette?.text?.secondary || '#64748b',
}))
