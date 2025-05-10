import { IconButton } from "@mui/material";
import { Route } from "../../../enums/route";
import { useLocation, useNavigate } from "react-router";
import { useCallback } from "react";

export interface INavigationButtonProps {
    SelectedIcon: React.ElementType<any>;
    UnselectedIcon: React.ElementType<any>;
    route: Route;
    isDisabled?: boolean;
}

const NavigationButton = ({ SelectedIcon, UnselectedIcon, route, isDisabled }: INavigationButtonProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const onClick = useCallback(() => {
        navigate(route);
    }, [navigate, route]);

    const isSelected = location.pathname === route;

    return (
        <IconButton onClick={onClick} disabled={isDisabled}>
            {isSelected ? <SelectedIcon fontSize="large"/> : <UnselectedIcon fontSize="large"/>}
        </IconButton>
    );
};

export default NavigationButton;
