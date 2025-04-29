import { styled } from "@mui/system";
import { Media, Name, Quantity, Unit } from "../GroceryItem/index.styled";
import { Description, DueDate } from "../ToDoItem/index.styled";

export { ActionArea, Container, Content, QuantityContainer } from '../GroceryItem/index.styled'

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

export const MediaPlaceholder = styled(Media)((shimmerStyles))

export const NamePlaceholder = styled(Name)(({
  width: '120px',
  height: '20px',
  ...shimmerStyles,
}))

export const DescriptionPlaceholder = styled(Description)(({
  width: '120px',
  height: '20px',
  ...shimmerStyles,
}))

export const DueDatePlaceholder = styled(DueDate)(({
  width: '120px',
  height: '20px',
  ...shimmerStyles,
}))
