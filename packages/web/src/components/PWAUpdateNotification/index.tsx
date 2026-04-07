import { Button, Snackbar, Alert, AlertTitle, Box, CircularProgress } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import { usePWAUpdate } from '../../hooks/usePWAUpdate'
import {
  UpdateSnackbar,
  UpdateAlert,
  UpdateButton,
  DismissButton,
  OfflineNotice,
} from './index.styled'

export const PWAUpdateNotification = () => {
  const {
    isUpdateAvailable,
    isUpdating,
    updateError,
    isOnline,
    installUpdate,
    dismissUpdate,
    checkForUpdate,
    clearError,
  } = usePWAUpdate()

  if (!isUpdateAvailable && !updateError) {
    return null
  }

  return (
    <>
      {/* Update Available Notification */}
      <UpdateSnackbar
        open={isUpdateAvailable}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <UpdateAlert
          severity="info"
          variant="filled"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <UpdateButton
                color="inherit"
                size="small"
                onClick={installUpdate}
                disabled={isUpdating || !isOnline}
                startIcon={
                  isUpdating ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <RefreshIcon />
                  )
                }
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </UpdateButton>
              <DismissButton
                color="inherit"
                size="small"
                onClick={dismissUpdate}
                disabled={isUpdating}
                aria-label="Dismiss update"
              >
                <CloseIcon fontSize="small" />
              </DismissButton>
            </Box>
          }
        >
          <AlertTitle>New Version Available!</AlertTitle>
          A new version of Kairos is ready to install.
          {!isOnline && (
            <OfflineNotice>
              You're offline. Update will install when online.
            </OfflineNotice>
          )}
        </UpdateAlert>
      </UpdateSnackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!updateError}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                checkForUpdate().catch(() => {})
              }}
              disabled={!isOnline}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Update Failed</AlertTitle>
          {updateError}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PWAUpdateNotification
