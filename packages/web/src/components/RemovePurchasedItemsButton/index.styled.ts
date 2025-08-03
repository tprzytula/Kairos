import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const RemoveButton = styled(Button)({
    width: 'calc(100% - 1em)',
    maxWidth: 400,
    minHeight: '2em',
    marginBottom: '0.25em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.75em',
    padding: '0.5em 1em',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    textTransform: 'none',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
});

export const StatusText = styled(Typography)({
    width: 'calc(100% - 1em)',
    maxWidth: 400,
    minHeight: '2em',
    marginBottom: '0.25em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontSize: '0.75em',
    fontWeight: 600,
    padding: '0.5em 1em',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    color: '#6b7280',
    letterSpacing: '0.01em',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});
  
export const RemoveButtonContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    minHeight: '2em',
    marginBottom: '0.25em',
});