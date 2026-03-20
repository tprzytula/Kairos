import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

export {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../FormCard/index.styled'

export const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.875rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '48px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)',
    color: 'rgba(255, 255, 255, 0.7)',
    boxShadow: 'none',
    transform: 'none',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover:before': {
    left: '100%',
  },
}))

export const ImageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '0.5rem',
})
