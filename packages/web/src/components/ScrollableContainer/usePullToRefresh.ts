import { useEffect, useRef, useState } from 'react'

export const PULL_THRESHOLD = 80
const MIN_REFRESH_MS = 1000

export const usePullToRefresh = (
  containerRef: React.RefObject<HTMLElement | null>,
  onRefresh: (() => Promise<void>) | undefined
) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const startYRef = useRef(0)
  const pullDistanceRef = useRef(0)
  const isPullingRef = useRef(false)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !onRefresh) return

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop !== 0 || isRefreshingRef.current) return
      startYRef.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      if (isRefreshingRef.current) return

      const deltaY = e.touches[0].clientY - startYRef.current

      if (isPullingRef.current && el.scrollTop > 0) {
        isPullingRef.current = false
        pullDistanceRef.current = 0
        setIsPulling(false)
        setPullDistance(0)
        return
      }

      if (deltaY <= 0 || el.scrollTop > 0) return

      e.preventDefault()
      const capped = Math.min(deltaY, PULL_THRESHOLD)
      isPullingRef.current = true
      pullDistanceRef.current = capped
      setIsPulling(true)
      setPullDistance(capped)
    }

    const onTouchEnd = () => {
      if (!isPullingRef.current) return

      const distance = pullDistanceRef.current
      isPullingRef.current = false
      setIsPulling(false)

      if (distance < PULL_THRESHOLD) {
        pullDistanceRef.current = 0
        setPullDistance(0)
        return
      }

      isRefreshingRef.current = true
      setIsRefreshing(true)

      const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_REFRESH_MS))
      Promise.all([onRefresh().catch(() => {}), minDelay]).finally(() => {
        isRefreshingRef.current = false
        setIsRefreshing(false)
        pullDistanceRef.current = 0
        setPullDistance(0)
      })
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [containerRef, onRefresh])

  return { pullDistance, isPulling, isRefreshing }
}
