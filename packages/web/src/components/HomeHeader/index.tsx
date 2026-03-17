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
  GreetingSection,
  GreetingText,
  DateText,
  RightSection,
  ProjectName,
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
        </BrandingSection>

        <GreetingSection>
          <HomeOutlinedIcon
            style={{
              fontSize: '1.1rem',
              padding: '0.25rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              gridArea: 'icon',
            }}
          />
          <GreetingText style={{ gridArea: 'greeting' }}>{getGreeting(userName)}</GreetingText>
          <DateText style={{ gridArea: 'date' }}>{formatDate()}</DateText>
        </GreetingSection>

        <RightSection>
          <ProjectName>
            {currentProject ? currentProject.name : 'Loading...'}
            {currentProject?.isPersonal && ' (Personal)'}
          </ProjectName>
          {auth.user && <UserMenu />}
        </RightSection>
      </HomeHeaderCard>
    </HomeHeaderContainer>
  )
}

export default HomeHeader
