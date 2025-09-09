import React from 'react'
import SectionCard from '../../../../components/SectionCard'
import HomeNoiseItemPlaceholder from '../HomeNoiseItemPlaceholder'
import NoiseStatsOverview from './components/NoiseStatsOverview'
import NoiseDetailView from './components/NoiseDetailView'
import EmptyState from '../shared/EmptyState'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { INoiseSectionProps } from './types'
import { formatNoiseTimestamp } from '../../../../utils/dateTime'
import { INoiseTrackingItem } from '../../../../api/noiseTracking'

const getFilteredNoiseItems = (noiseTrackingItems: INoiseTrackingItem[], view: string) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (view) {
    case 'today':
      return noiseTrackingItems.filter(item => {
        const itemDate = new Date(item.timestamp)
        return itemDate >= today
      })
    case 'last7days':
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return noiseTrackingItems.filter(item => {
        const itemDate = new Date(item.timestamp)
        return itemDate >= sevenDaysAgo
      })
    case 'last30days':
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return noiseTrackingItems.filter(item => {
        const itemDate = new Date(item.timestamp)
        return itemDate >= thirtyDaysAgo
      })
    default:
      return []
  }
}

const getNoiseViewTitle = (view: string): string => {
  switch (view) {
    case 'today': return 'Today\'s Recordings'
    case 'last7days': return 'Last 7 Days'
    case 'last30days': return 'Last 30 Days'
    default: return 'Recordings'
  }
}

export const NoiseSection: React.FC<INoiseSectionProps> = ({
  noiseTrackingItems,
  noiseCounts,
  isLoading,
  noiseView,
  onNoiseViewChange
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <HomeNoiseItemPlaceholder key={index} />
          ))}
        </div>
      )
    }

    if (noiseView === 'overview') {
      if (noiseCounts.totalCount === 0) {
        return <EmptyState>No noise recordings found</EmptyState>
      }

      return (
        <NoiseStatsOverview
          noiseCounts={noiseCounts}
          onNoiseViewChange={onNoiseViewChange}
        />
      )
    }

    const filteredItems = getFilteredNoiseItems(noiseTrackingItems, noiseView)
    const sortedItems = filteredItems.sort((a, b) => b.timestamp - a.timestamp)
    const viewTitle = getNoiseViewTitle(noiseView)

    return (
      <NoiseDetailView
        items={sortedItems}
        viewTitle={viewTitle}
        onBackClick={() => onNoiseViewChange('overview')}
        formatTimestamp={formatNoiseTimestamp}
      />
    )
  }

  return (
    <SectionCard
      icon={VolumeUpIcon}
      title="Noise Recordings"
      count={noiseCounts.totalCount}
    >
      {renderContent()}
    </SectionCard>
  )
}

export default NoiseSection
