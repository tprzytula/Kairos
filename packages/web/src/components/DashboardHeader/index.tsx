import { DashboardHeaderContainer, DashboardHeaderCard, GreetingSection, GreetingText, DateText, UserSection } from './index.styled'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { useAuth } from 'react-oidc-context'
import UserMenu from '../UserMenu'

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
  const auth = useAuth()
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name
  
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
        
        {auth.user && (
          <UserSection>
            <UserMenu />
          </UserSection>
        )}
      </DashboardHeaderCard>
    </DashboardHeaderContainer>
  )
}

export default DashboardHeader