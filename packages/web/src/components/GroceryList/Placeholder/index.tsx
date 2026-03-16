import GroceryItemPlaceholder from '../../GroceryItem/Placeholder';
import GroupedListPlaceholder from '../../GroupedListPlaceholder';
import { Container } from './index.styled';
import { IPlaceholderProps } from './types';

const Placeholder = ({ numberOfGroups = 5 }: IPlaceholderProps) => (
  <Container>
    <GroupedListPlaceholder
      ItemPlaceholder={GroceryItemPlaceholder}
      ariaLabel="Loading grocery items"
      numberOfGroups={numberOfGroups}
    />
  </Container>
);

export default Placeholder;
