import styled from '@emotion/styled';
import { Box } from '@mui/material';

const shimmerStyles = {
  background: 'linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 50%, #f1f5f9 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite linear',
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '200% 0',
    },
    '100%': {
      backgroundPosition: '-200% 0',
    },
  },
};

export const SectionWrapper = styled(Box)({
  marginBottom: 2,
});

export const SectionHeaderPlaceholder = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 8px',
  background: '#ffffff',
  borderRadius: 8,
  boxShadow: '0 2px 6px rgba(102, 126, 234, 0.05)',
  border: '1px solid rgba(102,126,234,0.12)',
  height: 44,
});

export const SectionIconPlaceholder = styled('div')({
  width: 18,
  height: 18,
  borderRadius: '50%',
  backgroundColor: '#eef2ff',
  display: 'block',
  ...shimmerStyles,
});

export const SectionTitlePlaceholder = styled('div')({
  width: 80,
  height: 14,
  borderRadius: '4px',
  display: 'block',
  ...shimmerStyles,
});

export const SectionCountPlaceholder = styled('div')({
  width: 20,
  height: 14,
  borderRadius: '999px',
  backgroundColor: '#eef2ff',
  display: 'block',
  ...shimmerStyles,
});

export const SectionLeftContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export const SectionRightContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const ChevronPlaceholder = styled('div')({
  width: 18,
  height: 18,
  borderRadius: '4px',
  display: 'block',
  opacity: 0.3,
  ...shimmerStyles,
});

export const MiniTimelinePlaceholder = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
});

export const TimelineBarPlaceholder = styled('div')({
  width: '3px',
  height: '8px',
  borderRadius: '1px',
  ...shimmerStyles,
});
