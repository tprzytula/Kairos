
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Route } from "../../../enums/route";
import { useLocation, useNavigate } from "react-router";
import { useCallback, useMemo } from "react";
import { IconButton } from '@mui/material';
import { addNoiseTrackingItem } from '../../../api/noiseTracking';
import { useNoiseTrackingContext } from '../../../providers/NoiseTrackingProvider';
import { useThrottle } from '../../../hooks/useThrottle';

export type IRouteToAddItemMapping = {
    [key in Route]?: Route;
}

const RouteToAddItemMapping: IRouteToAddItemMapping = {
    [Route.GroceryList]: Route.AddGroceryItem,
    [Route.ToDoList]: Route.AddToDoItem,
}

const AddItemButton = () => {
    const { refetchNoiseTrackingItems } = useNoiseTrackingContext();
    const location = useLocation();
    const navigate = useNavigate();
    const addItemRoute = useMemo<Route | undefined>(() => {
        const path = location.pathname as Route;

        return RouteToAddItemMapping[path];
    }, [location.pathname]);

    const onClick = useCallback(() => {
        if (addItemRoute) {
            navigate(addItemRoute);
        }

        if (location.pathname === Route.NoiseTracking) {
            addNoiseTrackingItem().then(() => {
                refetchNoiseTrackingItems()
            })
        }
    }, [navigate, addItemRoute]);

    const handleClick = useThrottle(onClick, 1000);

    return (
        <IconButton onClick={handleClick}>
            <AddCircleIcon fontSize="large" color="success"/>
        </IconButton>
    )
}

export default AddItemButton;
