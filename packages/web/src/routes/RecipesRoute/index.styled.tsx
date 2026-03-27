import { styled } from '@mui/system'
import { ScrollArea } from '../../components/ScrollableContainer/index.styled'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  width: '100%'
})

export const RecipeScrollArea = styled(ScrollArea)({
  paddingTop: '0.75rem',
})

