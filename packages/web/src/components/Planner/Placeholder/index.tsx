import ToDoItemPlaceholder from '../../ToDoItem/Placeholder';
import GroupedListPlaceholder from '../../GroupedListPlaceholder';
import { Container } from './index.styled';
import { IPlaceholderProps } from './types';

const Placeholder = ({ numberOfGroups = 4 }: IPlaceholderProps) => (
  <Container>
    <GroupedListPlaceholder
      ItemPlaceholder={ToDoItemPlaceholder}
      ariaLabel="Loading to-do items"
      numberOfGroups={numberOfGroups}
      itemsPerGroup={(groupIndex) => 3 + groupIndex}
    />
  </Container>
);

export default Placeholder;
