import { styled } from "@mui/system";
import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material'

export const Container = styled(Card)({
    display: 'flex',
    borderRadius: 0.2,
    minHeight: '100px',
    width: '100%',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
})

export const ActionArea = styled(CardActionArea)({
  display: 'flex',
  padding: '0 2em',
})

export const Media = styled(CardMedia)({
  width: '100px',
  height: '100px',
})

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
