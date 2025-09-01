import GroceryItem from '../../GroceryItem';
import SwipeableList from '../../SwipeableList';
import { Container } from './index.styled';
import { IUncategorizedViewProps } from './types';

const UncategorizedView = ({ groceryList, onDelete, onEdit }: IUncategorizedViewProps) => {
  return (
    <Container>
      <SwipeableList
        component={GroceryItem}
        list={groceryList}
        onSwipeAction={onDelete}
        onEditAction={onEdit}
        threshold={0.3}
      />
    </Container>
  );
};

export default UncategorizedView;
