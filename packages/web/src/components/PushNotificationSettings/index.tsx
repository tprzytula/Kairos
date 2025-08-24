import React from 'react';
import { 
  Box, 
  Switch, 
  FormControlLabel, 
  Typography, 
  Alert, 
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { PushNotificationContainer, StatusText, IconWrapper } from './index.styled';
import { IPushNotificationSettingsProps } from './types';

const PushNotificationSettings: React.FC<IPushNotificationSettingsProps> = ({ 
  title = "Push Notifications",
  description = "Get notified when new todo items are added to your projects"
}) => {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const handleToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        if (permission !== 'granted') {
          await requestPermission();
        }
        await subscribe();
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    }
  };

  if (!isSupported) {
    return (
      <PushNotificationContainer>
        <Card>
          <CardContent>
            <Alert severity="info">
              Push notifications are not supported in this browser.
            </Alert>
          </CardContent>
        </Card>
      </PushNotificationContainer>
    );
  }

  const getStatusText = () => {
    if (permission === 'denied') {
      return 'Notifications blocked by browser settings';
    }
    if (permission === 'granted' && isSubscribed) {
      return 'Notifications enabled';
    }
    if (permission === 'granted' && !isSubscribed) {
      return 'Notifications available but not enabled';
    }
    return 'Click to enable notifications';
  };

  const getStatusColor = (): 'success' | 'warning' | 'error' | 'info' => {
    if (permission === 'denied') return 'error';
    if (permission === 'granted' && isSubscribed) return 'success';
    if (permission === 'granted' && !isSubscribed) return 'warning';
    return 'info';
  };

  return (
    <PushNotificationContainer>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <IconWrapper>
                {isSubscribed ? <NotificationsIcon /> : <NotificationsOffIcon />}
              </IconWrapper>
              <Box>
                <Typography variant="h6" component="h3">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Box>
            </Box>
            
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControlLabel
                control={
                  <Switch
                    checked={isSubscribed}
                    onChange={handleToggle}
                    disabled={permission === 'denied' || isLoading}
                  />
                }
                label=""
              />
            )}
          </Box>
          
          <StatusText severity={getStatusColor()}>
            {getStatusText()}
          </StatusText>

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {permission === 'denied' && (
            <Alert severity="info" sx={{ mt: 1 }}>
              To enable notifications, please allow them in your browser settings and refresh the page.
            </Alert>
          )}
        </CardContent>
      </Card>
    </PushNotificationContainer>
  );
};

export default PushNotificationSettings;
