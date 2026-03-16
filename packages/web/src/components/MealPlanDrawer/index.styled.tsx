import { styled } from '@mui/material/styles'
import { Box, Typography, TextField, Button, ToggleButtonGroup } from '@mui/material'

export const RecipeItemRow = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  cursor: 'pointer',
  backgroundColor: selected ? '#eff6ff' : 'transparent',
  borderBottom: '1px solid #f3f4f6',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: selected ? '#dbeafe' : '#f9fafb',
  },
}))

export const RecipeThumbnail = styled('img')({
  width: '40px',
  height: '40px',
  borderRadius: '6px',
  objectFit: 'cover',
  flexShrink: 0,
})

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

export const RecipeThumbnailPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '6px',
  flexShrink: 0,
  background: GRADIENTS[seed % GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.85)',
  fontWeight: 700,
  fontSize: '1rem',
  userSelect: 'none',
}))

export const RecipeItemName = styled(Typography)({
  flex: 1,
  fontSize: '0.9rem',
  color: '#374151',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

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
