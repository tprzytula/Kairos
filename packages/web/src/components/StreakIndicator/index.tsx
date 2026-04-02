import { useEffect, useState } from 'react'
import { StreakBadge } from './index.styled'
import { StreakIndicatorProps } from './types'

const AUTO_HIDE_MS = 2000

const StreakIndicator = ({ count, visible }: StreakIndicatorProps): React.ReactElement | null => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible && count >= 3) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), AUTO_HIDE_MS)
      return () => clearTimeout(timer)
    }
    setShow(false)
  }, [visible, count])

  if (!show) return null

  return (
    <StreakBadge key={count}>
      <span className="streak-icon">⚡</span>
      x{count}
    </StreakBadge>
  )
}

export default StreakIndicator
