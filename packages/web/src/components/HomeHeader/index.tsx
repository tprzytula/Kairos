import React, { useState, useRef, useCallback } from 'react'
import { useAuth } from 'react-oidc-context'
import UserMenu from '../UserMenu'
import Fireworks from './Fireworks'
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

interface FireworkItem {
  id: number
  x: number
  y: number
}

const HomeHeader: React.FC = () => {
  const auth = useAuth()
  const userName = auth.user?.profile?.given_name || auth.user?.profile?.name
  const [fireworks, setFireworks] = useState<FireworkItem[]>([])
  const counterRef = useRef(0)

  const handleClick = useCallback((event: React.MouseEvent) => {
    const id = ++counterRef.current
    setFireworks(prev => [...prev, { id, x: event.clientX, y: event.clientY }])
  }, [])

  const handleComplete = useCallback((id: number) => {
    setFireworks(prev => prev.filter(fw => fw.id !== id))
  }, [])

  return (
    <HomeHeaderContainer onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <HomeHeaderCard>
        <GreetingSection>
          <GreetingText>{getGreeting(userName)}</GreetingText>
          <DateText>{formatDate()}</DateText>
        </GreetingSection>
        {auth.user && <UserMenu />}
      </HomeHeaderCard>
      {fireworks.map(fw => (
        <Fireworks
          key={fw.id}
          x={fw.x}
          y={fw.y}
          onComplete={() => handleComplete(fw.id)}
        />
      ))}
    </HomeHeaderContainer>
  )
}

export default HomeHeader
