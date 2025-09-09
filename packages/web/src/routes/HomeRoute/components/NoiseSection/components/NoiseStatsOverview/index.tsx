import React from 'react'
import { INoiseStatsOverviewProps } from './types'
import { NoiseStats, NoiseStatBlock, NoiseStatCount, NoiseStatLabel } from './index.styled'

export const NoiseStatsOverview: React.FC<INoiseStatsOverviewProps> = ({
  noiseCounts,
  onNoiseViewChange
}) => {
  return (
    <NoiseStats>
      <NoiseStatBlock onClick={() => onNoiseViewChange('today')}>
        <NoiseStatCount>{noiseCounts.todayCount}</NoiseStatCount>
        <NoiseStatLabel>Today</NoiseStatLabel>
      </NoiseStatBlock>
      <NoiseStatBlock onClick={() => onNoiseViewChange('last7days')}>
        <NoiseStatCount>{noiseCounts.last7DaysCount}</NoiseStatCount>
        <NoiseStatLabel>Last 7 days</NoiseStatLabel>
      </NoiseStatBlock>
      <NoiseStatBlock onClick={() => onNoiseViewChange('last30days')}>
        <NoiseStatCount>{noiseCounts.last30DaysCount}</NoiseStatCount>
        <NoiseStatLabel>Last 30 days</NoiseStatLabel>
      </NoiseStatBlock>
    </NoiseStats>
  )
}

export default NoiseStatsOverview
