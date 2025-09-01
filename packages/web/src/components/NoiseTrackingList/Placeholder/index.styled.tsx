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

export const PlaceholdersWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column'
});
