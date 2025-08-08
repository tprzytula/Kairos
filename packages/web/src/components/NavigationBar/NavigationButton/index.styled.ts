import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';

export const StyledNavigationButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  width: '48px',
  height: '48px',
  minWidth: '48px',
  minHeight: '48px',
  borderRadius: '16px',
  margin: '0',
  padding: '8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  flexShrink: 0,
  
  ...(isSelected
    ? {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: `
          0 2px 8px rgba(102, 126, 234, 0.3),
          0 4px 16px rgba(118, 75, 162, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: '16px',
        },
        '&:hover': {
          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          transform: 'translateY(-1px)',
          boxShadow: `
            0 4px 12px rgba(102, 126, 234, 0.4),
            0 8px 24px rgba(118, 75, 162, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        },
        '&:active': {
          transform: 'translateY(0)',
        }
      }
    : {
        background: 'transparent',
        color: theme.palette.text.secondary,
        '&:hover': {
          background: 'rgba(102, 126, 234, 0.08)',
          color: theme.palette.primary.main,
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        }
      }
  ),
}));