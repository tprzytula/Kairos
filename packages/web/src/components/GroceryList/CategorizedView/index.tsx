import GroceryItem from '../../GroceryItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { CATEGORY_ICON_MAP } from '../utils/categoryIconMap';
import { Container } from './index.styled';
import { ICategorizedViewProps } from './types';

const CategorizedView = ({ categorizedGroups, allExpanded, expandKey, onDelete, onEdit }: ICategorizedViewProps) => {
  return (
    <Container>
      {categorizedGroups?.map((group) => (
        <CollapsibleSection
          key={group.category}
          title={group.label}
          icon={CATEGORY_ICON_MAP[group.category]}
          items={group.items}
          expandTo={allExpanded}
          expandKey={expandKey}
        >
          <SwipeableList
            component={GroceryItem}
            list={group.items}
            onSwipeAction={onDelete}
            onEditAction={onEdit}
            threshold={0.3}
          />
        </CollapsibleSection>
      ))}
    </Container>
  );
};

export default CategorizedView;
