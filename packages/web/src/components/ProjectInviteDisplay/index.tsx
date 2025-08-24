import React, { useState, useCallback } from 'react'
import { 
  ContentCopy as CopyIcon, 
  WhatsApp as WhatsAppIcon,
  Message as SmsIcon,
  Share as ShareIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import { IProjectInviteDisplayProps, IShareOption } from './types'
import * as Styled from './index.styled'

export const ProjectInviteDisplay: React.FC<IProjectInviteDisplayProps> = ({
  inviteCode,
  projectName,
  onCopySuccess,
  onShareSuccess,
  compact = false
}) => {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  // Early return if invite code is null or undefined
  if (inviteCode == null) {
    return null
  }

  const handleCopy = useCallback(async () => {
    if (!inviteCode || inviteCode.trim() === '') {
      console.error('No invite code to copy')
      return
    }
    
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      if (onCopySuccess) {
        onCopySuccess()
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [inviteCode, onCopySuccess])

  const shareOptions: IShareOption[] = [
    {
      label: 'WhatsApp',
      icon: <WhatsAppIcon fontSize="small" />,
      color: '#25D366',
      action: (code: string, name: string) => {
        const message = encodeURIComponent(
          `Join my "${name}" project on Kairos! Use invite code: ${code}`
        )
        window.open(`https://wa.me/?text=${message}`, '_blank')
      },
    },
    {
      label: 'SMS',
      icon: <SmsIcon fontSize="small" />,
      color: '#2563eb',
      action: (code: string, name: string) => {
        const message = encodeURIComponent(
          `Join my "${name}" project on Kairos! Use invite code: ${code}`
        )
        window.open(`sms:?body=${message}`, '_blank')
      },
    },
    {
      label: 'Share',
      icon: <ShareIcon fontSize="small" />,
      color: '#6b7280',
      action: async (code: string, name: string) => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: `Join my ${name} project`,
              text: `Join my "${name}" project on Kairos! Use invite code: ${code}`,
            })
          } catch (error) {
            console.error('Share failed:', error)
          }
        } else {
          await navigator.clipboard.writeText(
            `Join my "${name}" project on Kairos! Use invite code: ${code}`
          )
        }
      },
    },
  ]

  const handleShare = useCallback(async (shareOption: IShareOption) => {
    if (!inviteCode || inviteCode.trim() === '') {
      console.error('No invite code to share')
      return
    }
    
    setSharing(true)
    try {
      await shareOption.action(inviteCode, projectName || 'Project')
      if (onShareSuccess) {
        onShareSuccess()
      }
    } catch (error) {
      console.error('Share failed:', error)
    } finally {
      setTimeout(() => setSharing(false), 1000)
    }
  }, [inviteCode, projectName, onShareSuccess])

  const renderInviteCode = () => {
    const code = inviteCode || ''
    return (
      <Styled.InviteCodeContainer compact={compact}>
        {code.toUpperCase().split('').map((digit, index) => (
          <Styled.InviteCodeDigit key={index} compact={compact}>
            {digit}
          </Styled.InviteCodeDigit>
        ))}
      </Styled.InviteCodeContainer>
    )
  }

  const renderActions = () => (
    <Styled.ActionsContainer>
      <Styled.CopyButton
        onClick={handleCopy}
        disabled={sharing}
        className={copied ? 'copied' : ''}
        startIcon={copied ? <CheckIcon /> : <CopyIcon />}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Styled.CopyButton>

      <Styled.ShareButtonsContainer>
        {shareOptions.map((option) => (
          <Styled.ShareButton
            key={option.label}
            onClick={() => handleShare(option)}
            disabled={sharing}
            buttonColor={option.color}
            title={`Share via ${option.label}`}
          >
            {option.icon}
          </Styled.ShareButton>
        ))}
      </Styled.ShareButtonsContainer>
    </Styled.ActionsContainer>
  )

  if (compact) {
    return (
      <Styled.CompactContainer>
        {renderInviteCode()}
        <Styled.CompactActionsContainer>
          {renderActions()}
        </Styled.CompactActionsContainer>
      </Styled.CompactContainer>
    )
  }

  return (
    <Styled.InviteDisplayContainer>
      <Styled.InviteDisplayHeader>
        <Styled.InviteLabel>Invite Code</Styled.InviteLabel>
      </Styled.InviteDisplayHeader>

      {renderInviteCode()}

      {renderActions()}

      <Styled.QuickCopyText>
        Share this code with others to invite them to your project
      </Styled.QuickCopyText>
    </Styled.InviteDisplayContainer>
  )
}

export default ProjectInviteDisplay
