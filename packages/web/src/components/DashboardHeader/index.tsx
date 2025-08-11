import { DashboardHeaderContainer, DashboardHeaderCard, GreetingSection, GreetingText, DateText, AppBranding, BrandingSection, VersionText } from './index.styled'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const formatDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

const DashboardHeader = () => {
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
          <GreetingText style={{ gridArea: 'greeting' }}>{getGreeting()}</GreetingText>
          <DateText style={{ gridArea: 'date' }}>{formatDate()}</DateText>
        </GreetingSection>
        <BrandingSection>
          <AppBranding>Kairos</AppBranding>
          <VersionText>
            <FiberManualRecordIcon style={{ fontSize: '6px', margin: '0 0.25rem' }} />
            Online
          </VersionText>
        </BrandingSection>
      </DashboardHeaderCard>
    </DashboardHeaderContainer>
  )
}

export default DashboardHeader