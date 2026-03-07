import ToDoItemPlaceholder from '../../ToDoItem/Placeholder';
import CollapsibleSectionPlaceholder from '../../CollapsibleSectionPlaceholder';
import { Container, PlaceholdersWrapper } from './index.styled';
import { IPlaceholderProps } from './types';

const Placeholder = ({ numberOfGroups = 4 }: IPlaceholderProps) => {
  return (
    <Container>
      <PlaceholdersWrapper aria-label="Loading to-do items">
        {Array.from({ length: numberOfGroups }).map((_, groupIndex) => (
          <CollapsibleSectionPlaceholder key={groupIndex}>
            {Array.from({ length: 3 + groupIndex }).map((_, itemIndex) => (
              <ToDoItemPlaceholder key={itemIndex} />
            ))}
          </CollapsibleSectionPlaceholder>
        ))}
      </PlaceholdersWrapper>
    </Container>
  );
};

export default Placeholder;
