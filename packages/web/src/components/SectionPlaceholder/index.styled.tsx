import { styled } from "@mui/system";

const shimmerStyles = {
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

export const SectionHeaderPlaceholder = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
  background: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(102, 126, 234, 0.05)',
  border: '1px solid rgba(102,126,234,0.12)',
  marginBottom: '4px',
  height: '48px',
})

export const SectionIconPlaceholder = styled('div')({
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  backgroundColor: '#eef2ff',
  display: 'block',
  ...shimmerStyles,
})

export const SectionTitlePlaceholder = styled('div')({
  width: '80px',
  height: '14px',
  borderRadius: '4px',
  display: 'block',
  ...shimmerStyles,
})

export const SectionCountPlaceholder = styled('div')({
  width: '20px',
  height: '14px',
  borderRadius: '999px',
  backgroundColor: '#eef2ff',
  display: 'block',
  ...shimmerStyles,
})

export const SectionLeftContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  height: '48px',
})

export const SectionRightContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const ChevronPlaceholder = styled('div')({
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  display: 'block',
  opacity: 0.3,
  ...shimmerStyles,
})
