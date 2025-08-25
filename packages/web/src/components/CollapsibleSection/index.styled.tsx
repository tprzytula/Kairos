import styled from '@emotion/styled'
import { Box, Chip, Typography } from '@mui/material'
import { SectionVariant } from './types'

interface SectionVariantProps {
  sectionVariant: SectionVariant
}

const variantConfig = {
  large: {
    wrapper: {
      marginBottom: 6,
    },
    header: {
      padding: '8px 10px',
      borderRadius: 12,
      hoverTransform: 'translateY(-0.5px)',
      hoverShadow: '0 6px 14px rgba(102, 126, 234, 0.12)',
    },
    title: {
      fontWeight: 600,
      fontSize: '0.9rem',
    },
    icon: {
      width: 22,
      height: 22,
      fontSize: 12,
    },
    chip: {
      height: 16,
      fontSize: 9,
      paddingInline: 2,
    },
    content: {
      paddingTop: 2,
    },
  },
  small: {
    wrapper: {
      marginBottom: 2,
    },
    header: {
      padding: '6px 8px',
      borderRadius: 8,
      hoverTransform: 'translateY(-0.25px)',
      hoverShadow: '0 4px 10px rgba(102, 126, 234, 0.08)',
    },
    title: {
      fontWeight: 500,
      fontSize: '0.8rem',
    },
    icon: {
      width: 18,
      height: 18,
      fontSize: 10,
    },
    chip: {
      height: 14,
      fontSize: 8,
      paddingInline: 1,
    },
    content: {
      paddingTop: 1,
    },
  },
}

export const SectionWrapper = styled(Box)<SectionVariantProps>(({ sectionVariant }) => ({
  marginBottom: variantConfig[sectionVariant].wrapper.marginBottom,
}))

export const SectionHeader = styled(Box)<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].header
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: config.padding,
    background: '#ffffff',
    borderRadius: config.borderRadius,
    boxShadow: '0 2px 6px rgba(102, 126, 234, 0.05)',
    border: '1px solid rgba(102,126,234,0.12)',
    backgroundClip: 'padding-box, border-box',
    backgroundImage:
      'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%), linear-gradient(180deg, rgba(102,126,234,0.18), rgba(124,58,237,0.10))',
    cursor: 'pointer',
    transition: 'all 200ms ease-in-out',
    '&:hover': {
      transform: config.hoverTransform,
      boxShadow: config.hoverShadow,
    },
  }
})

export const SectionTitle = styled(Typography)<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].title
  return {
    fontWeight: config.fontWeight,
    color: '#111827',
    fontSize: config.fontSize,
    letterSpacing: '-0.01em',
  }
})

export const ItemCountChip = styled(Chip)<SectionVariantProps>(({ sectionVariant }) => {
  const config = variantConfig[sectionVariant].chip
  return {
    height: config.height,
    borderRadius: 999,
    fontSize: config.fontSize,
    paddingInline: config.paddingInline,
    backgroundColor: '#eef2ff',
    color: '#4f46e5',
    fontWeight: 700,
    border: '1px solid rgba(79,70,229,0.22)',
  }
})

export const SectionContent = styled(Box)<SectionVariantProps>(({ sectionVariant }) => ({
  paddingTop: variantConfig[sectionVariant].content.paddingTop,
}))

export const SectionIconCircle = styled(Box, {
  shouldForwardProp: (prop) => !['bg', 'fg', 'sectionVariant'].includes(prop),
})<{ bg?: string; fg?: string; sectionVariant: SectionVariant }>(({ bg = '#eef2ff', fg = '#4f46e5', sectionVariant }) => {
  const config = variantConfig[sectionVariant].icon
  return {
    width: config.width,
    height: config.height,
    borderRadius: '50%',
    backgroundColor: bg,
    color: fg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: config.fontSize,
    fontWeight: 700,
    boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.04)',
  }
})

export const ChevronBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 120ms ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  opacity: 0.7,
}))
