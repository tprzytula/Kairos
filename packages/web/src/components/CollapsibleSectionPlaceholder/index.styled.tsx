import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { SectionVariant } from '../CollapsibleSection/types';

interface SectionVariantProps {
  sectionVariant: SectionVariant;
}

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
};

const variantConfig = {
  large: {
    wrapper: {
      marginBottom: 6,
    },
    header: {
      padding: '8px 10px',
      borderRadius: 12,
      height: 52,
    },
    icon: {
      width: 22,
      height: 22,
    },
    title: {
      width: 100,
      height: 16,
    },
    count: {
      width: 24,
      height: 16,
    },
    chevron: {
      width: 20,
      height: 20,
    },
  },
  small: {
    wrapper: {
      marginBottom: 2,
    },
    header: {
      padding: '6px 8px',
      borderRadius: 8,
      height: 44,
    },
    icon: {
      width: 18,
      height: 18,
    },
    title: {
      width: 80,
      height: 14,
    },
    count: {
      width: 20,
      height: 14,
    },
    chevron: {
      width: 18,
      height: 18,
    },
  },
};

export const SectionWrapper = styled(Box)<SectionVariantProps>(({ sectionVariant }) => ({
  marginBottom: variantConfig[sectionVariant].wrapper.marginBottom,
}));

export const SectionHeaderPlaceholder = styled('div')<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].header;
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: config.padding,
    background: '#ffffff',
    borderRadius: config.borderRadius,
    boxShadow: '0 2px 6px rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102,126,234,0.12)',
    height: config.height,
  };
});

export const SectionIconPlaceholder = styled('div')<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].icon;
  return {
    width: config.width,
    height: config.height,
    borderRadius: '50%',
    backgroundColor: '#eef2ff',
    display: 'block',
    ...shimmerStyles,
  };
});

export const SectionTitlePlaceholder = styled('div')<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].title;
  return {
    width: config.width,
    height: config.height,
    borderRadius: '4px',
    display: 'block',
    ...shimmerStyles,
  };
});

export const SectionCountPlaceholder = styled('div')<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].count;
  return {
    width: config.width,
    height: config.height,
    borderRadius: '999px',
    backgroundColor: '#eef2ff',
    display: 'block',
    ...shimmerStyles,
  };
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

export const ChevronPlaceholder = styled('div')<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].chevron;
  return {
    width: config.width,
    height: config.height,
    borderRadius: '4px',
    display: 'block',
    opacity: 0.3,
    ...shimmerStyles,
  };
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
