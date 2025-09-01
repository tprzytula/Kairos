import EmptyState from '../../EmptyState';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IEmptyGroceryListProps } from './types';

const EmptyGroceryList = ({ 
  title = "No grocery items found", 
  subtitle = "Tap the + button to add your first item" 
}: IEmptyGroceryListProps) => {
  return (
    <EmptyState 
      icon={<ShoppingCartOutlinedIcon aria-label="Empty grocery list" />}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default EmptyGroceryList;
