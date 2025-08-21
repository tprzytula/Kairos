import React from 'react'
import { useVersion } from '../../hooks/useVersion'
import { 
  AppInfoCardContainer, 
  AppInfoCardContent, 
  AppBranding, 
  VersionText 
} from './index.styled'

const AppInfoCard: React.FC = () => {
  const { version } = useVersion()
  const displayVersion = version || '...'

  return (
    <AppInfoCardContainer>
      <AppInfoCardContent>
        <AppBranding>Kairos</AppBranding>
        <VersionText>{displayVersion}</VersionText>
      </AppInfoCardContent>
    </AppInfoCardContainer>
  )
}

export default AppInfoCard
