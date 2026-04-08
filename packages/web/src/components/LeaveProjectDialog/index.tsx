import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'
import { ILeaveProjectDialogProps } from './types'

export const LeaveProjectDialog: React.FC<ILeaveProjectDialogProps> = ({
  open,
  projectName,
  onClose,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setError('')
    setIsLoading(false)
    onClose()
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError('')

    try {
      await onConfirm()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Leave Project</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to leave <strong>{projectName}</strong>? You
          will lose access to all data in this project. You can rejoin later
          using an invite code.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Leave Project'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeaveProjectDialog
