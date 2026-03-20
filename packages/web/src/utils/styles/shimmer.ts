import { keyframes } from '@mui/material/styles'
import { Theme } from '@mui/material/styles'

/**
 * Shared shimmer/skeleton animation keyframes for use with MUI's `styled()` API.
 *
 * Usage with template-literal styled components (theme-aware):
 *   import { shimmerKeyframes, themedShimmerStyles } from 'utils/styles/shimmer'
 *
 * Usage with object-style styled components (hardcoded palette):
 *   import { shimmerStyles } from 'utils/styles/shimmer'
 */

export const shimmerKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

/**
 * Object-style shimmer styles with hardcoded colours.
 * Suitable for spreading into `styled()()` calls that use plain objects.
 */
export const shimmerStyles = {
  background: 'linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 50%, #f1f5f9 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '200% 0',
    },
    '100%': {
      backgroundPosition: '-200% 0',
    },
  },
}

/**
 * Theme-aware shimmer styles for use inside `styled()` callbacks that receive a theme.
 * Uses the theme palette for gradient colours.
 */
export const themedShimmerStyles = (theme: Theme) => ({
  background: `linear-gradient(90deg, ${theme.palette.action.hover} 25%, ${theme.palette.action.selected} 50%, ${theme.palette.action.hover} 75%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmerKeyframes} 1.5s infinite`,
})
