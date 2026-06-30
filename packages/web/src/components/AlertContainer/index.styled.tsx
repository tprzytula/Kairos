import { styled } from "@mui/system";

// Above MUI drawers/modals (1200-1300) so alerts stay visible over open drawers,
// matching MUI's snackbar layer which is intended for transient notifications.
const ALERT_Z_INDEX = 1400;

export const Container = styled('div')({
    position: 'fixed',
    bottom: '5em',
    left: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: ALERT_Z_INDEX,
    pointerEvents: 'none',
    '& > *': {
        pointerEvents: 'auto',
    },
})
