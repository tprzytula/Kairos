import { keyframes } from '@mui/material/styles'

export const checkboxBounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
`

export const progressGlow = keyframes`
  0% { box-shadow: 0 0 0px transparent; }
  50% { box-shadow: 0 0 8px rgba(99, 102, 241, 0.5); }
  100% { box-shadow: 0 0 0px transparent; }
`

export const milestoneShine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`

export const cardGlowPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3); }
  70% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`

export const cardGlowPulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.3); }
  70% { box-shadow: 0 0 0 6px rgba(5, 150, 105, 0); }
  100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
`

export const streakPulse = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`

export const slideIn = keyframes`
  0% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`
