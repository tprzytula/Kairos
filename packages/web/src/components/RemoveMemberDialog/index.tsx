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
import { IRemoveMemberDialogProps } from './types'

export const RemoveMemberDialog: React.FC<IRemoveMemberDialogProps> = ({
  open,
  memberName,
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
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Remove Member</DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to remove <strong>{memberName}</strong> from this
          project? They will lose access to all data in this project.
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
            'Remove'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveMemberDialog
