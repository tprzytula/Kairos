import { Button, Box, Typography, Chip } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import { usePWAUpdate } from '../../hooks/usePWAUpdate'

// This component is useful for testing PWA updates in development
export const PWAUpdateTester = () => {
  const {
    isUpdateAvailable,
    isUpdating,
    updateError,
    isOnline,
    checkForUpdate,
    installUpdate,
    dismissUpdate
  } = usePWAUpdate()

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 2,
        minWidth: 200,
        zIndex: 1000
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        PWA Update Status
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip
          icon={isOnline ? <CheckCircleIcon /> : <CloudOffIcon />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'default'}
          size="small"
        />
        
        {isUpdateAvailable && (
          <Chip
            icon={<RefreshIcon />}
            label="Update Available"
            color="info"
            size="small"
          />
        )}
        
        {updateError && (
          <Chip
            icon={<ErrorIcon />}
            label="Update Error"
            color="error"
            size="small"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={checkForUpdate}
          disabled={isUpdating || !isOnline}
          startIcon={<RefreshIcon />}
        >
          Check for Updates
        </Button>
        
        {isUpdateAvailable && (
          <>
            <Button
              size="small"
              variant="contained"
              onClick={installUpdate}
              disabled={isUpdating}
              color="primary"
            >
              {isUpdating ? 'Installing...' : 'Install Update'}
            </Button>
            
            <Button
              size="small"
              variant="text"
              onClick={dismissUpdate}
              disabled={isUpdating}
            >
              Dismiss
            </Button>
          </>
        )}
      </Box>
      
      {updateError && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {updateError}
        </Typography>
      )}
    </Box>
  )
}

export default PWAUpdateTester