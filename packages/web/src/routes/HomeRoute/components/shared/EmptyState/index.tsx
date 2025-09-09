import React from 'react'
import { IEmptyStateProps } from './types'
import { StyledEmptyState } from './index.styled'

export const EmptyState: React.FC<IEmptyStateProps> = ({ children }) => {
  return <StyledEmptyState>{children}</StyledEmptyState>
}

export default EmptyState
