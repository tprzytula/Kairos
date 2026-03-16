import { styled } from '@mui/material/styles'
import { Box, Typography, TextField, Button, ToggleButtonGroup } from '@mui/material'

export const DrawerContent = styled(Box)({
  padding: '1.25em',
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
})

export const DrawerHeader = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#1d4ed8',
})

export const DateLabel = styled(Typography)({
  fontSize: '0.9rem',
  color: '#6b7280',
  fontWeight: 500,
})

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
})

export const ModeToggle = styled(ToggleButtonGroup)({
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: 1,
    textTransform: 'none',
    fontSize: '0.85rem',
  },
})

export const RecipeList = styled(Box)({
  maxHeight: '200px',
  overflowY: 'auto',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
})

export const RecipeItem = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  padding: '10px 14px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: selected ? '#1d4ed8' : '#374151',
  backgroundColor: selected ? '#eff6ff' : 'transparent',
  borderBottom: '1px solid #f3f4f6',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: selected ? '#dbeafe' : '#f9fafb',
  },
}))

export const SaveButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px',
})

export const DeleteButton = styled(Button)({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px',
  color: '#dc2626',
  borderColor: '#dc2626',
  '&:hover': {
    borderColor: '#b91c1c',
    backgroundColor: '#fef2f2',
  },
})

export const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
})
