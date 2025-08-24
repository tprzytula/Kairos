import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Box
} from '@mui/material'
import { Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material'
import { useProjectContext } from '../../providers/ProjectProvider'
import { IJoinProjectDialogProps } from './types'
import { IProjectInviteInfo } from '../../types/project'
import * as Styled from './index.styled'

export const JoinProjectDialog: React.FC<IJoinProjectDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { joinProject, getProjectInviteInfo, projects } = useProjectContext()
  const [inviteCode, setInviteCode] = useState(['', '', '', '', '', ''])
  const [projectInfo, setProjectInfo] = useState<IProjectInviteInfo | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleClose = () => {
    setInviteCode(['', '', '', '', '', ''])
    setProjectInfo(null)
    setError('')
    setIsLoadingPreview(false)
    setIsJoining(false)
    onClose()
  }

  const handleInputChange = async (index: number, value: string) => {
    if (value.length > 1) {
      return
    }

    const newCode = [...inviteCode]
    newCode[index] = value.toUpperCase()
    setInviteCode(newCode)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    const fullCode = newCode.join('')
    if (fullCode.length === 6) {
      await fetchProjectPreview(fullCode)
    } else {
      setProjectInfo(null)
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !inviteCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (event.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (event.key === 'Enter' && isReadyToJoin()) {
      handleJoin()
    }
  }

  const handlePaste = async (event: React.ClipboardEvent) => {
    event.preventDefault()
    const pastedText = event.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    if (pastedText.length === 6) {
      const newCode = pastedText.split('')
      setInviteCode(newCode)
      setError('')
      
      inputRefs.current[5]?.focus()
      await fetchProjectPreview(pastedText)
    }
  }

  const fetchProjectPreview = async (code: string) => {
    if (code.length !== 6) {
      return
    }

    setIsLoadingPreview(true)
    setProjectInfo(null)
    setError('')

    try {
      const info = await getProjectInviteInfo(code)
      setProjectInfo(info)
    } catch (error) {
      setError('Invalid invite code. Please check and try again.')
      console.error('Failed to fetch project info:', error)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const validateJoin = (): string | null => {
    const fullCode = inviteCode.join('')
    
    if (fullCode.length !== 6) {
      return 'Please enter a complete 6-character invite code'
    }

    if (!projectInfo) {
      return 'Please wait for project information to load'
    }

    if (projects.length >= 5) {
      return 'You can only be a member of 5 projects maximum'
    }

    const alreadyMember = projects.some(project => project.id === projectInfo.id)
    if (alreadyMember) {
      return 'You are already a member of this project'
    }

    if (projectInfo.memberCount >= projectInfo.maxMembers) {
      return 'This project is full and cannot accept new members'
    }

    return null
  }

  const isReadyToJoin = (): boolean => {
    return inviteCode.join('').length === 6 && !!projectInfo && !isLoadingPreview
  }

  const handleJoin = async () => {
    const validationError = validateJoin()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsJoining(true)
    setError('')

    try {
      await joinProject({ inviteCode: inviteCode.join('') })
      
      if (onSuccess) {
        onSuccess()
      }
      
      handleClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join project')
    } finally {
      setIsJoining(false)
    }
  }

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [open])

  const isAtProjectLimit = projects.length >= 5

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Join Project
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter the 6-character invite code to join an existing project.
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isAtProjectLimit && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You have reached the maximum of 5 projects. Leave an existing project to join a new one.
            </Alert>
          )}

          <Styled.InstructionText>
            Enter invite code
          </Styled.InstructionText>

          <Styled.InviteCodeContainer>
            {inviteCode.map((char, index) => (
              <Styled.InviteCodeInput
                key={index}
                inputRef={(el: HTMLInputElement) => { inputRefs.current[index] = el }}
                value={char}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoadingPreview || isJoining || isAtProjectLimit}
                error={!!error && inviteCode.join('').length === 6}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center' }
                }}
                variant="outlined"
                size="medium"
              />
            ))}
          </Styled.InviteCodeContainer>

          {isLoadingPreview && (
            <Styled.LoadingContainer>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading project information...
              </Typography>
            </Styled.LoadingContainer>
          )}

          {projectInfo && !isLoadingPreview && (
            <Styled.ProjectPreviewContainer>
              <Styled.ProjectPreviewHeader>
                <Styled.ProjectPreviewIcon>
                  {projectInfo.name.charAt(0).toUpperCase()}
                </Styled.ProjectPreviewIcon>
                <Styled.ProjectPreviewDetails>
                  <Styled.ProjectName>
                    {projectInfo.name}
                  </Styled.ProjectName>
                  <Styled.ProjectStats>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon fontSize="small" />
                      {projectInfo.memberCount}/{projectInfo.maxMembers} members
                    </Box>
                    {projectInfo.ownerName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        Owner: {projectInfo.ownerName}
                      </Box>
                    )}
                  </Styled.ProjectStats>
                </Styled.ProjectPreviewDetails>
              </Styled.ProjectPreviewHeader>
            </Styled.ProjectPreviewContainer>
          )}

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
          disabled={isJoining}
        >
          Cancel
        </Button>
        <Button
          onClick={handleJoin}
          variant="contained"
          disabled={!isReadyToJoin() || isJoining || isAtProjectLimit}
          sx={{ 
            minWidth: 100,
            background: '#667eea',
            '&:hover': {
              background: '#5a67d8',
            }
          }}
        >
          {isJoining ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Join Project'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default JoinProjectDialog
