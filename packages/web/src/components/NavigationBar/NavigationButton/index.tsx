import { Route } from "../../../enums/route";
import { useLocation, useNavigate } from "react-router";
import { useCallback } from "react";
import { StyledNavigationButton } from "./index.styled";

export interface INavigationButtonProps {
    SelectedIcon: React.ElementType<any>;
    UnselectedIcon: React.ElementType<any>;
    route: Route;
    isDisabled?: boolean;
    accentGradient?: string;
    accentRgb?: string;
}

const NavigationButton = ({ SelectedIcon, UnselectedIcon, route, isDisabled, accentGradient, accentRgb }: INavigationButtonProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const onClick = useCallback(() => {
        navigate(route);
    }, [navigate, route]);

    const isSelected = location.pathname === route;

    return (
        <StyledNavigationButton onClick={onClick} disabled={isDisabled} isSelected={isSelected} accentGradient={accentGradient} accentRgb={accentRgb}>
            {isSelected ? <SelectedIcon fontSize="large"/> : <UnselectedIcon fontSize="large"/>}
        </StyledNavigationButton>
    );
};

export default NavigationButton;
