import { styled } from '@mui/material/styles';
import { Box, Alert } from '@mui/material';

export const PushNotificationContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

export const StatusText = styled(Alert)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(0.5, 1),
  '& .MuiAlert-message': {
    padding: 0,
  },
}));
