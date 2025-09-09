import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { INoiseDetailViewProps } from './types'
import {
  NoiseDetailHeader,
  NoiseDetailTitle,
  NoiseBackButton,
  NoiseDetailList,
  NoiseDetailItem,
  NoiseDetailDate,
  NoiseDetailTime,
  NoiseDetailEmpty
} from './index.styled'

export const NoiseDetailView: React.FC<INoiseDetailViewProps> = ({
  items,
  viewTitle,
  onBackClick,
  formatTimestamp
}) => {
  return (
    <div>
      <NoiseDetailHeader>
        <NoiseDetailTitle>{viewTitle}</NoiseDetailTitle>
        <NoiseBackButton onClick={onBackClick}>
          <ArrowBackIcon fontSize="small" />
          Back
        </NoiseBackButton>
      </NoiseDetailHeader>
      
      {items.length > 0 ? (
        <NoiseDetailList>
          {items.map((item, index) => {
            const { date, time } = formatTimestamp(item.timestamp)
            return (
              <NoiseDetailItem key={`${item.timestamp}-${index}`}>
                <NoiseDetailDate>{date}</NoiseDetailDate>
                <NoiseDetailTime>{time}</NoiseDetailTime>
              </NoiseDetailItem>
            )
          })}
        </NoiseDetailList>
      ) : (
        <NoiseDetailEmpty>
          No recordings found for {viewTitle.toLowerCase()}
        </NoiseDetailEmpty>
      )}
    </div>
  )
}

export default NoiseDetailView
