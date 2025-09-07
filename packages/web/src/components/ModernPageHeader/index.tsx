import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
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
  actionButton?: {
    icon: React.ReactNode
    onClick: () => void
    tooltip: string
    ariaLabel: string
  }
}

const ModernPageHeader: React.FC<ModernPageHeaderProps> = ({
  title,
  icon,
  stats,
  actionButton
}) => {
  return (
    <HeaderWrapper>
      <HeaderCard>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <HeaderIcon>
              {icon}
            </HeaderIcon>
            <HeaderTitle>{title}</HeaderTitle>
          </div>
          
          {actionButton && (
            <Tooltip title={actionButton.tooltip}>
              <IconButton
                onClick={actionButton.onClick}
                aria-label={actionButton.ariaLabel}
                size="medium"
                style={{ marginLeft: 'auto' }}
              >
                {actionButton.icon}
              </IconButton>
            </Tooltip>
          )}
          
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