export const COLORS = {
  orange: {
    primary: '#f97316',
    dark: '#ea580c',
    bg: 'rgba(249, 115, 22, 0.1)',
    bgSubtle: 'rgba(249, 115, 22, 0.04)',
    bgHover: 'rgba(249, 115, 22, 0.05)',
    bgSelected: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.3)',
    borderSubtle: 'rgba(249, 115, 22, 0.25)',
    borderStrong: 'rgba(249, 115, 22, 0.8)',
    muted: 'rgba(249, 115, 22, 0.4)',
    shadow: 'rgba(249, 115, 22, 0.2)',
    focus: 'rgba(249, 115, 22, 0.08)',
  },
  purple: {
    primary: '#667eea',
    secondary: '#764ba2',
    bg: 'rgba(102, 126, 234, 0.1)',
    bgSubtle: 'rgba(102, 126, 234, 0.04)',
    bgHover: 'rgba(102, 126, 234, 0.08)',
    bgSelected: 'rgba(102, 126, 234, 0.15)',
    muted: 'rgba(102, 126, 234, 0.4)',
    shadow: 'rgba(102, 126, 234, 0.2)',
    border: 'rgba(102, 126, 234, 0.3)',
    borderSubtle: 'rgba(102, 126, 234, 0.25)',
  },
  rose: {
    primary: '#f43f5e',
    secondary: '#f5576c',
    bg: 'rgba(244, 63, 94, 0.1)',
  },
  green: {
    primary: '#059669',
    dark: '#047857',
    bg: 'rgba(16, 185, 129, 0.1)',
    shadow: 'rgba(16, 185, 129, 0.2)',
  },
} as const

export const GRADIENTS = {
  orange: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  green: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
} as const

export const PLACEHOLDER_GRADIENTS = [
  GRADIENTS.purple,
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
] as const

/**
 * Shared chip style for orange filter chips (meal type, dish type, etc.).
 * Pass `isSelected` to toggle between filled and outlined appearance.
 */
export const filterChipSx = (isSelected: boolean) => ({
  borderRadius: '8px',
  ...(isSelected
    ? {
        background: COLORS.orange.bgSelected,
        color: COLORS.orange.dark,
        borderColor: COLORS.orange.border,
        fontWeight: 600,
      }
    : { borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary' }),
})
