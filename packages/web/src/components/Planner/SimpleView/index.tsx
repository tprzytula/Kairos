import ToDoItem from '../../ToDoItem';
import CollapsibleSection from '../../CollapsibleSection';
import SwipeableList from '../../SwipeableList';
import { Container } from './index.styled';
import { ISimpleViewProps } from './types';

const ALL_TASKS_ICON = {
  emoji: '✅',
  backgroundColor: '#f0f9ff',
  foregroundColor: '#0284c7'
};

const SimpleView = ({ 
  visibleToDoItems, 
  allExpanded, 
  expandKey, 
  onSwipeAction, 
  onEditAction 
}: ISimpleViewProps) => {
  return (
    <Container>
      <CollapsibleSection
        title="All Tasks"
        icon={ALL_TASKS_ICON}
        items={visibleToDoItems}
        expandTo={allExpanded}
        expandKey={expandKey}
      >
        <SwipeableList
          component={ToDoItem}
          list={visibleToDoItems}
          onSwipeAction={onSwipeAction}
          onEditAction={onEditAction}
          threshold={0.3}
        />
      </CollapsibleSection>
    </Container>
  );
};

export default SimpleView;
