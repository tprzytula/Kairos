import { styled } from "@mui/system";
import { Name, Description, DueDate, Container as BaseContainer, ActionArea, Content as BaseContent } from "../index.styled";

export { ActionArea } from '../index.styled'

export const Container = styled(BaseContainer)(({
  minHeight: '160px',
  height: 'auto',
}))

export const Content = styled(BaseContent)(({
  minHeight: '88px',
  height: 'auto',
}))

const shimmerStyles = {
  background: 'linear-gradient(90deg, #f1f5f9 25%, #e5e7eb 50%, #f1f5f9 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '200% 0',
    },
    '100%': {
      backgroundPosition: '-200% 0',
    },
  },
}


export const NamePlaceholder = styled(Name)(({
  width: '120px',
  height: '21px',
  minHeight: '21px',
  borderRadius: '4px',
  marginBottom: '3px',
  display: 'block',
  ...shimmerStyles,
}))

export const DescriptionLine = styled('div')(({
  width: '320px',
  height: '20px',
  minHeight: '20px',
  borderRadius: '4px',
  display: 'block',
  marginBottom: '4px',
  ...shimmerStyles,
}))

export const DescriptionLineShort = styled('div')(({
  width: '200px',
  height: '20px',
  minHeight: '20px',
  borderRadius: '4px',
  display: 'block',
  marginBottom: '8px',
  ...shimmerStyles,
}))

export const DescriptionPlaceholder = styled(Description)(({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}))

export const DueDatePlaceholder = styled(DueDate)(({ theme }) => ({
  width: '145px',
  height: '28px',
  borderRadius: '10px',
  marginTop: '0 !important',
  backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme?.palette?.divider || 'rgba(0, 0, 0, 0.08)'}`,
  alignSelf: 'flex-start',
  display: 'block',
  boxSizing: 'border-box',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
  '&::before': {
    display: 'none',
  },
  ...shimmerStyles,
}))
