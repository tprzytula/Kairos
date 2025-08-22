import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Box
} from '@mui/material'
import { useProjectContext } from '../../providers/ProjectProvider'
import { ICreateProjectDialogProps } from './types'

export const CreateProjectDialog: React.FC<ICreateProjectDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { createProject, projects } = useProjectContext()
  const [projectName, setProjectName] = useState('')
  const [maxMembers, setMaxMembers] = useState('5')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setProjectName('')
    setMaxMembers('5')
    setError('')
    setIsLoading(false)
    onClose()
  }

  const validateForm = (): boolean => {
    setError('')

    if (!projectName.trim()) {
      setError('Project name is required')
      return false
    }

    if (projectName.trim().length < 2) {
      setError('Project name must be at least 2 characters')
      return false
    }

    if (projectName.trim().length > 50) {
      setError('Project name must be less than 50 characters')
      return false
    }

    const maxMembersNum = parseInt(maxMembers)
    if (isNaN(maxMembersNum) || maxMembersNum < 1 || maxMembersNum > 20) {
      setError('Max members must be between 1 and 20')
      return false
    }

    if (projects.length >= 5) {
      setError('You can only have a maximum of 5 projects')
      return false
    }

    const nameExists = projects.some(
      project => project.name.toLowerCase() === projectName.trim().toLowerCase()
    )
    if (nameExists) {
      setError('A project with this name already exists')
      return false
    }

    return true
  }

  const handleCreate = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const newProject = await createProject({
        name: projectName.trim(),
        maxMembers: parseInt(maxMembers)
      })

      if (onSuccess) {
        onSuccess(newProject)
      }
      
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      handleCreate()
    }
  }

  const isAtProjectLimit = projects.length >= 5

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          Create New Project
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create a new project to organize your grocery lists, todos, and noise tracking separately.
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isAtProjectLimit && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You have reached the maximum of 5 projects. Delete an existing project to create a new one.
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isAtProjectLimit}
            placeholder="e.g., Family Groceries, Work Planning"
            helperText="Choose a descriptive name for your project"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Maximum Members"
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isAtProjectLimit}
            inputProps={{ min: 1, max: 20 }}
            helperText="How many people can join this project (1-20)"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={isLoading || isAtProjectLimit || !projectName.trim()}
          sx={{ 
            minWidth: 100,
            background: '#667eea',
            '&:hover': {
              background: '#5a67d8',
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Create Project'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateProjectDialog
