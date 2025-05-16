import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { SwipeableList, SwipeableListItem, SwipeAction } from 'react-swipeable-list'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35em',
  width: '100%',
  margin: '0.5em',
})

export const EmptyListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35em',
  width: '100%',
})

export const EmptyListMessage = styled(Typography)({
  fontSize: '1.2em',
  fontWeight: 'bold',
  textAlign: 'center',
})

export const SwipeableListItemContainer = styled(SwipeableListItem)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  borderRadius: '0.5em',
  boxSizing: 'border-box',
  overflow: 'hidden',
})

export const DeleteAction = styled(SwipeAction)({
  backgroundColor: '#FF5E69',
  color: 'white',
  textAlign: 'center',
  width: '100%',
  margin: '0.5em 0',
  borderRadius: '0 0.5em 0.5em 0',
  alignItems: 'center',
  justifyContent: 'center',
})

export const StyledSwipeableList = styled(SwipeableList)({
  display: 'flex',
  flexDirection: 'column',
  padding: '0.5em',
  boxSizing: 'border-box',
})

