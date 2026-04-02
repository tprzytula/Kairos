let audioContext: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined' || typeof AudioContext === 'undefined') return null
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export const playCompletionSound = (): void => {
  const enabled = localStorage.getItem('kairos:soundEffects')
  if (enabled === 'false') return

  const ctx = getAudioContext()
  if (!ctx) return

  const playTone = (frequency: number, startTime: number, duration: number): void => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.15, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  const now = ctx.currentTime
  playTone(880, now, 0.1)
  playTone(1100, now + 0.05, 0.12)
}
