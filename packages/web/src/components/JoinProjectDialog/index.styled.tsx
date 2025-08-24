import { styled } from '@mui/material/styles'
import { Box, TextField } from '@mui/material'

export const InviteCodeContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '24px 0',
})

export const InviteCodeInput = styled(TextField)({
  width: '48px !important',
  '& .MuiInputBase-input': {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'Courier New, monospace',
    textTransform: 'uppercase',
    padding: '12px 8px',
    borderRadius: '8px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      borderWidth: '2px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#e53e3e',
    },
  },
})

export const ProjectPreviewContainer = styled(Box)({
  background: '#f7fafc',
  borderRadius: '12px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #e2e8f0',
})

export const ProjectPreviewHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
})

export const ProjectPreviewIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: '#667eea',
  borderRadius: '10px',
  color: 'white',
  fontWeight: 600,
  fontSize: '16px',
})

export const ProjectPreviewDetails = styled(Box)({
  flex: 1,
})

export const ProjectName = styled(Box)({
  fontSize: '18px',
  fontWeight: 600,
  color: '#2d3748',
  marginBottom: '4px',
})

export const ProjectStats = styled(Box)({
  fontSize: '14px',
  color: '#718096',
  display: 'flex',
  gap: '16px',
})

export const InstructionText = styled(Box)({
  textAlign: 'center',
  color: '#718096',
  fontSize: '14px',
  marginBottom: '8px',
})

export const LoadingContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
})
