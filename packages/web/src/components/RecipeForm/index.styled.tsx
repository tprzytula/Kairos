import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { COLORS } from '../../constants/colors'

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const IngredientRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '36px 1fr 80px 100px 36px',
  gap: '0.5rem',
  alignItems: 'center',
})

export const IngredientsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const FormActions = styled(Box)({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  paddingTop: '0.75rem',
  paddingBottom: '0.75rem',
  marginTop: 'auto',
  background: 'white',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  marginLeft: '-1.25rem',
  marginRight: '-1.25rem',
  paddingLeft: '1.25rem',
  paddingRight: '1.25rem',
})

export const ImageUploadBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '195px',
  border: `2px dashed ${COLORS.orange.muted}`,
  borderRadius: '12px',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    borderColor: COLORS.orange.borderStrong,
    background: COLORS.orange.bgSubtle,
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
