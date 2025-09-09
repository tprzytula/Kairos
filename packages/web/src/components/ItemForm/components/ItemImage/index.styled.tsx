import { CardMedia } from "@mui/material";
import { styled } from "@mui/system";

export const Media = styled(CardMedia)({
    width: '75px',
    height: '75px',
    position: 'relative',
})

export const StyledItemImage = styled(Media)(({ theme }) => ({
    alignSelf: 'center',
    border: '2px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '16px',
    height: '120px',
    width: '120px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover': {
        borderColor: 'rgba(102, 126, 234, 0.4)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
        transform: 'translateY(-2px) scale(1.02)',
        '&:before': {
            opacity: 1,
        },
    },
    '&:active': {
        transform: 'translateY(0) scale(1)',
    },
}))
