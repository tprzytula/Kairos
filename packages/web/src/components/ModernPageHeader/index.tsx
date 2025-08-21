import React from 'react'
import { 
  HeaderWrapper,
  HeaderCard, 
  HeaderContent, 
  HeaderTitle, 
  HeaderIcon, 
  HeaderStats,
  StatItem,
  StatValue,
  StatLabel 
} from './index.styled'

export interface ModernPageHeaderProps {
  title: string
  icon: React.ReactNode
  stats?: Array<{
    value: string | number
    label: string
    wide?: boolean
  }>
}

const ModernPageHeader: React.FC<ModernPageHeaderProps> = ({
  title,
  icon,
  stats
}) => {
  return (
    <HeaderWrapper>
      <HeaderCard>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HeaderIcon>
              {icon}
            </HeaderIcon>
            <HeaderTitle>{title}</HeaderTitle>
          </div>
          
          {stats && stats.length > 0 && (
            <HeaderStats>
              {stats.map((stat, index) => (
                <StatItem key={index} wide={stat.wide}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </HeaderStats>
          )}
        </HeaderContent>
      </HeaderCard>
    </HeaderWrapper>
  )
}

export default ModernPageHeader