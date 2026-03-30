import { useRef, ReactNode } from 'react'
import { CircularProgress } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Wrapper, ScrollArea, IndicatorContainer } from './index.styled'
import { usePullToRefresh, PULL_THRESHOLD } from './usePullToRefresh'

interface Props {
  children: ReactNode
  onRefresh?: () => Promise<void>
  scrollArea?: typeof ScrollArea
  sx?: SxProps<Theme>
}

export const ScrollableContainer = ({ children, onRefresh, scrollArea: ScrollAreaComponent = ScrollArea, sx }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pullDistance, isPulling, isRefreshing } = usePullToRefresh(containerRef, onRefresh)

  const contentOffset = isRefreshing ? PULL_THRESHOLD : pullDistance
  const transition = isPulling ? 'none' : 'transform 0.3s ease'

  return (
    <Wrapper>
      {onRefresh && (
        <IndicatorContainer>
          {isRefreshing ? (
            <CircularProgress size={24} />
          ) : (
            <ArrowDownwardIcon
              style={{
                opacity: pullDistance / PULL_THRESHOLD,
                transform: `rotate(${(pullDistance / PULL_THRESHOLD) * 180}deg)`,
                transition: 'opacity 0.1s, transform 0.1s',
              }}
            />
          )}
        </IndicatorContainer>
      )}
      <ScrollAreaComponent
        ref={containerRef}
        sx={sx}
        style={{
          transform: `translateY(${contentOffset}px)`,
          transition,
        }}
      >
        {children}
      </ScrollAreaComponent>
    </Wrapper>
  )
}
