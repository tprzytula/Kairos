import { styled } from "@mui/system";
import { Media, Name, QuantityText, UnitText, QuantityDisplay } from "../index.styled";
import { shimmerStyles } from '../../../utils/styles/shimmer'

export { ActionArea, Container, Content, ActionContainer } from '../index.styled'

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
