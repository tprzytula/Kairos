
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Route } from "../../../enums/route";
import { useLocation, useNavigate } from "react-router";
import { useCallback, useMemo } from "react";
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { addNoiseTrackingItem } from '../../../api/noiseTracking';
import { useNoiseTrackingContext } from '../../../providers/NoiseTrackingProvider';
import { useProjectContext } from '../../../providers/ProjectProvider';
import { useThrottle } from '../../../hooks/useThrottle';

const PrimaryActionButton = styled(IconButton)(({ theme }) => ({
    width: '56px',
    height: '56px',
    background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.custom?.surfaces?.primary} 100%)`,
    color: theme.palette.primary.main,
    margin: '0 8px',
    borderRadius: '50%',
    boxShadow: `
        0 1px 3px rgba(0, 0, 0, 0.08),
        0 4px 12px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.9)
    `,
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        borderRadius: '50%',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover:not(:disabled)': {
              background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.custom?.surfaces?.secondary} 100%)`,
      color: theme.palette.custom?.hover?.primary,
        transform: 'translateY(-2px) scale(1.05)',
        boxShadow: `
            0 2px 6px rgba(0, 0, 0, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9)
        `,
        borderColor: 'rgba(16, 185, 129, 0.2)',
        '&::before': {
            opacity: 1,
        },
    },
    '&:active:not(:disabled)': {
        transform: 'translateY(-1px) scale(1.02)',
        boxShadow: `
            0 1px 3px rgba(0, 0, 0, 0.1),
            0 4px 12px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9)
        `,
    },
    '&:disabled': {
        opacity: 0.4,
        background: `linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)`,
        color: theme.palette.text.disabled,
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: `
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.5)
        `,
    },
    '& .MuiSvgIcon-root': {
        fontSize: '28px',
        position: 'relative',
        zIndex: 1,
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    },
}));

export type IRouteToAddItemMapping = {
    [key in Route]?: Route;
}

const RouteToAddItemMapping: IRouteToAddItemMapping = {
    [Route.GroceryList]: Route.AddGroceryItem,
    [Route.ToDoList]: Route.AddToDoItem,
}

const AddItemButton = () => {
    const { refetchNoiseTrackingItems } = useNoiseTrackingContext();
    const { currentProject } = useProjectContext();
    const location = useLocation();
    const navigate = useNavigate();
    const addItemRoute = useMemo<Route | undefined>(() => {
        const path = location.pathname as Route;

        return RouteToAddItemMapping[path];
    }, [location.pathname]);

    const isOnHomePage = useMemo(() => {
        return location.pathname === Route.Home;
    }, [location.pathname]);

    const onClick = useCallback(async () => {
        if (addItemRoute) {
            navigate(addItemRoute);
        }

        if (location.pathname === Route.NoiseTracking) {
            try {
                await addNoiseTrackingItem(currentProject?.id);
                refetchNoiseTrackingItems();
            } catch (error) {
                console.error('Failed to add noise tracking item:', error);
            }
        }
    }, [navigate, addItemRoute, location.pathname, refetchNoiseTrackingItems, currentProject?.id]);

    const handleClick = useThrottle(onClick, 1000);

    return (
        <PrimaryActionButton onClick={handleClick} disabled={isOnHomePage}>
            <AddCircleIcon />
        </PrimaryActionButton>
    )
}

export default AddItemButton;
