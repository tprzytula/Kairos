import { styled } from "@mui/system";
import { Card, CardActionArea, CardContent, CardProps } from '@mui/material'

export const Container = styled(({ isSelected, ...props }: { isSelected: boolean } & CardProps) => (
  <Card {...props} />
))(({ isSelected }: { isSelected: boolean }) => ({
  display: 'flex',
  borderRadius: '0.75em',
  minHeight: '50px',
  margin: '0.5em',
  width: '100%',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isSelected ? 0.5 : 1,
  transition: 'all 0.3s ease',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
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
  borderRadius: '0.75em',
})

export const Content = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  textAlign: 'left',
  flexGrow: '1',
  padding: '16px 20px',
  gap: '8px',
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
}))

export const Name = styled('div')(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  letterSpacing: '0.5px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}))

export const Description = styled('div')(({ theme }) => ({
  fontSize: '15px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  lineHeight: '1.4',
  padding: '4px 0',
  whiteSpace: 'pre-wrap',
}))

export const DueDate = styled('div')(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  opacity: 0.9,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    marginRight: '6px',
  },
}))
