import GroceryItemPlaceholder from '../../GroceryItemPlaceholder';
import CollapsibleSectionPlaceholder from '../../CollapsibleSectionPlaceholder';
import { Container, PlaceholdersWrapper } from './index.styled';
import { IPlaceholderProps } from './types';

const Placeholder = ({ numberOfGroups = 5 }: IPlaceholderProps) => {
  return (
    <Container>
      <PlaceholdersWrapper aria-label="Loading grocery items">
        {Array.from({ length: numberOfGroups }).map((_, groupIndex) => (
          <CollapsibleSectionPlaceholder key={groupIndex}>
            {Array.from({ length: 2 + groupIndex }).map((_, itemIndex) => (
              <GroceryItemPlaceholder key={itemIndex} />
            ))}
          </CollapsibleSectionPlaceholder>
        ))}
      </PlaceholdersWrapper>
    </Container>
  );
};

export default Placeholder;
