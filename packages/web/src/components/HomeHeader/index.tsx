import React from 'react'
import { useAuth } from 'react-oidc-context'
import UserMenu from '../UserMenu'
import {
  HomeHeaderContainer,
  HomeHeaderCard,
  GreetingSection,
  GreetingText,
  DateText,
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
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name

  return (
    <HomeHeaderContainer>
      <HomeHeaderCard>
        <GreetingSection>
          <GreetingText>{getGreeting(userName)}</GreetingText>
          <DateText>{formatDate()}</DateText>
        </GreetingSection>
        {auth.user && <UserMenu />}
      </HomeHeaderCard>
    </HomeHeaderContainer>
  )
}

export default HomeHeader
