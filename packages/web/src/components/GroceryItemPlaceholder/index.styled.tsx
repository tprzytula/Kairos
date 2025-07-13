import { styled } from "@mui/system";
import { Media, Name, QuantityText, UnitText, QuantityDisplay } from "../GroceryItem/index.styled";

export { ActionArea, Container, Content, ActionContainer } from '../GroceryItem/index.styled'

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

export const QuantityDisplayPlaceholder = styled(QuantityDisplay)(shimmerStyles)

export const QuantityPlaceholder = styled(QuantityText)(({
  width: '40px',
  height: '20px',
  ...shimmerStyles,
}))

export const UnitPlaceholder = styled(UnitText)(({
  width: '30px',
  height: '20px',
  ...shimmerStyles,
}))

export const ButtonPlaceholder = styled('div')(({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  ...shimmerStyles,
}))
