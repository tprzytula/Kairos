import GroceryItem from '../../GroceryItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { IGroceryItem } from '../../../providers/AppStateProvider/types';

interface IPurchasedItemsSectionProps {
  purchasedList: IGroceryItem[];
  allExpanded?: boolean;
  expandKey?: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const PURCHASED_ICON = {
  emoji: '✅',
  backgroundColor: '#f0fdf4',
  foregroundColor: '#15803d',
};

const PurchasedItemsSection = ({
  purchasedList,
  allExpanded,
  expandKey,
  onDelete,
  onEdit,
}: IPurchasedItemsSectionProps) => {
  if (purchasedList.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection
      title="Purchased Items"
      icon={PURCHASED_ICON}
      items={purchasedList}
      expandTo={allExpanded}
      expandKey={expandKey}
    >
      <SwipeableList
        component={GroceryItem}
        list={purchasedList}
        onSwipeAction={onDelete}
        onEditAction={onEdit}
        threshold={0.3}
      />
    </CollapsibleSection>
  );
};

export default PurchasedItemsSection;
