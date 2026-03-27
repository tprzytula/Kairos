import { styled } from '@mui/system'
import { ScrollArea } from '../../components/ScrollableContainer/index.styled'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  width: '100%'
})

export const PlannerScrollArea = styled(ScrollArea)({
  paddingBottom: '0.5rem',
})

