import { styled } from '@mui/material/styles';

export const Container = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  touchAction: 'pan-y',
  willChange: 'transform',
  WebkitTouchCallout: 'none',
  WebkitTapHighlightColor: 'transparent',
  overscrollBehaviorX: 'none',
  WebkitOverflowScrolling: 'touch',
  background: 'transparent',
  borderRadius: '16px',
  margin: '4px 0',
  isolation: 'isolate',
  
  // Disable text selection during swipe gestures
  '& *': {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
});

export const ItemContent = styled('div')<{ $translateX: number; $isDragging: boolean }>(
  ({ $translateX, $isDragging }) => ({
    transform: `translate3d(${$translateX}px, 0, 0)`,
    transition: $isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform',
    position: 'relative',
    zIndex: 2,
    background: 'white',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: '16px',
    boxShadow: $isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.1)',
    margin: 0,
    
    // Hardware acceleration for transforms
    WebkitTransform: 'translateZ(0)',
    
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none !important',
    },
    
    // Optimize for high DPI displays
    '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)': {
      transform: `translate3d(${$translateX}px, 0, 0)`,
    },
  })
);

export const RightActionsContainer = styled('div')<{ $isVisible: boolean; $translateX: number }>(
  ({ $isVisible }) => ({
    position: 'absolute',
    top: '4px',
    right: 0,
    width: '120px',
    height: 'calc(100% - 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#cc3333',
    zIndex: 1,
    opacity: $isVisible ? 1 : 0,
    transform: `translateX(${$isVisible ? 0 : '100%'})`,
    transition: $isVisible ? 'opacity 0.15s ease, transform 0.15s ease' : 'opacity 0.25s ease, transform 0.25s ease',
    borderRadius: '0 16px 16px 0',
    overflow: 'hidden',
    boxShadow: $isVisible ? 'inset 2px 0 4px rgba(0,0,0,0.15)' : 'none',
    
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'opacity 0.1s ease !important',
    },
  })
);

export const LeftActionsContainer = styled('div')<{ $isVisible: boolean; $translateX: number }>(
  ({ $isVisible }) => ({
    position: 'absolute',
    top: '4px',
    left: 0,
    width: '120px',
    height: 'calc(100% - 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2196f3',
    zIndex: 1,
    opacity: $isVisible ? 1 : 0,
    transform: `translateX(${$isVisible ? 0 : '-100%'})`,
    transition: $isVisible ? 'opacity 0.15s ease, transform 0.15s ease' : 'opacity 0.25s ease, transform 0.25s ease',
    borderRadius: '16px 0 0 16px',
    overflow: 'hidden',
    boxShadow: $isVisible ? 'inset -2px 0 4px rgba(0,0,0,0.15)' : 'none',
    
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'opacity 0.1s ease !important',
    },
  })
);

export const RightActionButton = styled('button')({
  background: 'transparent',
  border: 'none',
  color: 'white',
  padding: 0,
  height: '100%',
  width: '80px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  marginRight: '12px',
  
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'scale(1.05)',
    borderRadius: '8px',
  },
  
  '&:active': {
    background: 'rgba(255,255,255,0.2)',
    transform: 'scale(0.95)',
  },
  
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
  },
  
  '@media (prefers-color-scheme: dark)': {
    color: '#ffffff',
    
    '&:hover': {
      background: '#bb2222',
    },
    
    '&:active': {
      background: '#dd4444',
    },
  },
  
  '@media (prefers-contrast: high)': {
    border: '2px solid white',
    
    '& .MuiSvgIcon-root': {
      fontSize: '26px',
      fontWeight: 'bold',
    },
  },
});

export const LeftActionButton = styled('button')({
  background: 'transparent',
  border: 'none',
  color: 'white',
  padding: 0,
  height: '100%',
  width: '80px',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 'auto',
  marginLeft: '12px',
  
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'scale(1.05)',
    borderRadius: '8px',
  },
  
  '&:active': {
    background: 'rgba(255,255,255,0.2)',
    transform: 'scale(0.95)',
  },
  
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
  },
  
  '@media (prefers-color-scheme: dark)': {
    color: '#ffffff',
    
    '&:hover': {
      background: '#1976d2',
    },
    
    '&:active': {
      background: '#42a5f5',
    },
  },
  
  '@media (prefers-contrast: high)': {
    border: '2px solid white',
    
    '& .MuiSvgIcon-root': {
      fontSize: '26px',
      fontWeight: 'bold',
    },
  },
});