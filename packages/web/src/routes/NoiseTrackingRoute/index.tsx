import StandardLayout from '../../layout/standardLayout'
import { NoiseTrackingProvider, useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from '../../components/NoiseTrackingList'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ModernPageHeader from '../../components/ModernPageHeader'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Container, ScrollableContainer } from './index.styled'
import { useState, useCallback } from 'react'

const NoiseTrackingContent = () => {
  const { noiseTrackingItems } = useNoiseTrackingContext()
  
  // View mode state: 'grouped' or 'simple'
  const [viewMode, setViewMode] = useState<'grouped' | 'simple'>('grouped')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [areAllExpanded, setAreAllExpanded] = useState<boolean>(false)
  
  const calculateNoiseCounts = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const todayCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= today
    }).length
    
    const last7DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= sevenDaysAgo
    }).length
    
    const last30DaysCount = noiseTrackingItems.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= thirtyDaysAgo
    }).length
    
    return { todayCount, last7DaysCount, last30DaysCount }
  }
  
  const toggleAllGroups = useCallback(() => {
    setAreAllExpanded(prev => !prev)
  }, [])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grouped' ? 'simple' : 'grouped')
  }, [])
  
  const { todayCount, last7DaysCount, last30DaysCount } = calculateNoiseCounts()
  const totalItems = noiseTrackingItems.length
  
  const stats = [
    { value: totalItems, label: 'Total' },
    { value: todayCount, label: 'Today' },
    { value: last7DaysCount, label: 'Last 7 days' },
    { value: last30DaysCount, label: 'Last 30 days' }
  ]

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Noise Tracking"
        icon={<VolumeUpIcon />}
        stats={stats}
      />
      <Container>
        <ActionButtonsBar
          expandCollapseButton={{
            isExpanded: areAllExpanded,
            onToggle: toggleAllGroups,
            disabled: viewMode !== 'grouped' || noiseTrackingItems.length === 0,
          }}
          viewToggleButton={{
            children: viewMode === 'grouped' ? <ViewModuleIcon /> : <ViewListIcon />,
            onClick: toggleViewMode,
          }}
        />
        <ScrollableContainer>
          <NoiseTrackingList 
            viewMode={viewMode}
            expandedGroups={expandedGroups}
            setExpandedGroups={setExpandedGroups}
            areAllExpanded={areAllExpanded}
            setAreAllExpanded={setAreAllExpanded}
          />
        </ScrollableContainer>
      </Container>
    </StandardLayout>
  )
}

export const NoiseTrackingRoute = () => {
  return (
    <NoiseTrackingProvider>
      <NoiseTrackingContent />
    </NoiseTrackingProvider>
  )
}

export default NoiseTrackingRoute
