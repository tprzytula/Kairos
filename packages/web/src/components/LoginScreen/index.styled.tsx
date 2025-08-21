import { styled } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'

export const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
}))

export const WelcomeCard = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '32px',
  padding: '48px 32px',
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  
  [theme.breakpoints.down('sm')]: {
    padding: '32px 24px',
    borderRadius: '24px',
  },
}))

export const AppIcon = styled(Box)({
  width: '64px',
  height: '64px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  margin: '0 auto 24px',
})

export const WelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 700,
  color: '#667eea',
  margin: '0 0 8px',
  lineHeight: 1.2,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}))

export const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  color: '#6b7280',
  margin: '0 0 16px',
  lineHeight: 1.4,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
}))

export const WelcomeDescription = styled(Typography)({
  fontSize: '14px',
  color: '#9ca3af',
  margin: '0 0 32px',
  lineHeight: 1.5,
})

export const FeatureList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '32px',
})

export const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textAlign: 'left',
})

export const FeatureIcon = styled(Box)({
  fontSize: '16px',
  width: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const FeatureText = styled(Typography)({
  fontSize: '14px',
  color: '#374151',
  fontWeight: 500,
})

export const GoogleButton = styled(Button)({
  width: '100%',
  background: '#4285f4',
  color: 'white',
  border: 'none',
  borderRadius: '24px',
  padding: '16px 24px',
  fontSize: '16px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginBottom: '16px',
  textTransform: 'none',
  
  '&:hover': {
    background: '#3367d6',
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 16px rgba(66, 133, 244, 0.3)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
})

export const GoogleIcon = styled(Box)({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  borderRadius: '4px',
  padding: '2px',
})

export const GoogleButtonText = styled(Typography)({
  fontSize: '16px',
  fontWeight: 500,
})

export const SecurityText = styled(Typography)({
  fontSize: '12px',
  color: '#9ca3af',
  margin: 0,
  lineHeight: 1.4,
})
