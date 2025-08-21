import { Button, Snackbar, Alert, AlertTitle, Box, CircularProgress } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloseIcon from '@mui/icons-material/Close'
import { usePWAUpdate } from '../../hooks/usePWAUpdate'

export const PWAUpdateNotification = () => {
  const {
    isUpdateAvailable,
    isUpdating,
    updateError,
    isOnline,
    installUpdate,
    dismissUpdate,
    checkForUpdate
  } = usePWAUpdate()

  if (!isUpdateAvailable && !updateError) {
    return null
  }

  return (
    <>
      {/* Update Available Notification */}
      <Snackbar
        open={isUpdateAvailable}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          top: { xs: 16, sm: 24 },
          zIndex: 9999
        }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ 
            width: '100%',
            maxWidth: '500px'
          }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
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
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={dismissUpdate}
                disabled={isUpdating}
                sx={{ 
                  minWidth: 'auto',
                  p: 1
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            </Box>
          }
        >
          <AlertTitle>New Version Available!</AlertTitle>
          A new version of Kairos is ready to install.
          {!isOnline && (
            <Box sx={{ mt: 1, fontSize: '0.875rem', opacity: 0.8 }}>
              You're offline. Update will install when online.
            </Box>
          )}
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!updateError}
        autoHideDuration={6000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => checkForUpdate()}
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