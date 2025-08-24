import React from 'react'
import { Divider } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import * as Styled from './index.styled'
import PushNotificationSettings from '../PushNotificationSettings'

interface NotificationSettingsSubpageProps {
  onBack: () => void
}

const NotificationSettingsSubpage: React.FC<NotificationSettingsSubpageProps> = ({
  onBack
}) => {
  return (
    <>
      <Styled.SubpageHeader>
        <Styled.BackButton onClick={onBack}>
          <ArrowBackIcon fontSize="small" />
        </Styled.BackButton>
        <Styled.SubpageTitle>Notification Settings</Styled.SubpageTitle>
      </Styled.SubpageHeader>

      <Divider sx={{ my: 1 }} />

      <PushNotificationSettings />
    </>
  )
}

export default NotificationSettingsSubpage
