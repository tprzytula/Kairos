import React from 'react'
import { Tooltip } from '@mui/material'
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

export interface ActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  tooltip: string
  ariaLabel: string
  label?: string
}

export interface ModernPageHeaderProps {
  title: string
  icon: React.ReactNode
  stats?: Array<{
    value: string | number
    label: string
    wide?: boolean
  }>
  actionButton?: ActionButtonProps
  secondaryActionButton?: ActionButtonProps
}

const ActionButtonItem: React.FC<ActionButtonProps> = ({ icon, onClick, tooltip, ariaLabel, label }) => (
  <Tooltip title={tooltip}>
    <div
      onClick={onClick}
      role="button"
      aria-label={ariaLabel}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(102, 126, 234, 0.08)',
        borderRadius: '8px',
        padding: label ? '0.375rem 0.75rem' : '0.375rem',
        border: '1px solid rgba(102, 126, 234, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement
        target.style.background = 'rgba(102, 126, 234, 0.12)'
        target.style.borderColor = 'rgba(102, 126, 234, 0.25)'
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLDivElement
        target.style.background = 'rgba(102, 126, 234, 0.08)'
        target.style.borderColor = 'rgba(102, 126, 234, 0.15)'
      }}
    >
      <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
        {icon}
      </div>
      {label && (
        <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#667eea', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
    </div>
  </Tooltip>
)

const ModernPageHeader: React.FC<ModernPageHeaderProps> = ({
  title,
  icon,
  stats,
  actionButton,
  secondaryActionButton,
}) => {
  return (
    <HeaderWrapper>
      <HeaderCard>
        <HeaderContent>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              <HeaderIcon>
                {icon}
              </HeaderIcon>
              <HeaderTitle>{title}</HeaderTitle>
            </div>
            
            {(actionButton || secondaryActionButton) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {secondaryActionButton && <ActionButtonItem {...secondaryActionButton} />}
                {actionButton && <ActionButtonItem {...actionButton} />}
              </div>
            )}
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