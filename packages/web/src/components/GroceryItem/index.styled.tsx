import { styled } from "@mui/system";
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'
import { SwipeAction } from "react-swipeable-list";

export const Container = styled(({ isPurchased, ...props }: { isPurchased: boolean } & CardProps) => (
  <Card {...props} />
))(({ isPurchased }: { isPurchased: boolean }) => ({
  display: 'flex',
  width: '100%',
  borderRadius: '0.5em',
  minHeight: '50px',
  margin: '0.5em',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isPurchased ? 0.5 : 1,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::after': isPurchased ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '2px',
    backgroundColor: 'black',
  } : {},
}))

export const ActionArea = styled(CardActionArea)({
  display: 'flex',
  padding: '0',
})

export const Media = styled(CardMedia)(({
  width: '75px',
  height: '75px',
  position: 'relative',
}))

export const Content = styled(CardContent)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  textAlign: 'center',
  flexGrow: '1',
})

export const Name = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
})

export const QuantityContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

export const Quantity = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
  marginRight: '0.25em',
})

export const Unit = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
})

export const SwipeableDeleteAction = styled(SwipeAction)({
  backgroundColor: '#FF5E69',
  color: 'white',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})