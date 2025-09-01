import ToDoItem from '../../ToDoItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { Container } from './index.styled';
import { IGroupedViewProps } from './types';
import { TimeGroup } from '../utils/timeGrouping';
import { SectionIcon } from '../../CollapsibleSection/types';

const TIME_GROUP_ICON_MAP: Record<TimeGroup, SectionIcon> = {
  [TimeGroup.OVERDUE]: { emoji: '⚠️', backgroundColor: '#fef2f2', foregroundColor: '#dc2626' },
  [TimeGroup.TODAY]: { emoji: '📅', backgroundColor: '#ecfdf5', foregroundColor: '#059669' },
  [TimeGroup.TOMORROW]: { emoji: '📌', backgroundColor: '#eff6ff', foregroundColor: '#2563eb' },
  [TimeGroup.THIS_WEEK]: { emoji: '📆', backgroundColor: '#fefce8', foregroundColor: '#ca8a04' },
  [TimeGroup.NEXT_WEEK]: { emoji: '🗓️', backgroundColor: '#f0f9ff', foregroundColor: '#0284c7' },
  [TimeGroup.LATER]: { emoji: '⏳', backgroundColor: '#f8fafc', foregroundColor: '#64748b' },
  [TimeGroup.NO_DUE_DATE]: { emoji: '📝', backgroundColor: '#f5f5f5', foregroundColor: '#6b7280' },
};

const GroupedView = ({ 
  groupedToDoItems, 
  allExpanded, 
  expandKey, 
  onSwipeAction, 
  onEditAction 
}: IGroupedViewProps) => {
  return (
    <Container>
      {groupedToDoItems.map(({ group, groupLabel, items }) => (
        <CollapsibleSection
          key={group}
          title={groupLabel}
          icon={TIME_GROUP_ICON_MAP[group]}
          items={items}
          expandTo={allExpanded}
          expandKey={expandKey}
        >
          <SwipeableList
            component={ToDoItem}
            list={items}
            onSwipeAction={onSwipeAction}
            onEditAction={onEditAction}
            threshold={0.3}
          />
        </CollapsibleSection>
      ))}
    </Container>
  );
};

export default GroupedView;
