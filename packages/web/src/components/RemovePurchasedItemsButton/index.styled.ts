import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const RemoveButton = styled(Button)({
    width: 'calc(100% - 1em)',
    maxWidth: 400,
    minHeight: '2em',
    marginBottom: '0.25em',
    display: 'block',
    justifySelf: 'center',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.75em',
    padding: '0.5em 1em',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    textTransform: 'none',
    letterSpacing: '0.01em',
});
  
export const RemoveButtonContainer = styled(Box)({
    width: '100%',
    maxWidth: 400,
    minHeight: '2em',
    marginBottom: '0.25em',
    display: 'block',
});