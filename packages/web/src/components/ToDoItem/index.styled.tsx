import { styled } from "@mui/system";
import { Card, CardActionArea, CardContent, CardMedia, CardProps } from '@mui/material'

export const Container = styled(({ isSelected, ...props }: { isSelected: boolean } & CardProps) => (
  <Card {...props} />
))(({ isSelected }: { isSelected: boolean }) => ({
  display: 'flex',
  borderRadius: '0.5em',
  minHeight: '50px',
  margin: '0 0.5em',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isSelected ? 0.5 : 1,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::after': isSelected ? {
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

export const Description = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
})

export const DueDate = styled('div')({
  fontSize: '16px',
  fontWeight: 600,
})
