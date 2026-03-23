import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export interface SegmentedControlTab<T extends string = string> {
  id: T
  label: string
  icon?: React.ReactNode
  activeColor: string
  activeBg: string
  activeShadow: string
}

const SegmentedControlContainer = styled(Box)({
  display: 'flex',
  background: 'rgba(0, 0, 0, 0.06)',
  borderRadius: '14px',
  padding: '4px',
  gap: '4px',
  width: '100%',
})

interface ISegmentProps {
  active: boolean
  activeColor: string
  activeBg: string
  activeShadow: string
  collapseInactive?: boolean
}

const Segment = styled(Box, {
  shouldForwardProp: p => !['active', 'activeColor', 'activeBg', 'activeShadow', 'collapseInactive'].includes(p as string),
})<ISegmentProps>(({ active, activeColor, activeBg, activeShadow, collapseInactive }) => ({
  flex: collapseInactive && !active ? '0 0 auto' : 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: collapseInactive && !active ? '10px 12px' : '10px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '0.9rem',
  userSelect: 'none',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  whiteSpace: 'nowrap',
  ...(active
    ? {
        background: activeBg,
        color: activeColor,
        boxShadow: `0 2px 8px ${activeShadow}, 0 1px 3px rgba(0,0,0,0.08)`,
      }
    : {
        background: 'transparent',
        color: 'rgba(0, 0, 0, 0.45)',
        '&:hover': {
          background: 'rgba(255,255,255,0.5)',
          color: 'rgba(0, 0, 0, 0.7)',
        },
      }),
}))

interface SegmentedControlProps<T extends string = string> {
  tabs: Array<SegmentedControlTab<T>>
  activeTab: T
  onChange: (id: T) => void
  collapseInactive?: boolean
}

const SegmentedControl = <T extends string = string>({
  tabs,
  activeTab,
  onChange,
  collapseInactive,
}: SegmentedControlProps<T>) => {
  return (
    <SegmentedControlContainer>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <Segment
            key={tab.id}
            active={isActive}
            activeColor={tab.activeColor}
            activeBg={tab.activeBg}
            activeShadow={tab.activeShadow}
            collapseInactive={collapseInactive}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon}
            {(!collapseInactive || isActive) && tab.label}
          </Segment>
        )
      })}
    </SegmentedControlContainer>
  )
}

export default SegmentedControl
