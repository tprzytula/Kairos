import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.2)',
      borderWidth: '1px',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.4)',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      borderWidth: '2px',
      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
      boxShadow: `0 2px 8px ${theme.palette.error.main}20`,
    },
    '&.Mui-disabled': {
      background: 'rgba(248, 250, 252, 0.5)',
      opacity: 0.7,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontWeight: '500',
    '&.Mui-focused': {
      color: '#667eea',
      fontWeight: '600',
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.8rem',
    fontWeight: '500',
    marginLeft: '4px',
    marginTop: '6px',
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}))
