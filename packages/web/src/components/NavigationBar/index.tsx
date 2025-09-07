import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NavigationButton from './NavigationButton';
import { Route } from '../../enums/route';
import { Container, Divider, ItemsContainer } from './index.styled';
import AddItemButton from './AddItemButton';
import { useShopContext } from '../../providers/ShopProvider';
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { StyledNavigationButton } from './NavigationButton/index.styled';

const NavigationBar = () => {
  const { currentShop } = useShopContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleShoppingCartClick = useCallback(() => {
    if (currentShop) {
      navigate(Route.GroceryList.replace(':shopId', currentShop.id));
    } else {
      navigate(Route.Shops);
    }
  }, [currentShop, navigate]);

  const isShoppingCartSelected = location.pathname.startsWith('/groceries');

  return (
    <Container elevation={0}>
      <Divider />
      <ItemsContainer>
        <NavigationButton
          SelectedIcon={HomeIcon}
          UnselectedIcon={HomeOutlinedIcon}
          route={Route.Home}
        />
        <StyledNavigationButton onClick={handleShoppingCartClick} isSelected={isShoppingCartSelected}>
          {isShoppingCartSelected ? (
            <ShoppingCartIcon fontSize="large" />
          ) : (
            <ShoppingCartOutlinedIcon fontSize="large" />
          )}
        </StyledNavigationButton>
        <AddItemButton />
        <NavigationButton
          SelectedIcon={VolumeUpIcon}
          UnselectedIcon={VolumeUpOutlinedIcon}
          route={Route.NoiseTracking}
        />
        <NavigationButton
          SelectedIcon={ChecklistIcon}
          UnselectedIcon={ChecklistOutlinedIcon}
          route={Route.ToDoList}
        />
      </ItemsContainer>
    </Container>
  )
}

export default NavigationBar;
