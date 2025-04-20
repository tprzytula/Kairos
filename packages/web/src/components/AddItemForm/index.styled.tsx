import { styled } from "@mui/system";
import { Media } from "../GroceryItem/index.styled";

export const GroceryItemImage = styled(Media)({
    alignSelf: 'center',
    border: '1px solid #000',
    borderRadius: '10px',
    objectFit: 'cover',
    padding: '1em',
    height: '10em',
    width: '10em',
    cursor: 'pointer',
})
