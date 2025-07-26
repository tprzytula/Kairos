import { styled } from '@mui/material/styles'
import { Card, CardContent, Typography, Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '1rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
})

export const SectionCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.06)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
})

export const SectionHeader = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#32525F',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const SectionContent = styled(CardContent)({
  padding: '1.25rem',
  '&:last-child': {
    paddingBottom: '1.25rem',
  },
})

export const ItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const ItemText = styled('li')({
  fontSize: '0.95rem',
  color: '#32525F',
  padding: '0.75rem 1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#e9ecef',
  },
})

export const EmptyState = styled(Typography)({
  fontSize: '0.9rem',
  color: '#6c757d',
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '1rem',
})

export const NoiseItem = styled('li')({
  fontSize: '0.95rem',
  color: '#32525F',
  padding: '0.75rem 1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'background-color 0.2s ease',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#e9ecef',
  },
})

export const TimeElapsed = styled('span')({
  fontSize: '0.8rem',
  color: '#6c757d',
  fontWeight: '500',
}) 