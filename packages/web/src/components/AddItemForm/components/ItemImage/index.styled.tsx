import { CardMedia } from "@mui/material";
import { styled } from "@mui/system";

export const Media = styled(CardMedia)(({
    width: '75px',
    height: '75px',
    position: 'relative',
}))

export const StyledItemImage = styled(Media)({
    alignSelf: 'center',
    border: '1px solid #000',
    borderRadius: '10px',
    objectFit: 'cover',
    padding: '1em',
    height: '10em',
    width: '10em',
    cursor: 'pointer',
})
