import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { useAuth } from 'react-oidc-context'
import { useVersion } from '../../hooks/useVersion'
import { useProjectContext } from '../../providers/ProjectProvider'
import UserMenu from '../UserMenu'
import {
  HomeHeaderContainer,
  HomeHeaderCard,
  BrandingSection,
  AppBranding,
  VersionText,
  ProjectName,
  GreetingSection,
  GreetingRow,
  GreetingText,
  DateText,
  AvatarSection,
} from './index.styled'

const getGreeting = (userName?: string): string => {
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return userName ? `${timeGreeting}, ${userName}` : timeGreeting
}

const formatDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

const HomeHeader: React.FC = () => {
  const auth = useAuth()
  const { version } = useVersion()
  const { currentProject } = useProjectContext()
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name
  const displayVersion = version || '...'

  return (
    <HomeHeaderContainer>
      <HomeHeaderCard>
        <BrandingSection>
          <AppBranding>Kairos</AppBranding>
          <VersionText>{displayVersion}</VersionText>
          {currentProject && (
            <ProjectName title={currentProject.name}>
              {currentProject.name}
              {currentProject.isPersonal && ' (Personal)'}
            </ProjectName>
          )}
        </BrandingSection>

        <GreetingSection>
          <GreetingRow>
            <HomeOutlinedIcon
              style={{
                fontSize: '1rem',
                padding: '0.22rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            />
            <GreetingText>{getGreeting(userName)}</GreetingText>
          </GreetingRow>
          <DateText>{formatDate()}</DateText>
        </GreetingSection>

        <AvatarSection>
          {auth.user && <UserMenu />}
        </AvatarSection>
      </HomeHeaderCard>
    </HomeHeaderContainer>
  )
}

export default HomeHeader
