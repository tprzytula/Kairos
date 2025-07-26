export const formatTimeElapsed = (currentTimestamp: number, previousTimestamp?: number): string => {
  if (!previousTimestamp) {
    return 'First recording'
  }

  const diffMs = currentTimestamp - previousTimestamp
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} later`
  }

  if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60
    if (remainingMinutes === 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} later`
    }
    return `${diffHours}h ${remainingMinutes}m later`
  }

  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} later`
  }

  return 'Just now'
}

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - timestamp
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (diffDays === 1) {
    return 'Yesterday'
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  return date.toLocaleDateString()
} 