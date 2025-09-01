import { styled } from '@mui/material/styles'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
  width: '100%',
  margin: '0',
  height: '100%',
  minHeight: 0,
  boxSizing: 'border-box'
});

export const MiniTimeline = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  marginLeft: '8px',
});

export const TimelineBar = styled('div')(({ height, color }: { height: number; color?: string }) => ({
  width: '3px',
  height: `${height}px`,
  backgroundColor: color || 'rgba(16, 185, 129, 0.6)',
  borderRadius: '1px',
  transition: 'all 200ms ease-in-out',
}));
