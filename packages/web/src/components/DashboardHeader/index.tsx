import { DashboardHeaderContainer, DashboardHeaderCard, GreetingSection, GreetingText, DateText, AppBranding, BrandingSection, VersionText, UserSection, UserAvatar, BrandingInfo } from './index.styled'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonIcon from '@mui/icons-material/Person'
import { useVersion } from '../../hooks/useVersion'
import { useAuth } from 'react-oidc-context'

const getGreeting = (userName?: string): string => {
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return userName ? `${timeGreeting}, ${userName}` : timeGreeting
}

const formatDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

const DashboardHeader = () => {
  const { version } = useVersion()
  const auth = useAuth()
  
  const displayVersion = version || '...'
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name

  const handleLogout = () => {
    auth.signoutRedirect()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleLogout()
    }
  }
  
  return (
    <DashboardHeaderContainer>
      <DashboardHeaderCard>
        <GreetingSection>
          <HomeOutlinedIcon style={{ 
            fontSize: '1.1rem',
            padding: '0.25rem',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            gridArea: 'icon'
          }} />
          <GreetingText style={{ gridArea: 'greeting' }}>{getGreeting(userName)}</GreetingText>
          <DateText style={{ gridArea: 'date' }}>{formatDate()}</DateText>
        </GreetingSection>
        
        <BrandingSection>
          <BrandingInfo>
            <AppBranding>Kairos</AppBranding>
            <VersionText>
              {displayVersion}
            </VersionText>
          </BrandingInfo>
          
          {auth.user && (
            <UserSection>
              <UserAvatar 
                onClick={handleLogout} 
                onKeyDown={handleKeyDown}
                role="button" 
                tabIndex={0} 
                title="Click to log out"
              >
                {auth.user.profile?.picture ? (
                  <img src={auth.user.profile.picture} alt="Profile" />
                ) : (
                  <PersonIcon />
                )}
              </UserAvatar>
            </UserSection>
          )}
        </BrandingSection>
      </DashboardHeaderCard>
    </DashboardHeaderContainer>
  )
}

export default DashboardHeader