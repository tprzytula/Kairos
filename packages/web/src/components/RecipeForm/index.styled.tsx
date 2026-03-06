import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const IngredientRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 80px 100px 36px',
  gap: '0.5rem',
  alignItems: 'center',
})

export const IngredientsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const FormActions = styled(Box)({
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  paddingTop: '0.5rem',
})

export const ImageUploadBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '120px',
  border: '2px dashed rgba(102, 126, 234, 0.4)',
  borderRadius: '12px',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    borderColor: 'rgba(102, 126, 234, 0.8)',
    background: 'rgba(102, 126, 234, 0.04)',
  },
})

export const ImagePreview = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
})
