import WifiOffIcon from '@mui/icons-material/WifiOff'
import WifiIcon from '@mui/icons-material/Wifi'
import CloseIcon from '@mui/icons-material/Close'
import { useInternetConnectivity } from '../../hooks/useInternetConnectivity'
import { useEffect, useState } from 'react'
import {
  AnimatedNotificationContainer,
  NotificationCard,
  NotificationContent,
  IconWrapper,
  NotificationText,
  CloseButton
} from './index.styled'

const ConnectivityNotification = () => {
  const { isOnline, wasOffline, resetOfflineState } = useInternetConnectivity()
  const [showReconnectedNotification, setShowReconnectedNotification] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnectedNotification(true)
      setIsExiting(false)

      const timer = setTimeout(() => {
        handleCloseReconnected()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  const handleCloseReconnected = () => {
    setIsExiting(true)
    setTimeout(() => {
      setShowReconnectedNotification(false)
      setIsExiting(false)
      resetOfflineState()
    }, 300)
  }

    if (!isOnline) {
    return (
        <AnimatedNotificationContainer>
             <NotificationCard severity="error">
              <NotificationContent>
                 <IconWrapper>
                  <WifiOffIcon />
                 </IconWrapper>
                 <NotificationText>
                  Offline
                 </NotificationText>
              </NotificationContent>
             </NotificationCard>
        </AnimatedNotificationContainer>
      );
  }

  if (showReconnectedNotification) {
    return (
        <AnimatedNotificationContainer className={isExiting ? 'exit' : ''}>
        <NotificationCard 
          severity="success" 
          onClick={handleCloseReconnected}
        >
          <NotificationContent>
            <IconWrapper>
              <WifiIcon />
            </IconWrapper>
            <NotificationText>
              Connection restored
            </NotificationText>
            <CloseButton 
              role="button"
              aria-label="Close notification"
              onClick={(e) => {
                e.stopPropagation()
                handleCloseReconnected()
              }}
            >
              <CloseIcon />
            </CloseButton>
          </NotificationContent>
        </NotificationCard>
      </AnimatedNotificationContainer> 
    )
  }

  return null;
}

export default ConnectivityNotification