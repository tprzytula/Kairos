import StandardLayout from '../../layout/standardLayout'
import { NoiseTrackingProvider, useNoiseTrackingContext } from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from '../../components/NoiseTrackingList'
import ActionButtonsBar from '../../components/ActionButtonsBar'
import ModernPageHeader from '../../components/ModernPageHeader'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Container, ScrollableContainer } from './index.styled'
import { useState, useCallback, useEffect, useRef } from 'react'

const NoiseTrackingContent = () => {
  const { noiseTrackingItems, isLoading } = useNoiseTrackingContext()
  
  const [viewMode, setViewMode] = useState<'grouped' | 'simple'>('grouped')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [shouldExpandAll, setShouldExpandAll] = useState(true)
  const hasInitializedRef = useRef(false)

  const groupByDate = (items: any[]) => {
    const grouped = items.reduce((acc, item) => {
      const date = new Date(item.timestamp).toDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(item)
      return acc
    }, {} as Record<string, any[]>)

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, items]) => ({ date, items }))
  }

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toDateString()) return 'Today'
    if (dateString === yesterday.toDateString()) return 'Yesterday'

    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' })
    const dateOnly = date.toLocaleDateString('en-GB', { 
      year: 'numeric', month: 'long', day: 'numeric'
    })
    return `${dateOnly} • ${dayName}`
  }

  useEffect(() => {
    if (!isLoading && noiseTrackingItems.length > 0 && expandedGroups.size === 0 && !hasInitializedRef.current) {
      const groupedItems = groupByDate(noiseTrackingItems)
      const expanded = groupedItems.slice(0, 2).map(({ date }) => getDateLabel(date))
      setExpandedGroups(new Set(expanded))
      hasInitializedRef.current = true
    }
  }, [isLoading, noiseTrackingItems.length])
  
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
    if (noiseTrackingItems.length === 0) return
    
    const groupedItems = groupByDate(noiseTrackingItems)
    const allGroupLabels = groupedItems.map(({ date }) => getDateLabel(date))
    
    setExpandedGroups(shouldExpandAll ? new Set(allGroupLabels) : new Set())
    setShouldExpandAll(!shouldExpandAll)
  }, [noiseTrackingItems, shouldExpandAll])

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
            isExpanded: !shouldExpandAll,
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
