import { styled } from "@mui/system";
import { Name, Description, DueDate } from "../ToDoItem/index.styled";

export { ActionArea, Container, Content } from '../ToDoItem/index.styled'

const shimmerStyles = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
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
  width: '80px',
  height: '20px',
  ...shimmerStyles,
}))

export const DescriptionPlaceholder = styled(Description)(({
  width: '250px',
  height: '20px',
  ...shimmerStyles,
}))

export const DueDatePlaceholder = styled(DueDate)(({
  width: '120px',
  height: '20px',
  ...shimmerStyles,
}))
