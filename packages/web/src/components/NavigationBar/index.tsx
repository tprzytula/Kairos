import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NavigationButton from './NavigationButton';
import { Route } from '../../enums/route';
import { Container, Divider, ItemsContainer } from './index.styled';
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors';
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

  const isShoppingCartSelected = location.pathname.includes('/groceries') || location.pathname === Route.Shops;
  const isRecipesSelected = location.pathname === Route.Recipes;

  const handleRecipesClick = useCallback(() => {
    if (isRecipesSelected) {
      navigate(`${Route.Recipes}?action=new`);
    } else {
      navigate(Route.Recipes);
    }
  }, [isRecipesSelected, navigate]);

  return (
    <Container elevation={0}>
      <Divider />
      <ItemsContainer>
        <NavigationButton
          SelectedIcon={HomeIcon}
          UnselectedIcon={HomeOutlinedIcon}
          route={Route.Home}
          accentGradient={SECTION_GRADIENTS.home}
          accentRgb={SECTION_ACCENT_RGB.home}
        />
        <StyledNavigationButton onClick={handleShoppingCartClick} isSelected={isShoppingCartSelected} accentGradient={SECTION_GRADIENTS.grocery} accentRgb={SECTION_ACCENT_RGB.grocery}>
          <ShoppingCartIcon fontSize="large" />
        </StyledNavigationButton>
        <AddItemButton />
        <StyledNavigationButton onClick={handleRecipesClick} isSelected={isRecipesSelected} accentGradient={SECTION_GRADIENTS.recipe} accentRgb={SECTION_ACCENT_RGB.recipe}>
          {isRecipesSelected ? <MenuBookIcon fontSize="large" /> : <MenuBookOutlinedIcon fontSize="large" />}
        </StyledNavigationButton>
        <NavigationButton
          SelectedIcon={ChecklistIcon}
          UnselectedIcon={ChecklistOutlinedIcon}
          route={Route.Planner}
          accentGradient={SECTION_GRADIENTS.planner}
          accentRgb={SECTION_ACCENT_RGB.planner}
        />
      </ItemsContainer>
    </Container>
  )
}

export default NavigationBar;
