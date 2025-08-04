import { styled } from "@mui/system";
import { Name, Description, DueDate } from "../ToDoItem/index.styled";

export { ActionArea, Container, Content } from '../ToDoItem/index.styled'

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
